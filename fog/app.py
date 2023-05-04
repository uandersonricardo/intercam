import threading
import json
import re
import time
import urllib.request
from os import environ
from dotenv import load_dotenv
from flask import Flask, request
from http import client
from recognition import FaceRecognition

load_dotenv('.env')

app = Flask(__name__)

current_call = None
cam_index = int(environ.get('CAM_INDEX', 0))
stop_threads = False
threads = []

def create_call(result):
    global current_call

    image_base64 = result[0]
    location = result[1]
    person = result[2] if result[2] != '-' else None
    confidence = float(re.sub(r'[^0-9\.]', '', result[3])) if result[3] != '-' else None
    user = environ.get('USER_ID')

    conn = client.HTTPSConnection(environ.get('API_HOST'), int(environ.get('API_PORT')), timeout=10)
    headers = { 'Content-type': 'application/json' }

    data = {
        'image': image_base64,
        'location': location,
        'confidence': confidence,
        'detected': person,
        'user': user
    }

    json_data = json.dumps(data)

    conn.request('POST', '/calls', json_data, headers)
    response = conn.getresponse()

    if response.status == 200:
        response_json = json.loads(response.read().decode())
        print(response_json)
        current_call = response_json['id']
    else:
        print(response.read().decode())

def fetch_call():
    global current_call

    while True:
        if current_call != None:
            conn = client.HTTPSConnection(environ.get('API_HOST'), int(environ.get('API_PORT')), timeout=10)
            headers = { 'Content-type': 'application/json' }

            conn.request('GET', '/calls/' + current_call, headers=headers)
            response = conn.getresponse()

            if response.status == 200:
                response_json = json.loads(response.read().decode())

                if response_json['answer'] == True:
                    current_call = None
                elif response_json['answer'] == False:
                    current_call = None

        time.sleep(1)

def recognize():
    global stop_threads

    fr = FaceRecognition(cam_index)
    fr.setup_recognition()

    while True:
        result = fr.step_recognition()

        if result != None:
            create_call(result)

        if stop_threads or result != None:
            fr.stop_recognition()
            threads.remove(threading.current_thread())
            break

def send_answer(answer):
    conn = client.HTTPConnection(environ.get('DEVICE_HOST'), int(environ.get('DEVICE_PORT')), timeout=10)
    headers = { 'Content-type': 'application/json' }

    data = { 'answer': answer }
    json_data = json.dumps(data)

    conn.request('POST', '/answer', json_data, headers)

    response = conn.getresponse()
    print(response.read().decode())

@app.route('/face-recognition', methods=['POST', 'DELETE'])
def face_recognition():
    global stop_threads

    if request.method == 'POST':
        if len(threads) > 0:
            return {
                'success': False,
                'message': 'Recognition is already running'
            }

        t = threading.Thread(target=recognize)
        threads.append(t)
        t.start()

        return {
            'success': True
        }
    elif request.method == 'DELETE':
        stop_threads = True

        for t in threads:
            t.join()

        return {
            'success': True
        }

@app.route('/answer', methods=['POST'])
def send():
    if request.json['image'] != None:
        try:
            file_name = request.json['image'].split('/')[-1]
            f = open('faces/' + file_name,'wb')
            url = environ.get('API_URL') + '/' + request.json['image']
            print(url)
            f.write(urllib.request.urlopen(url).read())
            f.close()
        except:
            print('Error downloading image')

    send_answer(request.json['answer'])

    return {
        'success': True
    }

@app.route('/', methods=['GET'])
def home():
    return {
        'success': True
    }

if __name__ == '__main__':
    # t = threading.Thread(target=fetch_call)
    # t.start()
    app.run(host='0.0.0.0', debug = True)