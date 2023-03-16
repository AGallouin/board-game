/* Base */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Button, Form } from 'react-bootstrap'

/* Authentication Context */
import { useAuthContext } from '../../hooks/useAuthContext'
import { doLogin } from '../../contexts/AuthContext'


export default function Login() {

    /* Declaring State Object and Constant variables */
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<string>('')

    const { dispatch } = useAuthContext()

    const url = 'http://localhost:8000/user/login'

    const navigate = useNavigate()


    /* Declaring Event handler */
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault()

        axios.post(url, {username, password})
            .then((res) => {

                console.log('Login successful!')
                console.log('Response:', res)

                dispatch(doLogin(username))
                sessionStorage.setItem("sessionName", username)
                navigate('/')

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
            });
    }

    
    /* Render */
    return (
        <Form onSubmit={handleSubmit}>
            
            <Form.Group className="login_form_username">
                <Form.Label>User username:</Form.Label>
                <Form.Control 
                    type="text" 
                    placeholder='Enter username'
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                />
            </Form.Group>

            <Form.Group className="login_form_password">
                <Form.Label>User password:</Form.Label>
                <Form.Control 
                    type="password" 
                    placeholder='Enter password'
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
            </Form.Group>
            

            <Button variant='primary' type="submit">Login</Button>

            { error != '' && <p>{ error }</p>}

        </Form>
    )
}
