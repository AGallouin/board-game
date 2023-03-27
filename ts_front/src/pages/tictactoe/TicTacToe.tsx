/* Base */
import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

/* Context */
import { useAuthContext } from "../../hooks/useAuthContext";

/* Hooks */
import useTictactoeLog from '../../hooks/useTictactoeLog';

/* Bootstrap */
import { Container, Col, Row, Card, Modal, ListGroup, Button } from 'react-bootstrap';

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
    const [ showError, setShowError ] = useState<boolean>(false)
    const { gameStatus, gameLog, error } = useTictactoeLog(backendMessage)

    const { state } = useAuthContext()
    const { id } = useParams()
    const ws = useRef<WebSocket | null>(null)
    const ws_url: string = process.env.REACT_APP_BACKEND_WS_URL + "/ws/tictactoe/" + id
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
        initialBoardState.current.forEach((square: IBackEndSquareProp) => {
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

    }, [ws_url, state.username])



    useEffect(() => {

        if (!ws.current) {return}

        ws.current.onmessage = function (res: MessageEvent) {

            const jsonData = JSON.parse(res.data);
            setBackendMessage(jsonData)
            console.log(jsonData)

            if (jsonData.status === "success" && jsonData.type === "game_system" && jsonData.data.category !== "game_leave") {
                initializeBoard(jsonData.data.board_status)
            }
            if (jsonData.status === "success" && jsonData.type === "in_game") {
                changeSquareValue(jsonData.data.col_id, jsonData.data.row_id, jsonData.data.value)
            }
            if (jsonData.status === "error") {
                setShowError(true)
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


    return(
        <Container fluid className="tictactoe_game">
            <Row>
                <Col className="board_col">
                    <div className="board">
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
                    </div>

                </Col>
                <Col>
                    <Card className='game_status'>
                        <Card.Header>Game Details</Card.Header>
                        <Card.Body>
                            <Container>
                                <Row>
                                    <Col>
                                        <ListGroup variant="flush">
                                            <ListGroup.Item className="tictactoe_list_item">
                                                <div>
                                                    <div className="status_list_title">Game Status</div> 
                                                    { gameStatus.gameOver && gameStatus.isDraw && "Draw" }
                                                    { gameStatus.gameOver && !gameStatus.isDraw && "Game over" }
                                                    { !gameStatus.gameOver && "Game on" }
                                                </div>
                                            </ListGroup.Item>
                                            <ListGroup.Item className="tictactoe_list_item">
                                                { !gameStatus.gameOver && 
                                                    <div>
                                                        <div className="status_list_title">Current Turn</div>
                                                        { gameStatus.currentTurn }
                                                    </div>
                                                }
                                                { gameStatus.gameOver && 
                                                    !gameStatus.isDraw && 
                                                        <div>
                                                            <div className="status_list_title">Winner</div> 
                                                            { gameStatus.gameWinner }
                                                        </div>
                                                }
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Col>
                                    <Col>
                                        <ListGroup variant="flush">
                                            <ListGroup.Item className="tictactoe_list_item">
                                                <div>
                                                    <div className="status_list_title">First Player</div> 
                                                    {gameStatus.firstPlayer}
                                                </div>
                                            </ListGroup.Item>
                                            <ListGroup.Item className="tictactoe_list_item">
                                                <div>
                                                    <div className="status_list_title">Second Player</div> 
                                                        { !gameStatus.secondPlayer && "Waiting for an opponent to join"}
                                                        { gameStatus.secondPlayer }
                                                </div>
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Col>
                                </Row>
                            </Container>
 
                            <Button className="back_button" onClick={goToLobby}>Go back to Lobby</Button>
                            
                        </Card.Body>
                    </Card>
                    <Card className='game_log'>      
                        <Card.Header>Log</Card.Header>
                        <Card.Body className="scroll">
                            <ListGroup variant="flush">
                                { gameLog.map((log, i) => 
                                    <ListGroup.Item className="tictactoe_list_item" key={i}>{log}</ListGroup.Item>                                
                                )}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Modal className="error_modal" show={showError} onHide={() => setShowError(false)}>
                <Modal.Header>Error<button className="error_modal_close" onClick={()=>setShowError(false)}>X</button></Modal.Header>
                <Modal.Body>
                    <>
                        { error }
                    </>
                </Modal.Body>
            </Modal>
        </Container> 
    )
}