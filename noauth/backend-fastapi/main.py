from fastapi import Depends, FastAPI
from sqlalchemy.orm import Session
from db import Customer, CustomerBase, SessionLocal, CustomerList
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://v200.h.ccmp.jp:4000",
    ]

app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

def get_customer(db_session: Session, customer_id: int):
    return db_session.query(Customer).filter(Customer.id==customer_id).first()

def get_db():
    db_session = SessionLocal()
    try:
        yield db_session
    finally:
        db_session.close()

@app.get("/api/customer/")
def read_customers(db: Session = Depends(get_db)):
    q = db.query(Customer).offset(0).limit(100).all()
    result = CustomerList(description="hello", results=q)
    return result

@app.get("/customer/{customer_id}")
def read_customer(customer_id: int, db_session: Session = Depends(get_db)):
    todo = get_customer(db_session, customer_id)
    return todo

@app.post("/customer/")
def create_customer(customer: CustomerBase, db_session: Session = Depends(get_db)):
    db_customer = Customer(name=customer.name, email=customer.email)
    db_session.add(db_customer)
    db_session.commit()
    db_session.refresh(db_customer)
    return db_customer

@app.delete("/customer/{customer_id}")
async def delete_customer(customer_id: int, db_session: Session = Depends(get_db)):
    todo = get_customer(db_session, customer_id)
    db_session.delete(todo)
    db_session.commit()

