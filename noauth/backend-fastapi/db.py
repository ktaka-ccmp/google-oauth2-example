# database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URI = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URI, connect_args={"check_same_thread": False}, echo=True
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
from pydantic import BaseModel

class CustomerBase(BaseModel):
    name: str
    email: str

Base.metadata.create_all(bind=engine)

