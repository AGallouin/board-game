from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/tictactoe/(?P<game_id>\w+)/$', consumers.TicTacToeConsumer.as_asgi())
]