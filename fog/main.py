import argparse
from recognition import FaceRecognition

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--cam', type=int, default=0)
    args = parser.parse_args()

    fr = FaceRecognition(args.cam)
    fr.run_recognition()