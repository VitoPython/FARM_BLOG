from motor.motor_asyncio import AsyncIOMotorClient
import urllib.parse


username = urllib.parse.quote_plus("vitaliipodgornii")
password = urllib.parse.quote_plus("Vitalik199712")
MONGO_URI = f"mongodb+srv://{username}:{password}@cluster0.jcrsrzo.mongodb.net/"

client = AsyncIOMotorClient(MONGO_URI) 
db = client['BLOG']