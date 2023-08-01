from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.exceptions import ValidationError
from rest_framework import status
from base.models import User
from .serializers import UserSerializer
from . import utils

decoder = utils.JWTDecoder()

@api_view(['GET', 'POST'])
def data_list(request):
    decoder.checkAuthorization(request)
    if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if User.objects.filter(username=request.data["username"]).exists(): #
            raise ValidationError("This username is already in use.")
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    # elif request.method == 'DELETE':
    #     count = User.objects.all().delete()
    #     return Response({'message': '{} users deleted successfully!'.format(count[0])},
    #                         status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'PUT', 'DELETE'])
def data_detail(request, pk):
    decoder.checkAuthorization(request)
    try:
        focus = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        user_serializer = UserSerializer(focus)
        return Response(user_serializer.data)
    elif request.method == "PUT":
        user_serializer = UserSerializer(focus, data=request.data)
        if user_serializer.is_valid():
            user_serializer.save()
            return Response(user_serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(user_serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    elif request.method == "DELETE":
        focus.delete()
        return Response({'message': 'User was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)