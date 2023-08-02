from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.exceptions import DoesNotExist
from rest_framework import status
from base.models import User
from . import utils

import datetime
import jwt

keyGenerator = utils.KeyGenerator()
decoder = utils.JWTDecoder()

@api_view(['GET'])
def auth(request):
    decoder.checkAuthorization(request)
    query = user.login(request.data["username"])

    found = User.objects.filter(username=query)
    if found:
        return Response(
            
        )
    else:
        raise DoesNotExist("User not found.")
