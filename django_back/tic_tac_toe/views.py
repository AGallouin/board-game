from django.shortcuts import render
from rest_framework.views import APIView
from .classes import *



class TicTacToeView(APIView):
    def test(self):
        return 0

"""     def post(self, request, format=None):

        self.clicked_square = request['squareId']
        print()
        
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST) """


def test(request):
    return render(request, 'tic_tac_toe/welcome.html')
