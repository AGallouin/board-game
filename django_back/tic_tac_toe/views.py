from django.shortcuts import render
from rest_framework.views import APIView
from .classes import *
import tic_tac_toe.routing


class TicTacToeView(APIView):
    def test(self):
        return 0

"""     def post(self, request, format=None):

        self.clicked_square = request['squareId']
        print()
        
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST) """


def test(request, game_id):
    print(tic_tac_toe.routing.websocket_urlpatterns)
    return render(request, 'tic_tac_toe/welcome.html', {
        'game_id': game_id
    })
