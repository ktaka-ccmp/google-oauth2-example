
# A simple FastAPI example

```
cd backend/
python3 -m venv .venv
source .venv/bin/activate
pip install fastapi sqlalchemy uvicorn pydantic[email]

python3 data/db.py
./data/create_data.sh

uvicorn main:app  --host 0.0.0.0 --reload
```
