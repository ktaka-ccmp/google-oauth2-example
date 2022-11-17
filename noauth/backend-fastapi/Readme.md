
# A simple FastAPI example

```
cd backend/
python3 -m venv .venv
source .venv/bin/activate
pip install fastapi sqlalchemy uvicorn

python3 db.py
./create_data.sh
echo "select * from customer"  | sqlite3 test.db

uvicorn main:app  --host 0.0.0.0 --reload
```
