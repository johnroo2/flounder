from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.exceptions import ValidationError, NotFound
from rest_framework import status
from base.models import User, PointUpdate, Problem
from .serializers import UserSerializer, ProfileSerializer
from . import utils

decoder = utils.JWTDecoder()

@api_view(['GET', 'POST'])
def data_list(request):
    if request.method == 'GET':
        #decoder.checkAuthorization(request)
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if User.objects.filter(username=request.data["username"]).exists():
            raise ValidationError("This username is already in use.")
        if serializer.is_valid():
            serializer.save()
            found = User.objects.get(username=request.data["username"])
            return Response(found.public(), status=status.HTTP_201_CREATED)
        return Response(serializer.data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'PUT'])
def data_detail_profile(request, username):
    if request.method == "GET":
        found = User.objects.filter(username=username)
        if found:
            for find in found:
                profile = find.profile(username)
                return Response(profile)
        else:
            raise NotFound("User not found.")
    elif request.method == "PUT":
        focus = User.objects.get(username=username)
        prof_serializer = ProfileSerializer(focus, data=request.data)
        if prof_serializer.is_valid():
            prof_serializer.save()
            return Response(prof_serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(prof_serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
def data_detail_points(request, username):
    #decoder.checkAuthorization(request)
    found = User.objects.filter(username=username)
    if found:
        for find in found:
            pointupdates = PointUpdate.objects.filter(user=find.id)
            sum = 0
            updates = []
            updates.append({'id':-1, 'value':0, 'date':find.createdAt})
            if pointupdates:
                for update in pointupdates:
                    problems = Problem.objects.filter(id=update.problem.id)
                    if problems:
                        for problem in problems:
                            sum += problem.value
                            updates.append({'id':problem.id, 'value':problem.value, 'date':update.createdAt})
            return Response({'points':sum, 'history':updates}, status=status.HTTP_200_OK)


@api_view(['GET', 'PUT', 'DELETE'])
def data_detail(request, pk):
    #decoder.checkAuthorization(request)
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