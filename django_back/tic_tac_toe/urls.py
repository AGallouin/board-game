from django.urls import path
from .views import *

urlpatterns = [
    path("lobby", LobbyView.as_view()),
    path("<int:pk>/", GameView.as_view())
]