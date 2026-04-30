import json
from shared.utils import MessageBus

bus = MessageBus()
pubsub = bus.subscribe("finance_events")

print("Finance Service dinlemede...")

for message in pubsub.listen():
    if message['type'] == 'message':
        data = json.loads(message['data'])
        
        if data["event"] == "RESERVATION_CREATED":
            # GERÇEK ZAMANLI İŞLEM: Otomatik Folio (Hesap) oluştur
            res_id = data["reservation_id"]
            print(f"BİLGİ: Rezervasyon #{res_id} için otomatik fatura dökümü açıldı.")
            # Burada veritabanına Folio kaydı atılır.
