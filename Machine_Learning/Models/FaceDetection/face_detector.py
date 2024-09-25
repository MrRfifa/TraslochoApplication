import base64
import cv2
import numpy as np
import binascii  # For hex decoding

class FaceDetector:
    def __init__(self):
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    def is_human_face(self, hex_string):
        # Step 1: Remove "0x" prefix if present
        if hex_string.startswith("0x"):
            hex_string = hex_string[2:]

        # Step 2: Convert hex string to bytes
        try:
            img_data = binascii.unhexlify(hex_string)
            np_arr = np.frombuffer(img_data, np.uint8)
            img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

            # Check if image decoding was successful
            if img is None:
                # print("Image decoding failed: invalid image data")
                return False
            
            # Log the image dimensions
            # print(f"Image decoded successfully. Shape: {img.shape}")
            
            # Step 3: Convert to grayscale for face detection
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

            # Step 4: Detect faces
            faces = self.face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

            # Check if any faces are detected
            return len(faces) > 0

        except Exception:
            # print(f"Error during face detection: {e}")
            return False
