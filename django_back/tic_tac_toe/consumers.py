import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .models import *


class GameConsumer(WebsocketConsumer):

    def connect(self):

        self.game_id = self.scope["url_route"]["kwargs"]["game_id"]
        self.game_group_name = "tictactoe_%s" % self.game_id

        async_to_sync(self.channel_layer.group_add)(self.game_group_name, self.channel_name)

        board_status = Game.get_board_status(pk=self.game_id)
        response = {"status": "success", "type": "connect", "message": "Websocket sucessfully connected"}
        response.update(board_status)

        self.accept()

        self.send(text_data=json.dumps(response))

    

    def disconnect(self, close_code):

        async_to_sync(self.channel_layer.group_discard)(
            self.game_group_name, self.channel_name
        )

        response = {"status": "success", "type": "disconnect", "message": "Websocket sucessfully disconnected"}

        self.send(text_data=json.dumps(response))



    def receive(self, text_data):

        json_data = json.loads(text_data)
        username = json_data["username"]
        col_id = json_data["col_id"]
        row_id = json_data["row_id"]
        response = Game.objects.get(pk=self.game_id).update_square_value(username, col_id, row_id)

        async_to_sync(self.channel_layer.group_send)(
            self.game_group_name,
            {
                "type": "game_message",
                "response": response
            }
        )
    

    def game_message(self, event):
        response = event["response"]
        self.send(text_data=json.dumps(response))