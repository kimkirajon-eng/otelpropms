@app.get("/reset-db")
def reset_db():
    try:
        # Tabloyu tamamen yok et ve içindeki bozuk verileri temizle
        Base.metadata.drop_all(bind=engine)
        # Tabloyu tertemiz ve doğru formatta yeniden kur
        Base.metadata.create_all(bind=engine)
        return {"message": "Bozuk veriler temizlendi! Sistem artik tertemiz."}
    except Exception as e:
        return {"error": str(e)}
