import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import useWebSocket from "react-use-websocket";



export default function Lobby() {

    const [boardSize, setBoardSize] = useState<number>(3)
    const navigate = useNavigate()

    const WSS_FEED_URL: string = 'ws://127.0.0.1:8000/ws/tictactoe/123/';

    const { sendMessage, sendJsonMessage, getWebSocket } = useWebSocket(WSS_FEED_URL, {
        onOpen: () => console.log('WebSocket connection opened.'),
        onClose: () => console.log('WebSocket connection closed.'),
        shouldReconnect: (closeEvent) => true,
        /* onMessage: (event: WebSocketEventMap['message']) =>  processMessages(event) */
      });
      

    const handleClick = () => {

        console.log("click")
        sendMessage("test")


    }


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault()

        /* Post Create Room with number of param: 3 */

    }

    return (
        /* If no game */
        <div>
            <Form onSubmit={ handleSubmit }>
                <Form.Group className='form'>
                    <h2>salut</h2>
                </Form.Group>
                
            </Form>
        
        {/* If Game */}
            <div>
                <h2>On going Games</h2>
                <Button onClick={ handleClick }></Button>
            </div>
            
        </div>
    )
}