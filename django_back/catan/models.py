import random
from django.db import models
from django.db.models import Min
from ..user_handler.models import User


class Game(models.Model):

    GAME_PHASES: tuple[tuple[str, str]] = (
        ("Initial", "Initial"),
        ("Set_Move_Order", "Set_Move_Order"),
        ("Game", "Game"),
        ("End", "End")
    )

    player_1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="player_one")
    player_2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="player_two", blank=True, null=True)
    player_3 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="player_three", blank=True, null=True)
    player_4 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="player_four", blank=True, null=True)
    player_5 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="player_five", blank=True, null=True)
    player_6 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="player_six", blank=True, null=True)
    registered_player = models.IntegerField(default=1)
    game_phase = models.CharField(max_length=len(max([max(choice, key=len) for choice in GAME_PHASES], key=len)), choices=GAME_PHASES)
    winner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="winner", blank=True, null=True)
    current_turn = models.ForeignKey(User, on_delete=models.CASCADE, related_name="current_turn")
    

    @staticmethod
    def get_nb_column(max_player: int) -> list[int]:
        
        min_col: int = 3
        # max_player is either 4 or 6
        max_col: int = int(min_col + max_player / 2)
        first_half: list[int] = [x for x in range(min_col, max_col + 1)]
        second_half: list[int] = [x for x in range(min_col, max_col)]
        second_half.reverse()

        nb_col_per_row: list[int] = first_half + second_half
        
        return nb_col_per_row
    

    @staticmethod
    def get_setup_material(material_type: str, max_player: int = 4, shuffle: bool = False) -> list[str] | list[tuple[int, int]]:
        
        # max_player is either 4 or 6
        if (max_player == 4):
            increment = 0
        elif (max_player == 6):
            increment = 1
        else:
            raise ValueError("max_player should only be either 4 or 6")
        
        match material_type: 
            case "tile_type":
                setup_material: list[tuple[str, int]] = [("Forest", 4+increment*2), ("Pasture", 4+increment*2), 
                                                         ("Field", 4+increment*2), ("Hill", 3+increment*2), 
                                                         ("Mountain", 3+increment*2), ("Desert", 1+increment)]
            case "tile_number":
                setup_material: list[tuple[int, int]] = [("2", 1+increment), ("3", 2+increment), ("4", 2+increment), 
                                                         ("5", 2+increment), ("6", 2+increment), ("8", 2+increment), 
                                                         ("9", 2+increment), ("10", 2+increment), ("11", 2+increment), 
                                                         ("12", 1+increment)]
            case "resource_card":
                setup_material: list[tuple[int, int]] = [("Lumber", 19+increment*5), ("Wool", 19+increment*5), 
                                                         ("Grain", 19+increment*5), ("Brick", 19+increment*5), 
                                                         ("Ore", 19+increment*5)]      
            case "development_card":
                setup_material: list[tuple[str, int]] = [("Knight", 14+increment*6), ("Victory", 5), ("Road", 2+increment), 
                                                         ("Resources", 2+increment), ("Monopoly", 2+increment)]
            case "architecture":
                setup_material: list[tuple[str, int]] = [("Town", 4), ("Colony", 5), ("Road", 15)]
            case _:
                raise NameError('Unknown material type')
        
        if (shuffle == True):
            initial_setup_list: list[list[str]] = [[material_name] * quantity for material_name, quantity in setup_material]
            initial_setup: list[str] = [item for sublist in initial_setup_list for item in sublist]
            random.shuffle(initial_setup)
            random.shuffle(initial_setup) # Shuffling twice to ensure a more balanced game
        else:
            initial_setup: list[tuple[str, int]] = setup_material

        return initial_setup


    def create_board(self, max_player: int) -> None:

        # max_player is either 4 or 6
        nb_col_per_row = Game.get_nb_column(max_player)
        nb_row: int = max_player + 1

        tile_type_list: list[str] = Game.get_setup_material("tile_type", max_player, shuffle=True)
        tile_number_list: list[str] = Game.get_setup_material("tile_number", max_player, shuffle=True)

        thief_index = tile_type_list.index("Desert") + 1

        tile_type_counter = 0
        tile_number_counter = 0
        for row in range(nb_row):
            for col in range(nb_col_per_row[row]):
                tile_type: str = tile_type_list[tile_type_counter]
                tile_type_counter += 1

                tile_number: int = int(tile_number_list[tile_number_counter]) if tile_type != "Desert" else 7
                tile_number_counter += 1 if tile_type != "Desert" else 0

                Hexagone.objects.create(game=self, col_id=col, row_id=row, tile_type=tile_type, 
                                        tile_number=tile_number, is_thief=(tile_type_counter==thief_index))


    def setup_materials(self, max_player: int) -> None:

        all_materials: dict[str, list[tuple[str, int]]] = {
            "Resource": Game.get_setup_material("resource_card", max_player),
            "Development": Game.get_setup_material("development_card", max_player),
            "Architecture": Game.get_setup_material("architecture", max_player)
        }
        for material_type, material_list in all_materials.items():
            for material_name, available_quantity in material_list:
                Materials.objects.create(game=self, material_type=material_type, material_name=material_name,
                                         available_quantity=available_quantity)



    def initialize_player(self, player_to_register: User, user_color: str) -> None:
        
        MoveOrder.objects.create(game=self, player_id=player_to_register, move_order=self.registered_player)

        all_materials: dict[str, list[tuple[str, int]]] = {
            "Resource": Game.get_setup_material("resource_card"),
            "Development": Game.get_setup_material("development_card"),
            "Architecture": Game.get_setup_material("architecture")
        }
        for material_type, material_list in all_materials.items():
            for material_name, available_quantity in material_list:
                if (material_type != "Architecture"):
                    Player.objects.create(game=self, player_id=player_to_register, color=user_color, 
                                          card_type=material_type, card_name=material_name)
                else:
                    Materials.objects.create(game=self, material_type=material_type, material_name=material_name, 
                                             player_id=player_to_register, available_quantity=available_quantity)


    def initialize_game(self, max_player: int, user_color: str) -> None:
        self.create_board(max_player)
        self.setup_materials(max_player)
        self.initialize_player(self.player_1, user_color)


    def register_player(self, username: str, user_color: str, max_player: int) -> None:

        player_to_register: User = User.objects.get(username=username)
        match self.registerd_player:
            case 1:
                self.player_2 = player_to_register
                self.initialize_player(self.player_2, user_color)
            case 2:
                self.player_3 = player_to_register
                self.initialize_player(self.player_3, user_color)
            case 3:
                self.player_4 = player_to_register
                self.initialize_player(self.player_4, user_color)
            case 4:
                if (max_player == 4):
                    raise Exception("Game is already full")
                else:
                    self.player_5 = player_to_register
                    self.initialize_player(self.player_5, user_color)
            case 5:
                if (max_player == 4):
                    raise Exception("Game is already full")
                else:
                    self.player_6 = player_to_register
                    self.initialize_player(self.player_6, user_color)
            case _:
                raise Exception("Game is already full")
            
        self.registerd_player += 1
        self.save()
         

    def process_one_turn(self, username: str):

        player_id: int = User.objects.get(username=username).pk

        match self.game_phase:
            case "Set_Move_Order":
                current_player: Player = Player.objects.get(player_id=player_id)
                MoveOrder.process_one_turn(game_id=self.pk, player_id=current_player.pk)

                if MoveOrder.is_any_duplicate():
                    self.next_player_turn(MoveOrder.get_next_roll_player(self.pk))
                else:
                    self.game_phase = "Game"
                    self.save()
            
            case "Game":
                pass


    def next_player_turn(self, player_id: int):
        self.current_turn = User.objects.get(id=player_id)
        self.save()


    def get_move_order(self):
        player_list: list[User] = [ self.player_1, self.player_2, self.player_3, self.player_4, self.player_5, self.player_6 ]
        player_list = player_list[:self.registered_player]
        [player.move_order for player in player_list]


    def build_town():
        pass

    def build_road():
        pass
    
    def distribute_resources():
        pass

    def buy_development():
        pass
    

    @staticmethod
    def get_card_effect():
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



