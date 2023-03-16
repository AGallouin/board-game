from django.db import models
from user_handler.models import User
from django.core.validators import MaxValueValidator, MinValueValidator


class Game(models.Model):

    board_size = models.IntegerField(default=3, validators=[MinValueValidator(3), MaxValueValidator(5)])
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="creator")
    opponent = models.ForeignKey(User, on_delete=models.CASCADE, related_name="opponent", blank=True, null=True)
    winner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="winner", blank=True, null=True)
    draw = models.BooleanField(default=False)
    current_turn = models.ForeignKey(User, on_delete=models.CASCADE, related_name="current_player")
   


    # Overriding Model class save() method in order to generate a new GameCell class (X times X class) at class creation
    def save(self, *args, **kwargs) -> None:
        if not self.pk:
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
                        


    def update_square_value(self, username: str, col_id: int, row_id: int) -> dict[str]:

        player_symbol: str = self.get_player_symbol(username)
        current_player: User = User.objects.get(username=username)

        # Start game if there are two players
        if (self.opponent is None):
            response = {"status": "error", "type": "ingame", "message": "Wait for an opponent to register"}
        else:
            # Play the game until there is a winner
            if (self.winner is not None):
                response = {"status": "error", "type": "ingame", "message": "The game is over"}
            else:
                # Check if this is the current player turn
                if (self.current_turn != current_player):
                    response = {"status": "error", "type": "ingame", "message": "This is not your turn to play"}
                else:
                    # Check if the square is free to be used
                    if (Square.objects.get(game=self.pk, col_id=col_id, row_id=row_id).value != ''):
                        response = {"status": "error", "type": "ingame", "message": "Square already taken"}
                    # If all conditions are passed, the move can be registered
                    else:
                        Square.objects.filter(game=self.pk, col_id=col_id, row_id=row_id).update(value=player_symbol)
                        response = {"status": "success", "type": "ingame", "message": {"col_id": col_id, "row_id": row_id, "square_value": player_symbol}}

                        is_win: bool = self.check_if_win()
                        is_draw: bool = self.check_if_draw()
                        self.next_step(is_win, is_draw)

        return response



    def get_column_values(self) -> list[list[str]]:
        column_values: list[list[str]] = []
        for i in range(self.board_size):
            one_column_values = [cell["value"] for cell in Square.objects.filter(game=self.pk, col_id=i).values()]
            column_values.append(one_column_values)
        
        return column_values
    


    def get_row_values(self) -> list[list[str]]:
        row_values: list[list[str]] = []
        for i in range(self.board_size):
            one_row_values = [cell["value"] for cell in Square.objects.filter(game=self.pk, col_id=i).values()]
            row_values.append(one_row_values)
        
        return row_values



    def get_diagonal_values(self) -> list[list[str]]:
        left_diagonal_values: list[str] = [Square.objects.get(game=self.pk, col_id=i, row_id=i).value for i in range(self.board_size)]
        right_diagonal_values: list[str] = [Square.objects.get(game=self.pk, col_id=self.board_size-1-i, row_id=i).value for i in range(self.board_size)]
        diagonal_values: list[list[str]] = [left_diagonal_values, right_diagonal_values]

        return diagonal_values



    def get_all_values(self) -> list[str]:
        all_values: list[str] = []
        all_values = [Square.objects.get(game=self.pk, col_id=j, row_id=i).value for i in range(self.board_size) for j in range(self.board_size)]
        print(all_values)
        return all_values



    def check_if_win(self) -> bool:
        
        all_values: list[list[str]] = self.get_column_values() + self.get_row_values() + self.get_diagonal_values()
        for values in all_values:
            is_not_initial_status = (values[0] != '')
            is_same_value: bool = all(cell_value == values[0] for cell_value in values)
            is_win = is_not_initial_status & is_same_value

            if is_win:
                return is_win

        return False



    def check_if_draw(self) -> bool:

        is_draw: bool = all(i != "" for i in self.get_all_values())
        if is_draw:
            return is_draw

        return False



    def next_step(self, is_win: bool, is_draw: bool):

        if (self.check_if_win() == True):
            self.winner = self.current_turn
            self.save()
            self.end_game()
        elif (is_draw):
            self.draw = True
            self.save()
            self.end_game()
        else:
            self.next_player_turn()



    def next_player_turn(self) -> None:
        self.current_turn = self.creator if self.current_turn == self.opponent else self.opponent
        self.save()



    def end_game(self) -> None:
        print("Game is over")



    @staticmethod
    def get_available_game():
        return Game.objects.filter(opponent=None)
    


    @staticmethod
    def get_unfinished_player_involved_game(username: str):
        player_pk = User.objects.get(username=username).pk
        return Game.objects.filter(creator=player_pk, winner=None, draw=False) | Game.objects.filter(opponent=player_pk, winner=None, draw=False)



    @staticmethod
    def get_board_status(pk: int):
        board_size: int = Game.objects.get(pk=pk).board_size
        board_status = {"board_size": board_size,
                        "board_status": 
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