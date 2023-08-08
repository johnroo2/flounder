from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from base.models import Problem
from .serializers import ProblemSerializer
from . import utils

decoder = utils.JWTDecoder()

@api_view(['GET', 'POST', 'DELETE'])
def data_list(request):
    #decoder.checkAuthorization(request)
    if request.method == 'GET':
        problems = Problem.objects.all()
        serializer = ProblemSerializer(problems, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = ProblemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'PUT', 'DELETE'])
def data_detail(request, pk):
    #decoder.checkAuthorization(request)
    try:
        focus = Problem.objects.get(pk=pk)
    except Problem.DoesNotExist:
        return Response({'message': 'Problem not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        problem_serializer = ProblemSerializer(focus)
        return Response(problem_serializer.data)
    elif request.method == "PUT":
        problem_serializer = ProblemSerializer(focus, data=request.data)
        if problem_serializer.is_valid():
            problem_serializer.save()
            return Response(problem_serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(problem_serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    elif request.method == "DELETE":
        focus.delete()
        return Response({'message': 'Problem was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)