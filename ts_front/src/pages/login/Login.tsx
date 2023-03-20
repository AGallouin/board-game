/* Base */
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

/* Authentication Context */
import { useAuthContext } from '../../hooks/useAuthContext'
import { doLogin } from '../../contexts/AuthContext'

/* Bootstrap */
import { Button, Form, Card, Container, Modal } from 'react-bootstrap'

/* Styling */
import './Login.css'


export default function Login() {

    /* Declaring State Object and Constant variables */
    const [ username, setUsername ] = useState<string>('')
    const [ password, setPassword ] = useState<string>('')
    const [ usernameError, setUsernameError ] = useState<string | null>(null)
    const [ passwordError, setPasswordError ] = useState<string | null>(null)
    const [ generalError, setGeneralError ] = useState<string | null>(null)
    const [ showError, setShowError ] = useState<boolean>(false)

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
                setShowError(true)
                if (err.response) {
                    /* The request was made and the server responded with a status code that falls out of the range of 2xx */
                    console.log(err.response.data.error)
                    setUsernameError(err.response.data.error.username)
                    setPasswordError(err.response.data.error.password)

                } else if (err.request) {
                    /* The request was made but no response was received */
                    console.log(err.request)
                    setGeneralError(err.request)

                } else {
                    /* Something happened in setting up the request that triggered an Error */
                    console.log(err.message)
                    setGeneralError(err.request)
                }
                console.log(err.config)
            });
    }

    
    /* Render */
    return (
        <Container fluid className="login_page">

        <Card className="login_form_card">
            <Card.Body>
                <Card.Title className="login_form_title">Login to your account</Card.Title>
                    <Form className="login_form" onSubmit={handleSubmit}>
                        
                        <Form.Group className="login_form_input">
                        <Form.Label className="login_form_label">Username:</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder='Enter username'
                                onChange={(e) => setUsername(e.target.value)}
                                value={username}
                            />
                        </Form.Group>
                        
                        <Form.Group className="login_form_input">
                        <Form.Label className="login_form_label">Password:</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder='Enter password'
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />
                        </Form.Group>
                        
                        <Button className="login_submit_button" variant='primary' type="submit">Login</Button>

                    </Form>
                    </Card.Body>
                <Card.Footer className="login_card_footer"> Don't have an account yet? {<Link to="/signup">Signup</Link>} </Card.Footer>
            </Card>

            <Modal className="error_modal" show={showError} onHide={() => setShowError(false)}>
                <Modal.Header>Error<button className="error_modal_close" onClick={()=>setShowError(false)}>X</button></Modal.Header>
                <Modal.Body>
                    <>
                        {generalError} { generalError && <br/> }
                        { usernameError && "Username: " } {usernameError} { usernameError && <br/> }
                        { passwordError && "Password: " } {passwordError}
                    </>
                </Modal.Body>
            </Modal>
        </Container>        
    )
}