class Hexagone(models.Model):

    RESOURCES: tuple[tuple[str, str]] = (
        ("Forest", "Forest"),
        ("Pasture", "Pasture"),
        ("Field", "Field"),
        ("Hill", "Hill"),
        ("Mountain", "Mountain"),
        ("Desert", "Desert")
    )

    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    tile_type = models.CharField(max_length=len(max([max(choice, key=len) for choice in RESOURCES], key=len)), choices=RESOURCES)
    tile_number = models.IntegerField()
    col_id = models.IntegerField()
    row_id = models.IntegerField()
    is_thief = models.BooleanField(default=False)



class Player(models.Model):

    CARD_TYPE: tuple[tuple[str, str]] = (
        ("Resource", "Resource"),
        ("Development", "Development")
    )

    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    player_id = models.ForeignKey(User, on_delete=models.CASCADE)
    color = models.CharField(unique=True)
    dice_roll = models.IntegerField(default=0)
    card_type = models.CharField(max_length=len(max([max(choice, key=len) for choice in CARD_TYPE], key=len)), choices=CARD_TYPE)
    card_name = models.CharField(max_length=50)
    in_hand_quantity = models.IntegerField(default=0)
    used_quantity = models.IntegerField(default=0)
    

    def roll_dice(self, dice_type: int) -> int:
        roll_result: int = random.randint(1, dice_type)
        self.dice_roll(roll_result)
        self.save()
        return roll_result



