from abc import ABC, abstractmethod


class Board_Interface(ABC):
    
    @abstractmethod
    def change_board_size(self, size):
        pass
    
    @abstractmethod
    def get_board_info(self):
        pass



class Player_Interface(ABC):
    
    @abstractmethod
    def get_username(self, username):
        pass
        
    @abstractmethod
    def get_sign(self, chosen_sign):
        pass
    
    @abstractmethod
    def get_player_info(self):
        pass



class Game_Initializer_Interface(ABC):
    
    @abstractmethod
    def create_board(self, board):
        pass
    
    @abstractmethod
    def register_player(self, player):
        pass
        
    @abstractmethod
    def define_win_condition(self):
        pass
    
    @abstractmethod
    def show_initial_game_state(self):
        pass



class Game_Process_Interface(ABC):
    
    @abstractmethod
    def check_player(self, player):
        pass
    
    @abstractmethod
    def check_square(self, chosen_square):
        pass
    
    @abstractmethod
    def record_player_choice(self, chosen_square, player_sign):
        pass
    
    @abstractmethod
    def goto_next_player(self):
        pass

    @abstractmethod
    def check_game_state(self, player_sign):
        pass
    
    @abstractmethod
    def process_one_turn(self, player, chosen_square):
        pass
    
    @abstractmethod
    def show_game_state(self):
        pass