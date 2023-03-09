from django.http import JsonResponse

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from rest_framework import status

from .models import *
from .serializers import *



class LobbyView(APIView):

    def get(self, request):
        available_games: dict[str, dict[int, str]] = {"available_games": [{ "id": game.pk, "created_by": game.creator.username } for game in Game.get_available_game()]}
        return JsonResponse(available_games)


    def post(self, request):        
        
        # Le serializer risque de ne pas marcher puisque l'on passe plus de data que nécessaire
        if request.data.get("method") == "new":
            serializer = GameSerializer(data=request.data)

            if serializer.is_valid():
                serializer.save({"creator": request.data.get("username")})
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        elif request.data.get("method") == "join":
            pk: int = request.data.get("pk")
            username: str = request.data.get("username")
            Game.objects.get(pk=pk).register_opponent(username)
            return Response({"status": "Success"}, status=status.HTTP_201_CREATED)



class GameView(APIView):
   
    def get(self, request):

        pk: int = 2
        # Trouver un moyen de retourner indice pk avec URL
        board_status = Game.get_board_status(pk)

        return JsonResponse(board_status)
    

    def post(self, request):

        pk:int=2 # Trouver un moyen de retourner indice pk avec URL

        serializer = SquareSerializer(data=request.data)

        if serializer.is_valid():
            username: str = request.data.get("username")
            col_id: int = request.data.get("col_id")
            row_id: int = request.data.get("row_id")
            response = Game.objects.get(pk=pk).update_square_value(username, col_id, row_id)
            return response
        
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
