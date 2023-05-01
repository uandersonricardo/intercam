import face_recognition
import os, sys
import cv2
import numpy as np
import math
import base64

# Helper
def face_confidence(face_distance, face_match_threshold=0.6):
    range = (1.0 - face_match_threshold)
    linear_val = (1.0 - face_distance) / (range * 2.0)

    if face_distance > face_match_threshold:
        return str(round(linear_val * 100, 2)) + '%'
    else:
        value = (linear_val + ((1.0 - linear_val) * math.pow((linear_val - 0.5) * 2, 0.2))) * 100
        return str(round(value, 2)) + '%'

class FaceRecognition:
    face_locations = []
    face_encodings = []
    face_names = []
    known_face_encodings = []
    known_face_names = []
    process_current_frame = True
    video_capture = None
    cam = 0

    def __init__(self, cam=0):
        self.encode_faces()
        self.cam = cam

    def encode_faces(self):
        for image in os.listdir('faces'):
            face_image = face_recognition.load_image_file(f"faces/{image}")
            face_encoding = face_recognition.face_encodings(face_image)[0]

            self.known_face_encodings.append(face_encoding)
            self.known_face_names.append(image)
        print(self.known_face_names)

    def setup_recognition(self):
        self.video_capture = cv2.VideoCapture(self.cam)

        if not self.video_capture.isOpened():
            sys.exit('Video source not found...')
        
    def step_recognition(self):
        ret, frame = self.video_capture.read()

        # Only process every other frame of video to save time
        if self.process_current_frame:
            # Resize frame of video to 1/4 size for faster face recognition processing
            small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)

            # Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)
            rgb_small_frame = small_frame[:, :, ::-1]

            # Find all the faces and face encodings in the current frame of video
            self.face_locations = face_recognition.face_locations(rgb_small_frame)
            self.face_encodings = face_recognition.face_encodings(rgb_small_frame, self.face_locations)

            self.face_names = []
            for face_encoding in self.face_encodings:
                # See if the face is a match for the known face(s)
                matches = face_recognition.compare_faces(self.known_face_encodings, face_encoding)
                name = "unknown"
                confidence = "0"

                # Calculate the shortest distance to face
                face_distances = face_recognition.face_distance(self.known_face_encodings, face_encoding)

                best_match_index = np.argmin(face_distances)
                if matches[best_match_index]:
                    name = self.known_face_names[best_match_index]
                    confidence = face_confidence(face_distances[best_match_index])

                # cv2.imwrite(f"images/{name.split('.')[0]}-{confidence}.jpg", frame)

                _, buffer = cv2.imencode('.jpg', frame)

                jpg_base64 = base64.b64encode(buffer)

                self.stop_recognition()

                return (jpg_base64, name.split(".")[0], confidence)

        self.process_current_frame = not self.process_current_frame
        return None

    def stop_recognition(self):
        self.video_capture.release()
        cv2.destroyAllWindows()

    def run_recognition(self):
        self.setup_recognition()

        while True:
            self.step_recognition()

        self.stop_recognition()
