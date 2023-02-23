import { useState } from 'react';
import axios from 'axios'

import './TicTacToe.css'


type SquareProp = {
    squareId: number,
    squareValue: string
}


export function Square( {squareId, squareValue}: SquareProp )  {

    const url = 'http://localhost:8000/tictactoe'

    const handleClick = () => {

        console.log(squareId)
        console.log(squareValue)
        axios.post(url, { squareId })
            .then((res) => {

            })
            .catch((err) => {

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

