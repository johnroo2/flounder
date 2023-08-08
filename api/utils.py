import json
import base64
from datetime import datetime
from rest_framework.exceptions import PermissionDenied
from PIL import Image
from io import BytesIO
import os

class KeyGenerator():
    def __init__(self):
        pass

    def getKey(self):
        return "11102006"

class JWTDecoder():
    def __init__(self):
        pass

    def getExpiry(self, token, is_expired=True):
        current = datetime.utcnow()

        header, payload, signature = token.split('.')
        padding = 4 - (len(header) % 4)
        header += "=" * padding
        padding = 4 - (len(payload) % 4)
        payload += "=" * padding
        payload_dict = json.loads(base64.urlsafe_b64decode(payload.encode('utf-8')))
        stamp = payload_dict['exp']
        dt = datetime.utcfromtimestamp(stamp)
        return current > dt if is_expired else dt

    def checkAuthorization(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        token = auth_header.split('Bearer ')[1] if auth_header else None
        if not token or self.getExpiry(token):
            raise PermissionDenied("Invalid token.")
        
class ImageToBase64():
    def __init__(self):
        pass

    def convertImage(self, image_path):
        try:
            script_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
            print(script_dir + image_path)
            image = Image.open(script_dir + image_path)

            image_bytes = BytesIO()
            image.save(image_bytes, format=image.format)
            image_bytes = image_bytes.getvalue()

            base64_str = base64.b64encode(image_bytes).decode('utf-8')

            return base64_str
        except Exception as e:
            print(f"Error converting image to base64: {e}")
            return None