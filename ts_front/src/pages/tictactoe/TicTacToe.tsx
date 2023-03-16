/* Base */
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

/* Context */
import { useAuthContext } from "../../hooks/useAuthContext";

/* Styling */
import './TicTacToe.css'


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



function Square( {squareColId, squareRowId, squareValue, handleClick }: IFrontEndSquareProp )  {
    return(
        <button className='square' onClick={(e) => handleClick(e, squareColId, squareRowId)}>
            {squareValue}
        </button>
    )
}



export default function TicTacToe() {

    const [ boardSize, setBoardSize ] = useState<number>(0)
    const [ isWebSocket, setIsWebSocket ] = useState<boolean>(false) 
    const [ initializationDone, setInitializationDone ] = useState<boolean>(false)
    const [ initialBoardState, setInitialBoardState ] = useState<IBackEndSquareProp[]>([])
    const colId: number[] = Array.from(Array(boardSize).keys())
    const rowId: number[] = Array.from(Array(boardSize).keys())
    const [ squareMatrix, setSquareMatrix ] = useState<string[][]>([]);

    const { state } = useAuthContext()
    const [ error, setError ] = useState<string>("")
    const { id } = useParams()
    const ws = useRef< WebSocket | null>(null)
    const ws_url: string = "ws://127.0.0.1:8000/ws/tictactoe/" + id
    const navigate = useNavigate()


    const changeSquareValue = (colId : number, rowId: number, value: string) => {
        console.log("Changing Square... Col ID: " + colId + " Row ID: " + rowId + " to Value: " + value)
        let tmp = [ ...squareMatrix ];
        tmp[colId][rowId] = value
        setSquareMatrix(tmp);
    }


    useEffect(() => {
        ws.current = new WebSocket(ws_url);
        ws.current.onopen = () => {setIsWebSocket(true); console.log("Websocket connection opened")}
        ws.current.onclose = () => console.log("Websocket connection closed")

        const wsCurrent = ws.current;

        return () => {
            console.log("Unmounting")
            wsCurrent.close();
        };

    }, [ws_url])


    useEffect(() => {

        if (!ws.current) {console.log("No WebSocket Connection"); return};

        ws.current.onmessage = function (res: MessageEvent) {

            const json = JSON.parse(res.data);
            console.log(json)
            console.log("Variable check on message received_____")
            console.log("Is Initialized: " + initializationDone)
            console.log("Current BoardSize: " + boardSize)
            console.log("Square Matrix: ")
            console.log(squareMatrix)
            console.log("Variable check on message received fin_____")

            if (json.status === "success" && json.type === "connect" && !initializationDone) {
                console.log("Initiating Board")
                setBoardSize(json.board_size)
                setInitialBoardState(json.board_status)
            }

            if (json.status === "success" && json.type === "ingame") {
                console.log("Square Value Login")
                console.log(initializationDone)
                console.log(boardSize)
                console.log(squareMatrix)
                changeSquareValue(json.message.col_id, json.message.row_id, json.message.square_value)
            } 
            
            if (json.status === "error") {
                setError(json.message)
            }
        }
        
    }, [isWebSocket])
    

    useEffect(() => {
        console.log("Initializing board 2")
        console.log(boardSize)
        setSquareMatrix(Array.from({length: boardSize},()=> Array.from({length: boardSize}, () => "")))
        if (boardSize != 0) {
            setInitializationDone(true)
        }
    }, [boardSize])


    useEffect(() => {
        console.log("Initializing board 3")
        initialBoardState.map((square: IBackEndSquareProp) => {
            changeSquareValue(square.col_id, square.row_id, square.value)
        })
    }, [initializationDone])

    useEffect(() => {console.log("ChangeSquare"); console.log(initializationDone); console.log(boardSize); console.log(squareMatrix); console.log("ChangeSquareFin")}, [squareMatrix])
    const handleClick = (e:React.MouseEvent<HTMLButtonElement>, squareColId: number, squareRowId: number) => {     

        if (!ws.current) {console.log("No WebSocket Connection"); return};
        
        const username: string | null = state.username

        ws.current.send(JSON.stringify({username: username, col_id: squareColId, row_id: squareRowId}));

    }


    const goToLobby = (e:React.MouseEvent<HTMLButtonElement>) => {
        navigate("/tictactoe/lobby/" + state.username)
    }


    return(
        <div className='board'>
            <p>Matrix: { squareMatrix } </p>
            
            { !initializationDone && <h1>Loading...</h1> }
            { initializationDone && boardSize != 0 && [ ...Array(boardSize) ].map((e, i) => 
                <div className='board_row' key={i}>
                    { [ ...Array(boardSize) ].map((e, j) => 
                        <Square 
                            key={j}
                            squareColId={colId[j]} 
                            squareRowId={rowId[i]} 
                            squareValue={squareMatrix[j][i]}
                            handleClick={(e) => handleClick(e, colId[j], rowId[i])}
                        />
                    )}
                </div>
            )}
            { error && <p>{error}</p>}
            <button onClick={goToLobby}>Go back to Lobby</button>
        </div>
    )
}

/*  */
/**/
