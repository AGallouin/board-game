import React, { useState, useEffect } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'
import axios from 'axios'



export default function Lobby() {

    const { state } = useAuthContext()
    const [ boardSize, setBoardSize ] = useState<string>("")
    const navigate = useNavigate()
    const [ availableGames, setAvailableGames ] = useState<any>([])
    const [ unfinishedGames, setUnfinishedGames ] = useState<any>([])

    const url = "http://localhost:8000/tictactoe/lobby/" + state.username


    const handleClick = (e:React.MouseEvent<HTMLButtonElement>, id: number, username: string | null) => {

        axios.post(url, { board_size: boardSize, username, id, method: "join" })
            .then((res) => {
                console.log(res)
                navigate(`/tictactoe/${id}`)
            })
            .catch((err) => {
                if (err.response) {
                    /* The request was made and the server responded with a status code that falls out of the range of 2xx */
                    console.log(Object.values(err.response.data.error).join(', '))

                } else if (err.request) {
                    /* The request was made but no response was received */
                    console.log(err.request)

                } else {
                    /* Something happened in setting up the request that triggered an Error */
                    console.log(err.message)
                }
                console.log(err.config)
            });
    }


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>, username: string | null) => {

        e.preventDefault()

        axios.post(url, { board_size: boardSize, username, method: "new" })
            .then((res) => {
                console.log(res)
                navigate(`/tictactoe/${res.data.game_id}`)
            })
            .catch((err) => {
                if (err.response) {
                    /* The request was made and the server responded with a status code that falls out of the range of 2xx */
                    console.log(Object.values(err.response.data.error).join(', '))

                } else if (err.request) {
                    /* The request was made but no response was received */
                    console.log(2)
                    console.log(err.request)

                } else {
                    /* Something happened in setting up the request that triggered an Error */
                    console.log(3)
                    console.log(err.message)
                }
                console.log(err.config)
            });
        
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
        <div>
        
            <div className='available_tictactoe_game'>
                { availableGames.length === 0 && <h2>No Available Game</h2> }
                { availableGames.length > 0 && 
                    <div>
                        <h2>Available Game:</h2>
                        { availableGames.map((game: any, i: number) => 
                            <Link to={`/tictactoe/${game.id}`} key={i}>
                                <Button onClick={ (e) => handleClick(e, game.id, state.username) }>Join Game</Button>
                            </Link>
                        )}
                    </div>
                }                
            </div>

            <div className='available_tictactoe_game'>
                { unfinishedGames.length > 0 && 
                    <div>
                        <h2>Your Unfinished Game:</h2>
                        { unfinishedGames.map((game: any, i: number) => 
                            <Link to={`/tictactoe/${game.id}`} key={i}>
                                <Button onClick={ (e) => handleClick(e, game.id, state.username) }>Let's finish it</Button>
                            </Link>
                        )}
                    </div>
                }                
            </div>

            <Form onSubmit={ (e) => handleSubmit(e, state.username) }>
                <Form.Group className='form'>
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
                <Button type='submit'>Create New Game</Button>
            </Form>
        </div>
    )
}