class Materials(models.Model):

    MATERIAL_TYPE: tuple[tuple[str, str]] = (
        ("Resource", "Resource"),
        ("Development", "Development"),
        ("Architecture", "Architecture")
    )

    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    player_id = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    material_type = models.CharField(max_length=len(max([max(choice, key=len) for choice in MATERIAL_TYPE], key=len)), 
                                     choices=MATERIAL_TYPE)
    material_name = models.CharField(max_length=50)
    available_quantity = models.IntegerField()



class MoveOrder(models.Model):

    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    player_id = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    cum_roll = models.FloatField(default=0.0)
    order = models.IntegerField()
    is_duplicate = models.BooleanField(default=True)
    has_rolled = models.BooleanField(default=False)


    @staticmethod
    def is_any_duplicate(game_id: int) -> bool:
        return MoveOrder.objects.filter(game=game_id, is_duplicate=True).exists()


    @staticmethod
    def roll_dice(game_id: int, player_id: int) -> None:
        dice_roll: int = Player.roll_dice(6)
        current_cum_roll: float = MoveOrder.objects.get(game_id=game_id, player_id=player_id).cum_roll
        if (current_cum_roll == 0):
            nb_digit = 0
        elif (str(current_cum_roll)[nb_digit + 1] == '0'):
            nb_digit = str(current_cum_roll)[::-1].find('.')
        else:
            nb_digit = str(current_cum_roll)[::-1].find('.') + 1

        new_cum_roll: float = current_cum_roll + dice_roll / 10**(nb_digit)
        MoveOrder.objects.filter(game_id=game_id, player_id=player_id).update(cum_roll=new_cum_roll)


    @staticmethod
    def set_has_rolled(game_id: int, player_id: int):
        MoveOrder.objects.filter(game_id=game_id, player_id=player_id).update(has_rolled=True)


    @staticmethod
    def set_move_order(game_id: int) -> None:
        player_list = MoveOrder.objects.filter(game=game_id)
        desc_cumulative_rolls = player_list.values_list("cum_roll", "player_id").order_by("-cum_roll")
        for i, player in enumerate(desc_cumulative_rolls):
            MoveOrder.objects.filter(game=game_id, player_id=player).update(order=i)  


    @staticmethod
    def set_is_duplicate(game_id: int):        
        all_rolls = MoveOrder.objects.filter(game=game_id).values_list("cum_roll", flat=True)
        element_index_dict = {key: [i for i, x in enumerate(all_rolls) if x == key] for key in all_rolls}
        duplicated_rolls = [key for key, value in element_index_dict.items() if len(value) > 1]
        for cumulative_roll in duplicated_rolls:
            MoveOrder.objects.filter(game=game_id, cum_roll=cumulative_roll).update(is_duplicate=True)
            MoveOrder.objects.filter(game=game_id, cum_roll=cumulative_roll).update(has_rolled=False)


    @staticmethod
    def get_next_roll_player(game_id: int) -> int:
        primary_condition = MoveOrder.objects.filter(game_id, cum_roll=0.0)
        secondary_condition = MoveOrder.objects.filter(game_id, has_rolled=False)
        if primary_condition.exists():
            next_player_recorded_move_order: int = primary_condition.aggregate(Min("move_order"))["move_order"]
        else:
            next_player_recorded_move_order: int = secondary_condition.aggregate(Min("move_order"))["move_order"]

        next_player_id: int = MoveOrder.objects.get(game_id=game_id, move_order= next_player_recorded_move_order).player_id

        return next_player_id


    @staticmethod
    def process_one_turn(game_id: int, player_id: int):
        MoveOrder.roll_dice(game_id, player_id)
        MoveOrder.set_has_rolled(game_id, player_id)
        MoveOrder.set_move_order(game_id)
        MoveOrder.set_is_duplicate(game_id)



class Road(models.Model):
    pass