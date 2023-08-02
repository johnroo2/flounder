from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import status
from base.models import User
from . import utils

import datetime
import jwt

keyGenerator = utils.KeyGenerator()

@api_view(['POST'])
def auth(request):
    try:
        userList = User.objects.all()
        for user in userList:
            login = user.login(request.data["username"], request.data["password"])
            if login:
                payload = {
                    'user_id': user.id,
                    'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
                }
                secret_key = keyGenerator.getKey()
                token = {"token": jwt.encode(payload, secret_key, algorithm='HS256')}
                user.token = token["token"]
                user.save()
                return Response({**login, **token})

        raise AuthenticationFailed("Credentials")

    except AuthenticationFailed as e:
        return Response(str(e), status=status.HTTP_401_UNAUTHORIZED)

    except Exception as e:
        return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)