import { useState } from 'react';
import axios from 'axios'

import './TicTacToe.css'

/* Context */
import { useAuthContext } from "../../hooks/useAuthContext";

type SquareProp = {
    squareId: number,
    squareValue: string
}


export function Square( {squareId, squareValue}: SquareProp )  {

    const { state } = useAuthContext()
    const [error, setError] = useState<string>("")
    const url = 'http://localhost:8000/tictactoe/1'


    const handleClick = () => {       

        const username: string | null = state.username

        console.log(squareId)
        console.log(squareValue)
        console.log(username)

        axios.post(url, { squareId, username })
            .then((res) => {
                console.log('Login successful!')
                console.log('Response:', res)
            })
            .catch((err) => {
                if (err.response) {
                    /* The request was made and the server responded with a status code that falls out of the range of 2xx */
                    console.log(Object.values(err.response.data.error).join(', '))
                    setError(Object.values(err.response.data.error).join(', '))

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
            })
    }

    return(
        <button className='square' onClick={handleClick}>{squareValue}</button>
    )

}

export function Board() {

    const squareId: number[] = Array.from(Array(9).keys())
    const [squareValue, setSquareValue] = useState<string[]>(Array(9).fill(''))

    return(
        <>
            <div className='board_row'>
                <Square squareId={squareId[0]} squareValue={squareValue[0]} />
                <Square squareId={squareId[1]} squareValue={squareValue[1]} />
                <Square squareId={squareId[2]} squareValue={squareValue[2]} />
            </div>
            <div className='board_row'>
                <Square squareId={squareId[3]} squareValue={squareValue[3]} />
                <Square squareId={squareId[4]} squareValue={squareValue[4]} />
                <Square squareId={squareId[5]} squareValue={squareValue[5]} />
            </div>
            <div className='board_row'>
                <Square squareId={squareId[6]} squareValue={squareValue[6]} />
                <Square squareId={squareId[7]} squareValue={squareValue[7]} />
                <Square squareId={squareId[8]} squareValue={squareValue[8]} />
            </div>
        </>
    )
}


export default function TicTacToe() {

    

    return ( 
        <Board />
    );
}

