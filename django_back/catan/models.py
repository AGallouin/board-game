from django.db import models
from ..user_handler.models import User


class Game(models.Model):
    player = models.ForeignKey(User, on_delete=models.CASCADE)

    def create_board():
        pass

    def register_player():
        pass

    def dice_roll():
        pass

    def define_move_order():
        pass
    
    def build_town():
        pass

    def build_road():
        pass
    
    def distribute_resources():
        pass

    def buy_development():
        pass
    
    def use_development():
        pass

    def upgrade_to_city():
        pass

    def trade():
        pass

    def move_thief():
        pass
    
    def discard_resources():
        pass

    def steal_card():
        pass

    def get_point():
        pass

    def end_game():
        pass



class Square(models.Model):

    RESOURCES: tuple[tuple[str, str]] = (
        ("Forest", "Forest"),
        ("Mountain", "Mountain"),
        ("Quarry", ""),
        ("Farm", ""),
        ("Meadow", ""),
        ("Desert", "Desert")
    )

    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    resource = models.CharField(max_length=1, choices=RESOURCES)
    col_id = models.IntegerField()
    row_id = models.IntegerField()


class Path(models.Model):
    