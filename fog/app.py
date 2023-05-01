import threading
import json
from os import environ
from dotenv import load_dotenv
from flask import Flask, request
from http import client
from recognition import FaceRecognition

load_dotenv('.env')

app = Flask(__name__)

cam_index = int(environ.get('CAM_INDEX', 0))
stop_threads = False
threads = []

def recognize():
    global stop_threads

    fr = FaceRecognition(cam_index)
    fr.setup_recognition()

    while True:
        result = fr.step_recognition()

        if result != None:
            print(result)

        if stop_threads or result != None:
            fr.stop_recognition()
            threads.remove(threading.current_thread())
            break

@app.route("/face-recognition", methods=['POST', 'DELETE'])
def face_recognition():
    global stop_threads

    if request.method == 'POST':
        if len(threads) > 0:
            return {
                "success": False,
                "message": "Recognition is already running"
            }

        t = threading.Thread(target=recognize)
        threads.append(t)
        t.start()

        return {
            "success": True
        }
    elif request.method == 'DELETE':
        stop_threads = True

        for t in threads:
            t.join()

        return {
            "success": True
        }

@app.route("/send", methods=['GET'])
def send():
    conn = client.HTTPConnection('http://google.com', 80, timeout=10)
    headers = { 'Content-type': 'application/json' }

    data = { 'answer': True }
    json_data = json.dumps(data)

    conn.request('POST', '/post', json_data, headers)

    response = conn.getresponse()
    print(response.read().decode())

    return {
        "success": True
    }

@app.route("/", methods=['GET'])
def home():
    return {
        "success": True
    }

if __name__ == '__main__':
   app.run(host="0.0.0.0", debug = True)