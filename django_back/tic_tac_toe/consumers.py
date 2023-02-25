import json
from channels.generic.websocket import AsyncWebsocketConsumer

class TicTacToeConsumer(AsyncWebsocketConsumer):

    async def connect(self):

        await self.accept()

        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': 'You are now connected'
        }))

        self.game_id = self.scope['url_route']['kwargs']['game_id']
        self.game_group_name = 'tictactoe_%s' % self.game_id

        await self.channel_layer.group_add(
            self.game_group_name,
            self.channel_name
        )

        await self.channel_layer.group_send(
            self.game_group_name,
            {
                'type': 'tester_message',
                'tester': 'Hello World'
            }
        )

    async def tester_message(self, event):
        tester = event['tester']
        await self.send(text_data=json.dumps({
            'tester': tester
        }))


    async def disconnect(self, close_code):
        
        await self.channel_layer.group_discart(
            self.game_group_name,
            self.channel_name
        )