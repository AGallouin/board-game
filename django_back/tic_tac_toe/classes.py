from .interfaces import *

class Board(Board_Interface):
    
    def __init__(self):
        self.size = 3
        
    def change_board_size(self, size):
        if (size < 3):
            raise Exception("Board size must be at least 3x3")
        else:
            self.size = size
            
    def get_board_info(self):
        print("Board dimension is: {0}x{0}".format(self.size))



class Player(Player_Interface):
    
    def __init__(self):
        self.username = 'New player'
        self.sign = 'None'
    
    def get_username(self, username: str) -> str:
        self.username = username
    
    def get_sign(self, chosen_sign: str) -> str:
        self.sign = chosen_sign
        
    def get_player_info(self):
        print("Username: {0}, User sign: {1}".format(self.username, self.sign))



class Game_Initializer(Game_Initializer_Interface):
    
    def __init__(self):
        self.board_size = 0
        self.game_board = {}
        self.player_info = {}
        self.nb_player = 0
        self.win_condition = 0
    
    
    def create_board(self, board):
        self.board_size = board.size
        self.game_board = {square_id: '' for square_id in range(self.board_size**2)}
    
    
    def register_player(self, player):
        self.nb_player += 1
        self.player_info[player.username] = (self.nb_player, player.sign)
        
        
    def define_win_condition(self):
        
        # Get Row Wise Win Condition
        cell_list = [x for x in range(len(self.game_board))]
        row_wise_win = [cell_list[i: i+self.board_size] for i in range(0, len(self.game_board), self.board_size)]
        
        # Get Column Wise Win Condition
        column_wise_win = []
        for i in range(self.board_size):
            for j in range(self.board_size):
                column_wise_win.append(i+self.board_size*j)
        column_wise_win = [column_wise_win[i: i+self.board_size] for i in range(0, len(self.game_board), self.board_size)]
        
        # Get Diagonal Wise Win Condition
        diagonal_wise_win = [[x for x in range(0, len(self.game_board), self.board_size+1)] , 
                             [x for x in range(self.board_size-1, len(self.game_board), self.board_size-1)][: self.board_size]]
        
        # Define the game winning condition
        self.win_condition = row_wise_win + column_wise_win + diagonal_wise_win
        
        
    def show_initial_game_state(self):
        print('Game Board:', self.game_board)
        print('Number of player:', self.nb_player)
        print('Player Info:', self.player_info)
        print('Win Condition:', self.win_condition)



class Game_Process(Game_Process_Interface):
    
    def __init__(self, initializer):
        for key, val in vars(initializer).items():
            setattr(self, key, val)
        self.current_player_id = 1
        self.turn_nb = 0
        self.game_finished = False        
        
    
    def check_player(self, player):
        assert self.player_info[player.username][0] == self.current_player_id, "This is not your turn."
        
    
    def check_square(self, chosen_square):
        assert self.game_board[chosen_square] == '', "This square has already been chosen. Choose another one."
        
    
    def goto_next_player(self):
        self.current_player_id += 1
        if self.current_player_id > self.nb_player:
            self.current_player_id = 1
        
            
    def check_game_state(self, player_sign):
        
        check_if_condition_satisfied = [all(value == player_sign for value in [self.game_board[i] for i in condition]) 
                                        for condition in self.win_condition]
        
        self.game_finished = True in check_if_condition_satisfied
        
        
    def record_player_choice(self, chosen_square, player_sign):
        
        self.game_board[chosen_square] = player_sign
    
    
    def process_one_turn(self, player, chosen_square):

        self.check_player(player)
        self.check_square(chosen_square)
        
        current_player_sign = self.player_info[player.username][1]
        
        self.record_player_choice(chosen_square, current_player_sign)
        
        self.check_game_state(current_player_sign)
        
        self.turn_nb += 1
        if(self.game_finished == False):
            self.goto_next_player()
        else:
            print("{0} wins the game".format(player.username))
            
        
    def show_game_state(self):
        print('Base Info__________')
        print('Number of player:', self.nb_player)
        print('Player Info:', self.player_info)
        print('Win Condition:', self.win_condition)
        print('Current State___________')
        print('Game Board:', self.game_board)
        print('Player to play:', self.current_player_id)
        print('Nb Turn:', self.turn_nb)
        print('Is the game finished?', self.game_finished) 