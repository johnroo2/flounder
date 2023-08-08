from rest_framework import serializers
from base.models import User, Problem, PointUpdate

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"
        extra_kwargs = {
            'password': {'write_only': True}
        }

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("about", "image")

class ProblemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Problem
        fields = '__all__'

class PointUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PointUpdate
        fields = '__all__'