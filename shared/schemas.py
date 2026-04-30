from pydantic import BaseModel
from typing import Optional

class TransactionRequest(BaseModel):
    reservation_id: int
    amount: float
    service_type: str # 'Restaurant', 'Spa', 'MiniBar'
    description: Optional[str] = None
