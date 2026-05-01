import json
import asyncio
import os
from shared.utils import MessageBus

async def start_listening():
    # Redis bağlantısını kur
    bus = MessageBus()
    pubsub = bus.subscribe("finance_events")
    print("Finance Worker dinlemeye başladı... Mesaj bekleniyor.")
    
    # Render'da sistemi kilitlememek için asenkron döngü
    while True:
        try:
            # Mesaj var mı kontrol et
            message = pubsub.get_message(ignore_subscribe_messages=True)
            if message and message['type'] == 'message':
                data = json.loads(message['data'])
                print(f"BİLGİ: Yeni finansal işlem yakalandı -> {data}")
                
                # BURADA: Gelen veriye göre fatura/folio oluşturma işlemleri yapılacak
                # Örn: if data["event"] == "RESERVATION_CREATED": ...

            # CPU'yu %100 kullanmasın diye 1 saniye bekle
            await asyncio.sleep(1)
            
        except Exception as e:
            print(f"HATA: Worker döngüsünde bir sorun oluştu: {e}")
            await asyncio.sleep(5) # Hata durumunda biraz daha uzun bekle

if __name__ == "__main__":
    # Eğer bu dosya doğrudan çalıştırılırsa (test için)
    asyncio.run(start_listening())
