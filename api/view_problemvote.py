from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from base.models import ProblemVote, User, Problem
from .serializers import ProblemVoteSerializer
from django.core.exceptions import ObjectDoesNotExist
from . import utils

decoder = utils.JWTDecoder()

@api_view(['GET', 'POST', 'DELETE'])
def data_list(request):
    decoder.checkAuthorization(request)
    if request.method == 'GET':
        problemVotes = ProblemVote.objects.all()
        serializer = ProblemVoteSerializer(problemVotes, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        if 'user' in request.data and 'problem' in request.data:
            try:
                user = User.objects.get(id=request.data['user'])
                problem = Problem.objects.get(id=request.data['problem'])
                problem.updatevote_status()

                try:
                    focus = ProblemVote.objects.get(user=user, problem=problem)
                    
                    if request.data.get('status') == 0:
                        focus.delete()
                        return Response({'message': 'ProblemVote was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)
                    
                    problemVote_serializer = ProblemVoteSerializer(focus, data=request.data)
                    
                    if problemVote_serializer.is_valid():
                        problemVote_serializer.save()
                        return Response(problemVote_serializer.data, status=status.HTTP_202_ACCEPTED)
                    return Response(problemVote_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

                except ObjectDoesNotExist:
                    problemVote_serializer = ProblemVoteSerializer(data=request.data)

                    if problemVote_serializer.is_valid():
                        if request.data.get('status') == 0:
                            return Response({'message': 'Empty vote status'}, status=status.HTTP_200_OK)
                        problemVote_serializer.save()
                        return Response(problemVote_serializer.data, status=status.HTTP_201_CREATED)
                    return Response(problemVote_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            except (User.DoesNotExist, Problem.DoesNotExist):
                return Response({'message': 'User or Problem does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'message': "Missing params"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def data_detail(request, pk):
    decoder.checkAuthorization(request)
    try:
        focus = ProblemVote.objects.get(pk=pk)
    except ProblemVote.DoesNotExist:
        return Response({'message': 'ProblemVote not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        problemVote_serializer = ProblemVoteSerializer(focus)
        return Response(problemVote_serializer.data)
    elif request.method == "PUT":
        problemVote_serializer = ProblemVoteSerializer(focus, data=request.data)
        if problemVote_serializer.is_valid():
            problemVote_serializer.save()
            return Response(problemVote_serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(problemVote_serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    elif request.method == "DELETE":
        focus.delete()
        return Response({'message': 'ProblemVote was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)