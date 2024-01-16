# database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATA_STORE_URI = "sqlite:///data/data.db"

engine = create_engine(
    DATA_STORE_URI, connect_args={"check_same_thread": False}, echo=True
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# models.py
from sqlalchemy import Boolean, Column, Integer, String

class Customer(Base):
    __tablename__ = 'customer'
    id = Column('id', Integer, primary_key = True, autoincrement = True)
    name = Column('name', String(30))
    email = Column('email', String(254))

# schemas.py
from pydantic import BaseModel, EmailStr

class CustomerBase(BaseModel):
    id: int
    name: str
    email: EmailStr
    class Config:
        orm_mode = True

Base.metadata.create_all(bind=engine)


def get_db():
    ds = SessionLocal()
    try:
        yield ds
    finally:
        ds.close()

