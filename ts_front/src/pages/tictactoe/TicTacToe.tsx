/* Base */
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

/* Context */
import { useAuthContext } from "../../hooks/useAuthContext";

/* Hooks */
import useTictactoeLog from '../../hooks/useTictactoeLog';

/* Styling */
import './Tictactoe.css'


interface IBackEndSquareProp {
    col_id: number,
    row_id: number,
    value: string
}


interface IFrontEndSquareProp {
    squareColId: number,
    squareRowId: number,
    squareValue: string,
    handleClick: (e:React.MouseEvent<HTMLButtonElement>, squareColId: number, squareRowId: number) => void
}


interface IInitializationData {
    board_size: number,
    board_status: IBackEndSquareProp[]
}


function Square( {squareColId, squareRowId, squareValue, handleClick }: IFrontEndSquareProp )  {
    return(
        <button className='square' onClick={(e) => handleClick(e, squareColId, squareRowId)}>
            {squareValue}
        </button>
    )
}



export default function Tictactoe() {

    const boardSize = useRef<number>(0)
    const initialBoardState = useRef<IBackEndSquareProp[]>([])
    const initialSquareMatrix = useRef<string[][]>([]);
    const colId = useRef<number[]>([])
    const rowId = useRef<number[]>([])

    const [ isInitialized, setIsInitialized ] = useState<boolean>(false)
    const [ squareMatrix, setSquareMatrix ] = useState<string[][]>([])

    const [ backendMessage, setBackendMessage ] = useState<any>(null)
    const { gameStatus, gameLog, error } = useTictactoeLog(backendMessage)

    const { state } = useAuthContext()
    const { id } = useParams()
    const ws = useRef<WebSocket | null>(null)
    const ws_url: string = "ws://127.0.0.1:8000/ws/tictactoe/" + id
    const navigate = useNavigate()


    const initializeBoard = (jsonData: IInitializationData) => {
        boardSize.current = jsonData.board_size
        colId.current = Array.from(Array(boardSize.current).keys())
        rowId.current = Array.from(Array(boardSize.current).keys())
        initialBoardState.current = jsonData.board_status
        initialSquareMatrix.current = Array.from({length: boardSize.current},()=> Array.from({length: boardSize.current}, () => ""))
        initializeSquareMatrix()
        setIsInitialized(true)
    }


    const initializeSquareMatrix = () => {
        initialBoardState.current.map((square: IBackEndSquareProp) => {
            initialSquareMatrix.current[square.col_id][square.row_id] = square.value
        })
        setSquareMatrix(initialSquareMatrix.current)
    }


    const changeSquareValue = (colId : number, rowId: number, value: string) => {
        let tmp = [ ...squareMatrix ];
        tmp[colId][rowId] = value
        setSquareMatrix(tmp);
    }


    useEffect(() => {
        ws.current = new WebSocket(ws_url);

        ws.current.onopen = () => {
            if (!ws.current) {return};
            console.log("Websocket connection opened")
            ws.current.send(JSON.stringify({message_category: "management", details: "connect", username: state.username}))
        }
            
        ws.current.onclose = () => {
            if (!ws.current) {return};
            console.log("Websocket connection closed")
        }

        const wsCurrent = ws.current;

        return () => {
            wsCurrent.close();
        };

    }, [ws_url])



    useEffect(() => {

        if (!ws.current) {return}

        ws.current.onmessage = function (res: MessageEvent) {

            const jsonData = JSON.parse(res.data);
            setBackendMessage(jsonData)
            console.log(jsonData)

            if (jsonData.status === "success" && jsonData.type === "game_system" && jsonData.data.category != "game_leave") {
                initializeBoard(jsonData.data.board_status)
            }
            if (jsonData.status === "success" && jsonData.type === "in_game") {
                changeSquareValue(jsonData.data.col_id, jsonData.data.row_id, jsonData.data.value)
            }

        }

    }, [isInitialized, squareMatrix, backendMessage])

    
    
    const handleClick = (e:React.MouseEvent<HTMLButtonElement>, squareColId: number, squareRowId: number) => {     

        if (!ws.current) {console.log("No WebSocket Connection"); return};
        const username: string | null = state.username
        ws.current.send(JSON.stringify({message_category: "game", username: username, col_id: squareColId, row_id: squareRowId}));
    }


    const goToLobby = (e:React.MouseEvent<HTMLButtonElement>) => {
        navigate("/tictactoe/lobby/" + state.username)
    }

    useEffect(()=>{console.log(gameStatus); console.log(error); console.log(gameLog)}, [error, gameStatus, gameLog])
    return(
        <div>
            <div className='board'>
                { !isInitialized && <h1>Loading...</h1> }
                { isInitialized && [ ...Array(boardSize.current) ].map((e, i) => 
                    <div className='board_row' key={i}>
                        { [ ...Array(boardSize.current) ].map((e, j) => 
                            <Square 
                                key={j}
                                squareColId={colId.current[j]} 
                                squareRowId={rowId.current[i]} 
                                squareValue={squareMatrix[j][i]}
                                handleClick={(e) => handleClick(e, colId.current[j], rowId.current[i])}
                            />
                        )}
                    </div>
                )}
                { error && <p className="error">{error}</p>}
                <button onClick={goToLobby}>Go back to Lobby</button>
            </div>
            <div className='game_status'>
                <h2>Game Details:</h2>
                { gameStatus.gameOver && gameStatus.isDraw && <h3>Game Status: Draw</h3>}
                { gameStatus.gameOver && !gameStatus.isDraw && <h3>Game Status: Game over</h3>}
                { !gameStatus.gameOver && <h3>Game Status: Game on</h3>}
                <h3>First Player: {gameStatus.firstPlayer}</h3>
                <h3>Second Player: {gameStatus.secondPlayer}</h3>
                { !gameStatus.gameOver && <h3>Current Turn: {gameStatus.currentTurn}</h3>}
                { gameStatus.gameOver && !gameStatus.isDraw && <h3>Winner: {gameStatus.gameWinner}</h3>}
            </div>
            <div className='game_log'>
                { gameLog.map((log, i) => <p key={i}>{log}</p>)}
            </div>
        </div>
    )
}