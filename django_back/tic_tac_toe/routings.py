from django.urls import re_path
from .consumers import *

websocket_urlpatterns = [
    re_path(r"ws/tictactoe/(?P<game_id>\w+)$", GameConsumer.as_asgi())
]