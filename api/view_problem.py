from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from base.models import Problem, User
from django.db.models import F, Q
from rest_framework.exceptions import NotFound, APIException
from .serializers import ProblemSerializer, ProblemImageSerializer, PointUpdateSerializer, ProblemVoteSerializer
from . import utils

decoder = utils.JWTDecoder()

@api_view(['GET', 'POST', 'DELETE'])
def data_list(request):
    #decoder.checkAuthorization(request)
    if request.method == 'GET':
        problems = Problem.objects.all()
        for problem in problems:
            problem.updatevote_status()

        for key in request.GET.keys():
            filter_kwargs = {}
            if key == "creator":
                try:
                    value = request.GET[key]
                    username_filter = Q(user_id__username__icontains=value)
                    problems = Problem.objects.filter(username_filter)
                except: 
                    problems = Problem.objects.none()
            elif key == "value":
                try:
                    value = int(request.GET[key])
                    filter_kwargs["value__exact"] = value
                except: 
                    problems = Problem.objects.none()
            problems = problems.filter(**filter_kwargs)

        if request.GET.get('sortBy', False) and request.GET.get('sortDirection', False):
            prefix = ""
            if request.GET.get('sortDirection', 'asc') == "desc":
                prefix = "-"
            problems = problems.order_by(str(prefix) + str(request.GET.get('sortBy', 'pk')))
        else:
            problems = problems.order_by('pk')
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
    
@api_view(['GET','POST'])
def data_detail_key(request, key):
    #decoder.checkAuthorization(request)
    if request.method == "GET":
        found = Problem.objects.filter(key=key)
        if found:
            for find in found:
                find.updatevote_status()
                problem = find.public()
                return Response(problem)
        else:
            raise NotFound("Problem not found.")
    elif request.method == "POST":
        found = Problem.objects.filter(key=key)
        if found and request.data['user']:
            user = User.objects.get(username=request.data['user'])
            for find in found:
                if find.verify(request.data['answer']):
                    if user not in find.attempts.all(): #if user has NOT tried it yet
                        find.attempts.add(user) 
                        find.solvers.add(user)
                        
                        pointupdate_serializer = PointUpdateSerializer(data = 
                        {
                            "user":user.id,
                            "problem":find.id
                        })
                        if pointupdate_serializer.is_valid():
                            pointupdate_serializer.save()
                            return Response({'pass': 'correct', 'answer': find.options[find.answer], 'solution': find.solution})
                        else:
                            raise APIException("Could not update points")
                    else:
                        find.attempts.add(user) 
                        return Response({'pass': 'correct', 'answer': find.options[find.answer], 'solution': find.solution})
                find.attempts.add(user) 
            return Response({'pass': 'incorrect', 'answer': find.options[find.answer], 'solution': find.solution})
        else:
            raise NotFound("Problem not found.")
        
# @api_view(['POST'])
# def data_detail_vote(request, key):
#      #decoder.checkAuthorization(request)
#     found = Problem.objects.filter(key=key)
#     if found and request.data['user'] and request.data['status']:
#         user = User.objects.get(username=request.data['user'])
#         for find in found:
#             params =  {
#                 "user":user.id,
#                 "problem":find.id,
#                 "status":request.data['status']
#             }
#             if user not in find.voters.all():
#                 find.voters.add(user) 
                
#                 problemvote_serializer = ProblemVoteSerializer(data = params)
#                 if problemvote_serializer.is_valid():
#                     if request.data['status'] > 0:
#                         find.likes = find.likes + 1
#                     else:
#                         find.dislikes = find.dislikes + 1
#                     find.save()
#                     problemvote_serializer.save()
#                     find.updatevote_status()
#                     return Response(problemvote_serializer.data, status=status.HTTP_202_ACCEPTED)
#                 else:
#                     raise APIException("Could not update vote")
#             else:
#                 find.voters.remove(user)

#                 problemvote_serializer = ProblemVoteSerializer(data = params)
#                 if problemvote_serializer.is_valid():
#                     if request.data['status'] < 0:
#                         find.likes = find.likes - 1
#                     else:
#                         find.dislikes = find.dislikes - 1
#                     find.save()
#                     problemvote_serializer.save()
#                     find.updatevote_status()
#                     return Response(problemvote_serializer.data, status=status.HTTP_202_ACCEPTED)
#                 else:
#                     raise APIException("Could not delete vote")
#         raise NotFound('User not found')
#     else:
#         raise NotFound("Problem not found.")
        
@api_view(['GET'])
def data_detail_key_user(request, key, user):
    #decoder.checkAuthorization(request)
    found = Problem.objects.filter(key=key)
    if found:
        for find in found:
            find.updatevote_status()
            if user:
                userquery = User.objects.all().filter(username=user)
                for user in userquery:
                    problem = find.public(user)
                    return Response(problem)
            else:
                problem = find.public()
                return Response(problem)
    else:
        raise NotFound("Problem not found.")
        
    
@api_view(['PUT'])
def data_detail_image(request, pk):
    #decoder.checkAuthorization(request)
    try:
        focus = Problem.objects.get(pk=pk)
    except Problem.DoesNotExist:
        return Response({'message': 'Problem not found'}, status=status.HTTP_404_NOT_FOUND)

    problem_serializer = ProblemImageSerializer(focus, data=request.data)
    if problem_serializer.is_valid():
        problem_serializer.save()
        return Response(problem_serializer.data, status=status.HTTP_202_ACCEPTED)
    return Response(problem_serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)