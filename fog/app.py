import threading
from os import environ
from dotenv import load_dotenv
from flask import Flask, request
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
        fr.step_recognition()

        if stop_threads:
            fr.stop_recognition()
            break

@app.route("/face-recognition", methods=['POST', 'DELETE'])
def face_recognition():
    global stop_threads

    if request.method == 'POST':
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

if __name__ == '__main__':
   app.run(debug = True)