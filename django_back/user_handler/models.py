from django.db import models
from django import utils

# Create your models here.
class User(models.Model):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=50)
    createdAt = models.DateTimeField(default=utils.timezone.now)
    isLoggedIn = models.BooleanField(default=False)