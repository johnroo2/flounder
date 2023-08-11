from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.utils.crypto import get_random_string
from api import utils
import json

# Create your models here.

imageHandler = utils.ImageToBase64()

class User(models.Model):
    username = models.CharField(max_length=20, unique=True)
    password = models.CharField(max_length=20)
    firstname = models.CharField(max_length=20)
    lastname = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    about = models.CharField(max_length=1000, blank=True)
    points = models.IntegerField(default=0)
    history = ArrayField(models.CharField(max_length=300), default=list)
    isAdmin = models.BooleanField(default=False)
    isMod = models.BooleanField(default=False)
    image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    token = models.CharField(max_length=1000, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    def public(self):
        return {
            "username": self.username,
            "id": self.id,
            "token": self.token,
            "updatedAt": self.updatedAt,
            "isAdmin": self.isAdmin,
            "isMod": self.isMod,
            "createdAt": self.createdAt,
        }
    
    def updatepoints(self):
        pointupdates = PointUpdate.objects.filter(user=self.id)
        sum = 0
        updates = []
        updates.append(json.dumps({'id':-1, 'value':0, 'date':self.createdAt.isoformat()}))
        if pointupdates:
            for update in pointupdates:
                problems = Problem.objects.filter(id=update.problem.id)
                if problems:
                    for problem in problems:
                        sum += problem.value
                        datestring = update.createdAt.isoformat()
                        updates.append(json.dumps({'id':problem.id, 'value':problem.value, 'date':datestring}))
        self.points = sum
        self.history = updates
        self.save()

    def profile(self, username):
        if username == self.username:
            return {
                "username": self.username,
                "firstname": self.firstname,
                "lastname": self.lastname,
                "about": self.about,
                "isAdmin": self.isAdmin,
                "isMod": self.isMod,
                "points": self.points,
                "history": self.history,
                "image": imageHandler.convertImage(self.image.url) if self.image else None,
                "createdAt": self.createdAt,
            }

    def login(self, username, password):
        if username == self.username and password == self.password:
            return self.public()
        return None
    
def generate_20_string():
    return get_random_string(20)

class Problem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    attempts = models.ManyToManyField(User, related_name='attempteds', blank=True)
    solvers = models.ManyToManyField(User, related_name='solveds', blank=True)
    title = models.CharField(max_length=100)
    question = models.CharField(max_length=10000)
    image = models.ImageField(upload_to='problem_images/', null=True, blank=True)
    key = models.CharField(default=generate_20_string, unique=True)
    options = ArrayField(models.CharField(max_length=500), size=6, default=list)
    answer = models.IntegerField()
    solution = models.CharField(max_length=10000, blank=True)
    likes = models.IntegerField(default=0)
    dislikes = models.IntegerField(default=0)
    vote_history = ArrayField(models.CharField(max_length=300), default=list)
    value = models.IntegerField()
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    def updatevote_status(self):
        problemvotes = ProblemVote.objects.filter(problem=self.id)
        likesum = 0
        dislikesum = 0
        updates = []
        updates.append(json.dumps({'id':-1, 'value':0, 'date':self.createdAt.isoformat()}))
        if problemvotes:
            for update in problemvotes:
                if update.status > 0:
                    likesum += 1
                else:
                    dislikesum += 1
                datestring = update.createdAt.isoformat()
                updates.append(json.dumps({'id':update.id, 'value':update.status, 'date':datestring}))
        self.likes = likesum
        self.dislikes = dislikesum
        self.history = updates
        self.save()

    def public(self, userquery=None):
        return {
            "creator":self.user.username,
            "title":self.title,
            "question":self.question,
            "image": imageHandler.convertImage(self.image.url) if self.image else None,
            "options": self.options,
            "value": self.value,
            "solvers":self.solvers.count(),
            "attempts":self.attempts.count(),
            "fresh":userquery not in self.attempts.all() if userquery else None,
            "selfsolved":userquery in self.solvers.all() if userquery else None,
            "likes":self.likes,
            "dislikes":self.dislikes,
            "vote_history": self.vote_history,
            "createdAt": self.createdAt,
        }

    def verify(self, answer):
        return answer == self.answer

class PointUpdate(models.Model):
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['problem', 'user']

class ProblemVote(models.Model):
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.IntegerField()
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['problem', 'user']
