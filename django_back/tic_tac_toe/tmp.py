"""     


    def register_player(self) -> None:
        input_username: str = get_user_input() # Doit recevoir username, user_symbol
        input_user_symbol: str = get_user_input() # Doit recevoir username, user_symbol

        player = Player()
        player.update_player_info(input_username, input_user_symbol)
        self.players.append(player)



    def start_game(self) -> None:
        can_start: bool = self.state_checker.is_enough_player()
        if can_start:
            self.game_ongoing = True

    
        
    def register_move(self) -> None:
        square_id: int = get_user_input() # Doit recevoir username, user_symbol, square_number

        is_right_player: bool = self.state_checker.is_player_to_play(player_to_play, current_player)
        is_available: bool = self.state_checker.is_square_available(self.board, square_id)

        if (is_right_player & is_available):
            self.board.set_square_value(square_id, user_symbol)
            is_win: bool = self.check_win()
            if is_win:
                self.end_game()
            else:
                self.goto_next_player()



    def goto_next_player(self) -> None:
        
        nb_player: int = len(self.players) - 1

        current_player_id: int = self.players.index(self.current_player)
        next_player_id: int = current_player_id + 1 if (current_player_id < nb_player) else 0 
        self.current_player = self.players[next_player_id]
        
            
    def check_win(self) -> bool:
        
        check_if_condition_satisfied = [all(value == self.current_player.user_symbol for value in [self.board.square_value[square_id] for square_id in condition]) 
                                        for condition in self.win_condition]
        is_win = (True in check_if_condition_satisfied)

        return is_win


    def end_game(self) -> None:
        self.game_ongoing = False
        # Send notification to front about the winner """


""" 
class StateChecker(models.Model):

    enough_player = models.BooleanField(default=False)
    


    def is_enough_player(self, players: list[Player]) -> bool:
        
        if len(players) - 1 >= 2:
            can_start: bool = True
        else:
            can_start: bool = False
            self.notifier.notify_not_enough_player()
        
        return can_start


    def is_player_to_play(self, player_to_play: Player, current_player: Player) -> bool:
        
        if player_to_play == current_player:
            is_right_player: bool = True
        else:
            is_right_player: bool = False
            self.notifier.notify_player_wait()
        
        return is_right_player
        ## assert self.player_info[player.username][0] == self.current_player_id, "This is not your turn."
        
    
    def is_square_available(self, board: Board, square_id: int) -> bool:
        
        if board.square_value[square_id] == '':
            is_available: bool = True
        else:
            is_available: bool = False
            self.notifier.notify_square_not_available()
        
        return is_available
        ## assert self.game_board[chosen_square] == '', "This square has already been chosen. Choose another one."
 """