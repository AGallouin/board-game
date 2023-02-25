from django.urls import path
from .views import test

urlpatterns = [   
    path('<int:game_id>/', test, name='tictactoe')
]