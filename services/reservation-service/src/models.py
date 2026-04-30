from sqlalchemy import Column, Integer, String, Date, ForeignKey, Float
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Room(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True)
    room_number = Column(String, unique=True)
    room_type = Column(String) # Suite, Standard
    current_status = Column(String, default="Clean") # Clean, Dirty

class Reservation(Base):
    __tablename__ = "reservations"
    id = Column(Integer, primary_key=True)
    guest_name = Column(String)
    room_id = Column(Integer, ForeignKey("rooms.id"))
    checkin_date = Column(Date)
    checkout_date = Column(Date)
    status = Column(String, default="Booked") # Booked, In-House
