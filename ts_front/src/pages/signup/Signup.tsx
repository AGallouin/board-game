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
import './Signup.css'



export default function Signup() {

    /* Declaring State Object and Constant variables */
    const [ email, setEmail ] = useState<string>("")
    const [ username, setUsername ] = useState<string>("")
    const [ password, setPassword ] = useState<string>("")
    const [ emailError, setEmailError ] = useState<string | null>(null)
    const [ usernameError, setUsernameError ] = useState<string | null>(null)
    const [ passwordError, setPasswordError ] = useState<string | null>(null)
    const [ generalError, setGeneralError ] = useState<string | null>(null)
    const [ showError, setShowError ] = useState<boolean>(false)

    const { dispatch } = useAuthContext()

    const url = 'http://localhost:8000/user/signup'

    const navigate = useNavigate()


    /* Declaring Event handler */
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault()
        
        axios.post(url, {email, username, password})
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
                    setEmailError(err.response.data.error.email)
                    setUsernameError(err.response.data.error.username)
                    setPasswordError(err.response.data.error.password)

                } else if (err.request) {
                    /* The request was made but no response was received */
                    console.log(err.request)
                    setGeneralError(err.request)

                } else {
                    /* Something happened in setting up the request that triggered an Error */
                    console.log(err.message)
                    setGeneralError(err.message)
                }
                console.log(err.config)
            });
    }


    const errorMessage: string | null = emailError + "hello"

    /* Render */
    return (
        <Container fluid className="signup_page">

            <Card className="signup_form_card">
                <Card.Body>
                    <Card.Title className="signup_form_title">Create an account</Card.Title>
                    <Form className="signup_form" onSubmit={handleSubmit}>
                        <Form.Group className="signup_form_input">
                            <Form.Label className="signup_form_label">Email:</Form.Label>
                            <Form.Control 
                                type="email" 
                                placeholder='Enter email'
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />
                        </Form.Group>

                        
                        <Form.Group className="signup_form_input">
                            <Form.Label className="signup_form_label">Username:</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder='Enter username'
                                onChange={(e) => setUsername(e.target.value)}
                                value={username}
                            />
                        </Form.Group>

                        <Form.Group className="signup_form_input">
                            <Form.Label className="signup_form_label">Password:</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder='Enter password'
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />
                        </Form.Group>

                        <Button className="signup_submit_button" variant='primary' type="submit">Sign up</Button>

                    </Form> 
                </Card.Body>
                <Card.Footer className="signup_card_footer"> Already have an account? {<Link to="/login">Login</Link>} </Card.Footer>
            </Card>
            
            <Modal className="error_modal" show={showError} onHide={() => setShowError(false)}>
                <Modal.Header>Error<button className="error_modal_close" onClick={()=>setShowError(false)}>X</button></Modal.Header>

                <Modal.Body>
                    <>
                        {generalError} { generalError && <br/> }
                        { emailError && "Email: " } {emailError} { emailError && <br/> }
                        { usernameError && "Username: " } {usernameError} { usernameError && <br/> }
                        { passwordError && "Password: " } {passwordError}
                    </>
                </Modal.Body>
            </Modal>
        </Container>        
    )
}