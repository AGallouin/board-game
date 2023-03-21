/* Base */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/* Hooks */
import { useAuthContext } from '../../hooks/useAuthContext'

/* Web */
import axios from 'axios'

/* Bootstrap */
import { Button, Form, Container, Row, Col, Card, ListGroup, Modal } from 'react-bootstrap'

/* Styling */
import "./Lobby.css"


export default function Lobby() {

    const { state } = useAuthContext()
    const [ boardSize, setBoardSize ] = useState<string>("")
    const navigate = useNavigate()
    const [ availableGames, setAvailableGames ] = useState<any>([])
    const [ unfinishedGames, setUnfinishedGames ] = useState<any>([])
    const [ error, setError ] = useState<string>("")
    const [ showError, setShowError ] = useState<boolean>(false)

    const url = "http://localhost:8000/tictactoe/lobby/" + state.username


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>, username: string | null) => {

        e.preventDefault()

        axios.post(url, { board_size: boardSize, username, method: "new" })
            .then((res) => {
                console.log(res)
                navigate(`/tictactoe/${res.data.game_id}`)
            })
            .catch((err) => {
                setShowError(true)
                if (err.response) {
                    /* The request was made and the server responded with a status code that falls out of the range of 2xx */
                    console.log(err.response)
                    setError(err.response.data.error.board_size)

                } else if (err.request) {
                    /* The request was made but no response was received */
                    console.log(err.request)
                    setError(err.request)

                } else {
                    /* Something happened in setting up the request that triggered an Error */
                    console.log(err.message)
                    setError(err.message)
                }
                console.log(err.config)
            }
        )
    }


    const handleJoinGame = (e: React.MouseEvent<Element, MouseEvent>, id: number, username: string | null) => {

        e.preventDefault()

        axios.post(url, { board_size: boardSize, username, id, method: "join" })
            .then((res) => {
                console.log(res)
                navigate(`/tictactoe/${id}`)
            })
            .catch((err) => {
                setShowError(true)
                if (err.response) {
                    /* The request was made and the server responded with a status code that falls out of the range of 2xx */
                    console.log(err.response)
                    setError(err.response.data.error.board_size)

                } else if (err.request) {
                    /* The request was made but no response was received */
                    console.log(err.request)
                    setError(err.request)

                } else {
                    /* Something happened in setting up the request that triggered an Error */
                    console.log(err.message)
                    setError(err.message)
                }
                console.log(err.config)
            }
        )
    }


    useEffect(() => {
        axios.get(url)
            .then((res) => {
                setAvailableGames(res.data.available_games)
                setUnfinishedGames(res.data.unfinished_games)
            })
            .catch((error) => {
                console.log(error)
            }) 
    }, [url])



    return (
        <Container fluid className="tictactoe_lobby">
            <Row>
                <Col>
                    <Card className="create_card">
                        <Card.Header>Create new game</Card.Header>
                        <Card.Body>
                            <Form onSubmit={ (e) => handleSubmit(e, state.username) }>
                                <Form.Group className='create_form'>
                                    <Form.Label>Board Dimension (from 3 to 5):</Form.Label>
                                    <Form.Control 
                                        type="number"
                                        placeholder='Board Dimension'
                                        min={3}
                                        max={5}
                                        onChange={(e) => setBoardSize(e.target.value)}
                                        value={boardSize}
                                    />
                                </Form.Group>
                                <Button className="create_button" type='submit'>Create New Game</Button>
                            </Form>
                        </Card.Body>
                    </Card>   
                </Col>
                <Col>
                    <Card className="lobby_card">
                        <Card.Header>Available Games</Card.Header>
                        <Card.Body className="scroll">
                            { availableGames.length === 0 && <p>No available games</p> }
                            { availableGames.length > 0 && 
                                <ListGroup>
                                    { availableGames.map((game: any, i: number) => 
                                        <ListGroup.Item className="lobby_card_list_item" action onClick={(e) => handleJoinGame(e, game.id, state.username)} key={i}>
                                            {game.id}. Creator: {game.created_by}
                                        </ListGroup.Item>
                                    )}
                                </ListGroup>
                            }     
                        </Card.Body>
                    </Card>
                    <Card className="lobby_card">
                        <Card.Header>Unfinished Games</Card.Header>
                        <Card.Body className="scroll">
                            { unfinishedGames.length === 0 && <p>No unfinished games</p> }
                            { unfinishedGames.length > 0 && 
                                <ListGroup>
                                    { unfinishedGames.map((game: any, i: number) => 
                                        <ListGroup.Item className="lobby_card_list_item" action onClick={(e) => handleJoinGame(e, game.id, state.username)} key={i}>
                                            {game.id}. Creator: {game.created_by}
                                        </ListGroup.Item>
                                    )}
                                </ListGroup>
                        }      
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Modal className="error_modal" show={showError} onHide={() => setShowError(false)}>
                <Modal.Header>Error<button className="error_modal_close" onClick={()=>setShowError(false)}>X</button></Modal.Header>
                <Modal.Body>
                    <>
                        { "Board dimension: " + error }
                    </>
                </Modal.Body>
            </Modal>
        </Container>
    )
}