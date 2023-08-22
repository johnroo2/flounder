from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from base.models import PointUpdate
from .serializers import PointUpdateSerializer
from . import utils

decoder = utils.JWTDecoder()

@api_view(['GET', 'POST', 'DELETE'])
def data_list(request):
    decoder.checkAuthorization(request)
    if request.method == 'GET':
        pointUpdates = PointUpdate.objects.all()
        serializer = PointUpdateSerializer(pointUpdates, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = PointUpdateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'PUT', 'DELETE'])
def data_detail(request, pk):
    decoder.checkAuthorization(request)
    try:
        focus = PointUpdate.objects.get(pk=pk)
    except PointUpdate.DoesNotExist:
        return Response({'message': 'PointUpdate not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        pointUpdate_serializer = PointUpdateSerializer(focus)
        return Response(pointUpdate_serializer.data)
    elif request.method == "PUT":
        pointUpdate_serializer = PointUpdateSerializer(focus, data=request.data)
        if pointUpdate_serializer.is_valid():
            pointUpdate_serializer.save()
            return Response(pointUpdate_serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(pointUpdate_serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    elif request.method == "DELETE":
        focus.delete()
        return Response({'message': 'PointUpdate was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)