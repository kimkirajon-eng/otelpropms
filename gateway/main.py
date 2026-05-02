import os
import httpx
import json
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SERVICES = {
    "auth": os.getenv("IDENTITY_SERVICE_URL", "").rstrip('/'),
    "res": os.getenv("RESERVATION_SERVICE_URL", "").rstrip('/'),
    "hk": os.getenv("HK_SERVICE_URL", "").rstrip('/'),
    "finance": os.getenv("FINANCE_SERVICE_URL", "").rstrip('/')
}

@app.api_route("/{service_name}/{rest_of_path:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
async def proxy(service_name: str, rest_of_path: str, request: Request):
    if service_name not in SERVICES:
        return JSONResponse({"error": "Servis yok"}, status_code=404)

    target_url = f"{SERVICES[service_name]}/{rest_of_path}"
    body = await request.body()
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.request(
                method=request.method,
                url=target_url,
                params=request.query_params,
                content=body,
                headers={k: v for k, v in request.headers.items() if k.lower() != "host"},
                timeout=20.0
            )
            
            # TEMİZLEME MOTORU:
            try:
                # 1. Ham veriyi utf-8-sig ile çöz (BOM karakterlerini siler)
                raw_content = response.content.decode("utf-8-sig").strip()
                
                # 2. Gerçek JSON'un başladığı ve bittiği yeri bul (Cımbızla çek)
                start = raw_content.find('[') if '[' in raw_content else raw_content.find('{')
                end = (raw_content.rfind(']') if ']' in raw_content else raw_content.rfind('}')) + 1
                
                if start != -1 and end != 0:
                    clean_json = raw_content[start:end]
                    # 3. Python objesine çevirerek doğrula
                    data = json.loads(clean_json)
                    return JSONResponse(content=data, status_code=response.status_code)
                
                return JSONResponse(content=json.loads(raw_content))
            except:
                # Hata olursa en azından patlamasın diye ham metni dönmeye çalış
                return JSONResponse({"error": "Format Hatasi", "raw": str(response.content[:50])})
                
        except Exception as e:
            return JSONResponse({"error": str(e)}, status_code=500)

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run(app, host="0.0.0.0", port=port)
