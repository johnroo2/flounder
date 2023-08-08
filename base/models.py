from django.db import models
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
    points = models.IntegerField(default=0, blank=True)
    token = models.CharField(max_length=1000, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    def public(self):
        return {
            "username": self.username,
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
                "points": self.points,
                "createdAt": self.createdAt,
            }

    def login(self, username, password):
        if username == self.username and password == self.password:
            return self.public()
        return None


class Problem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.CharField(max_length=10000)
    image = models.ImageField(upload_to='problem_images/', null=True, blank=True)
    answer = models.IntegerField()
    solution = models.CharField(max_length=10000, blank=True)
    value = models.IntegerField()
