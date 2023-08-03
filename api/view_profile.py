from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.exceptions import NotFound
from rest_framework import status
from base.models import User
from .serializers import ProfileSerializer
from . import utils

keyGenerator = utils.KeyGenerator()
decoder = utils.JWTDecoder()

@api_view(['GET', 'PUT'])
def data_list(request, username):
    if request.method == "GET":
        found = User.objects.filter(username=username)
        if found:
            for find in found:
                profile = find.profile(username)
                return Response(profile)
        else:
            raise NotFound("User not found.")
    elif request.method == "PUT":
        focus = User.objects.get(username = username)
        prof_serializer = ProfileSerializer(focus, data=request.data)
        if prof_serializer.is_valid():
            prof_serializer.save()
            return Response(prof_serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(prof_serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)