import uvicorn
from fastapi import FastAPI, Request
import httpx # Asenkron HTTP istekleri için
import os

app = FastAPI()

IDENTITY_URL = os.getenv("IDENTITY_SERVICE_URL", "http://localhost:8001")

@app.api_route("/auth/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def proxy_identity(request: Request, path: str):
    async with httpx.AsyncClient() as client:
        url = f"{IDENTITY_URL}/auth/{path}"
        content = await request.body()
        resp = await client.request(
            method=request.method,
            url=url,
            content=content,
            headers=dict(request.headers)
        )
        return resp.json()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
