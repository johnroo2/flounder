from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.utils.crypto import get_random_string
from api import utils

# Create your models here.

imageHandler = utils.ImageToBase64()

class User(models.Model):
    username = models.CharField(max_length=20, unique=True)
    password = models.CharField(max_length=20)
    firstname = models.CharField(max_length=20)
    lastname = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    about = models.CharField(max_length=1000, blank=True)
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
        }

    def profile(self, username):
        if username == self.username:
            return {
                "username": self.username,
                "firstname": self.firstname,
                "lastname": self.lastname,
                "email": self.email,
                "about": self.about,
                "isAdmin": self.isAdmin,
                "isMod": self.isMod,
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
    attempts = models.ManyToManyField(User, related_name='attempteds')
    solvers = models.ManyToManyField(User, related_name='solveds')
    title = models.CharField(max_length=100)
    question = models.CharField(max_length=10000)
    image = models.ImageField(upload_to='problem_images/', null=True, blank=True)
    key = models.CharField(default=generate_20_string, unique=True)
    options = ArrayField(models.CharField(max_length=500), size=6, default=list)
    answer = models.IntegerField()
    solution = models.CharField(max_length=10000, blank=True)
    value = models.IntegerField()
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    def public(self, userquery=None):
        temp_attempts = self.attempts.all()
        fresh = False
        for user in temp_attempts:
            if not user: break
            else:
                if(user.username == userquery):
                    fresh = True

        return {
            "creator":self.user.username,
            "title":self.title,
            "question":self.question,
            "image": imageHandler.convertImage(self.image.url) if self.image else None,
            "options": self.options,
            "value": self.value,
            "solvers":self.solvers.count(),
            "attempts":self.attempts.count(),
            "fresh":fresh,
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