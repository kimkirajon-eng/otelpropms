import os
import httpx
import json
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI(title="OtelPro API Gateway")

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

@app.get("/")
async def root():
    return {"status": "Gateway Live", "services": list(SERVICES.keys())}

@app.api_route("/{service_name}/{rest_of_path:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
async def proxy(service_name: str, rest_of_path: str, request: Request):
    if service_name not in SERVICES or not SERVICES[service_name]:
        return JSONResponse({"error": "Servis adresi bulunamadi"}, status_code=404)

    target_url = f"{SERVICES[service_name]}/{rest_of_path}"
    print(f"📤 Proxy istegi: {request.method} {target_url}") # Debug log
    
    async with httpx.AsyncClient() as client:
        try:
            body = await request.body()
            response = await client.request(
                method=request.method,
                url=target_url,
                params=request.query_params,
                content=body,
                headers={k: v for k, v in request.headers.items() if k.lower() != "host"},
                timeout=30.0
            )
            
            print(f"📥 Yanıt kodu: {response.status_code}") # Debug log
            
            try:
                # UTF-8 temizliği ve JSON parsing
                clean_text = response.content.decode("utf-8-sig").strip()
                print(f"📦 Temiz veri: {clean_text[:200]}...") # Debug log
                
                data = json.loads(clean_text)
                return JSONResponse(content=data, status_code=response.status_code)
            except json.JSONDecodeError as e:
                print(f"❌ JSON Parse Hatası: {e}") # Debug log
                print(f"   Raw: {response.text[:200]}") # Debug log
                return JSONResponse(
                    {"error": "JSON parse hatası", "raw": response.text[:200]}, 
                    status_code=500
                )

        except Exception as e:
            print(f"❌ Baglanti hatasi: {str(e)}") # Debug log
            return JSONResponse(
                {"error": "Baglanti hatasi", "detail": str(e)}, 
                status_code=500
            )

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run(app, host="0.0.0.0", port=port)
