from django.db import models
from user_handler.models import User
from rest_framework.response import Response

class Game(models.Model):

    board_size = models.IntegerField(default=3)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="creator", blank=True, null=True)
    opponent = models.ForeignKey(User, on_delete=models.CASCADE, related_name="opponent", blank=True, null=True)
    winner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="winner", blank=True, null=True)
    current_turn = models.ForeignKey(User, on_delete=models.CASCADE, related_name="current_player", blank=True, null=True)
   


    # Overriding Model class save() method in order to generate a new GameCell class (X times X class) at class creation
    def save(self, *args, **kwargs) -> None:
        if not self.pk:
            self.creator = kwargs.get("creator")
            super(Game, self).save(*args, **kwargs)
            self.create_board()
        else:        
            super(Game, self).save(*args, **kwargs)



    def create_board(self) -> None:
        for row in range(self.board_size):
            for col in range(self.board_size):
                Square.objects.create(
                    game=self,
                    col_id=col,
                    row_id=row,
                    value=''
                )



    def get_player_symbol(self, username: str) -> str:
        if (username == self.creator.username):
            player_symbol: str = 'X'
        elif (username == self.opponent.username):
            player_symbol: str = 'O'
        else:
            player_symbol: str = ''

        return player_symbol



    def register_opponent(self, username: str):
        player_to_register: User = User.objects.get(username=username)
        self.opponent = player_to_register
        self.save()
                        


    def update_square_value(self, username: str, col_id: int, row_id: int) -> Response:

        player_symbol: str = self.get_player_symbol(username)

        if (Square.objects.get(game=self.id, col_id=col_id, row_id=row_id).value == ''):
            Square.objects.filter(game=self.id, col_id=col_id, row_id=row_id).update(value=player_symbol)
            response = Response({"status" : "success", "message": "Square successfully updated"})
        elif (Square.objects.get(game=self.id, col_id=col_id, row_id=row_id).value != ''):
            response = Response(data={"status" : "error", "message": "Square already taken"}, status=400)
        else:
            response = Response(data={"status" : "error", "message": "Unexpected error"}, status=400)


        if (self.check_if_win() == True):
            self.end_game()
        else:
            self.next_player_turn()

        return response



    def get_column_values(self) -> list[list[str]]:
        column_values: list[list[str]] = []
        for i in range(self.board_size):
            one_column_values = [cell["value"] for cell in Square.objects.filter(game=self.id, col_id=i).values()]
            column_values.append(one_column_values)
        
        return column_values
    

    def get_row_values(self) -> list[list[str]]:
        row_values: list[list[str]] = []
        for i in range(self.board_size):
            one_row_values = [cell["value"] for cell in Square.objects.filter(game=self.id, col_id=i).values()]
            row_values.append(one_row_values)
        
        return row_values


    def get_diagonal_values(self) -> list[list[str]]:
        left_diagonal_values: list[str] = [Square.objects.get(game=self.id, col_id=i, row_id=i).value for i in range(self.board_size)]
        right_diagonal_values: list[str] = [Square.objects.get(game=self.id, col_id=self.board_size-1-i, row_id=i).value for i in range(self.board_size)]
        diagonal_values: list[list[str]] = [left_diagonal_values, right_diagonal_values]

        return diagonal_values


    def next_player_turn(self) -> None:
        self.current_turn = self.creator if self.current_turn == self.opponent else self.opponent
        self.save()
        


    def check_if_win(self, pk: int) -> bool:
        
        all_values: list[list[str]] = self.get_column_values(pk) + self.get_row_values(pk) + self.get_diagonal_values(pk)

        for values in all_values:
            is_not_initial_status = (values[0] != '')
            is_same_value: bool = all(cell_value == values[0] for cell_value in values)
            is_win = is_not_initial_status & is_same_value

            if is_win:
                return is_win

        return False


    def end_game(self) -> None:
        self.winner = self.current_turn
        self.save()


    @staticmethod
    def get_available_game():
        return Game.objects.filter(opponent=None, winner=None)


    @staticmethod
    def get_board_status(pk: int):
        board_status = {"board_status": 
                        [{"col_id": square.col_id, 
                          "row_id": square.row_id, 
                          "value": square.value} 
                          for square in Square.objects.filter(game=pk)
                        ]}
        return board_status



class Square(models.Model):

    POTENTIAL_CELL_VALUE = (
        ('', ''),
        ('X', 'X'),
        ('O', 'O')
    )

    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    col_id = models.IntegerField()
    row_id = models.IntegerField()
    value = models.CharField(max_length=1, choices=POTENTIAL_CELL_VALUE)