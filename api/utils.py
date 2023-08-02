import json
import base64
from datetime import datetime
from rest_framework.exceptions import PermissionDenied

class KeyGenerator():
    def __init__(self):
        pass

    def getKey(self):
        return "11102006"

class JWTDecoder():
    def __init__(self):
        pass

    def getExpiry(self, token, is_expired=True):
        print("TOKEN" + token)
        current = datetime.utcnow()

        header, payload, signature = token.split('.')
        padding = 4 - (len(header) % 4)
        header += "=" * padding
        padding = 4 - (len(payload) % 4)
        payload += "=" * padding
        payload_dict = json.loads(base64.urlsafe_b64decode(payload.encode('utf-8')))
        stamp = payload_dict['exp']
        dt = datetime.utcfromtimestamp(stamp)
        print(dt)
        return current > dt if is_expired else dt

    def checkAuthorization(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        token = auth_header.split('Bearer ')[1] if auth_header else None
        if not token or self.getExpiry(token):
            raise PermissionDenied("Invalid token.")