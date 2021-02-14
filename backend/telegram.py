from telethon import TelegramClient, events, sync, functions, types
from google.cloud import storage
from firebase import firebase
import os, sys, json, asyncio
from PIL import Image

api_id = 2231021
api_hash = '63b5a11ccd236e46ee28222132920ccf'
client = TelegramClient('tg', api_id, api_hash)
client.start()
firebase = firebase.FirebaseApplication('https://telerank-e9b37-default-rtdb.firebaseio.com/')
os.environ["GOOGLE_APPLICATION_CREDENTIALS"]= "./serviceAccountKey.json"
storage_client = storage.Client()
bucket = storage_client.get_bucket('telerank-e9b37.appspot.com')

loop = asyncio.get_event_loop()

async def grabInfo(x):
    print("xd")

    # get channel title, member count, description
    result = await client(functions.channels.GetFullChannelRequest(
        channel=x
    ))

    print(x)
    # Download photo and upload to Firebase Storage
    await client.download_profile_photo(x)

    imageBlob = bucket.blob("/")
    imagePath = "./"+x+".jpg"

    print("b")

    # ptimize photo
    img = Image.open(imagePath)
    new_width  = 640
    new_height = 640
    img = img.resize((new_width, new_height), Image.ANTIALIAS)
    print("c")
    img.save(imagePath, optimize = True,  quality = 10)
    
    print("d")
    # upload photo
    imageBlob = bucket.blob(x+".jpg")
    imageBlob.upload_from_filename(imagePath)
    print("e")
    os.remove("./"+x+".jpg")

    return {"image": imageBlob.public_url, "title": result.chats[0].title, "description": result.full_chat.about, "members": result.full_chat.participants_count}

arg = sys.argv[1]
usernames = arg.split(",")

def getAllInfos():
    final = []

    for x in usernames:
        result = client(functions.channels.GetFullChannelRequest(
            channel=x
        ))

        # Download photo and upload to Firebase Storage
        client.download_profile_photo(x)

        imageBlob = bucket.blob("/")
        imagePath = "./"+x+".jpg"

        # ptimize photo
        img = Image.open(imagePath)
        new_width  = 640
        new_height = 640
        img = img.resize((new_width, new_height), Image.ANTIALIAS)
        img.save(imagePath, optimize = True,  quality = 10)
        
        # upload photo
        imageBlob = bucket.blob(x+".jpg")
        imageBlob.upload_from_filename(imagePath)
        os.remove("./"+x+".jpg")

        final.append({"image": imageBlob.public_url, "title": result.chats[0].title, "description": result.full_chat.about, "members": result.full_chat.participants_count})

    print(json.dumps(final))
    sys.stdout.flush()

getAllInfos()


#async def main():
    #result = await asyncio.gather(*[grabInfo(x) for x in usernames])
    #print(result)

#loop.run_until_complete(main())