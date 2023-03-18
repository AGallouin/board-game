import { useState, useEffect } from 'react'


interface IGameStatus {
    firstPlayer: string | null, 
    secondPlayer: string | null, 
    currentTurn: string | null, 
    gameOver: boolean, 
    gameWinner: string | null, 
    isDraw: boolean
}


export default function useTictactoeLog(backendOutcome: any) {

    const [ error, setError ] = useState<string>("")
    const [ gameLog, setGameLog ] = useState<string[]>(["Game created"])
    const [ gameStatus, setGameStatus ] = useState<IGameStatus>({ 
        firstPlayer: null, 
        secondPlayer: null, 
        currentTurn: null, 
        gameOver: false, 
        gameWinner: null, 
        isDraw: false
    })


    useEffect(() => {

        if (backendOutcome && backendOutcome.status === "error") {

            switch (backendOutcome.data.category) {
                case "waiting_opponent":
                    setError("Please wait for an opponent to join the game")
                    break
                case "game_over":
                    setError("The game is already over")
                    break
                case "wrong_turn":
                    setError("This is not your turn. You cannot play on oppent's turn")
                    break
                case "square_taken":
                    setError("The selected square is already taken. Please choose another square")
                    break
                default:
                    break
            }
        }
        else if (backendOutcome && backendOutcome.status === "success") {

            setGameStatus({ 
                ...gameStatus, 
                firstPlayer: backendOutcome.data.board_status.creator, 
                secondPlayer: backendOutcome.data.board_status.opponent, 
                currentTurn: backendOutcome.data.board_status.current_player, 
                gameOver: backendOutcome.data.board_status.is_finished, 
                gameWinner: backendOutcome.data.board_status.winner, 
                isDraw: backendOutcome.data.board_status.draw
            })
            setError("")

            switch (backendOutcome.data.category) {
                case "game_join":
                    setGameLog([ ...gameLog, `${backendOutcome.data.username} joined the game` ])
                    break
                case "game_leave":
                    setGameLog([ ...gameLog, `${backendOutcome.data.username} left the game` ])
                    break
                case "turn_change":
                    setGameLog([ ...gameLog, `This is now ${backendOutcome.data.board_status.current_player} turn to play` ])
                    break
                case "is_winner":
                    setGameLog([ ...gameLog, `Congratulation! ${backendOutcome.data.board_status.winner} wins the game` ])
                    break
                case "is_draw":
                    setGameLog([ ...gameLog, `The game ended in a draw!` ])
                    break
                default:
                    break
            }
        }

    }, [backendOutcome])
        

    return { gameStatus, gameLog, error }
}
