from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.exceptions import NotFound
from rest_framework import status
from base.models import User
from . import utils

import datetime
import jwt

keyGenerator = utils.KeyGenerator()
decoder = utils.JWTDecoder()

@api_view(['GET'])
def get(request, username):
    found = User.objects.filter(username=username)
    if found:
        for find in found:
            profile = find.profile(username)
            return Response(profile)
    else:
        raise NotFound("User not found.")
