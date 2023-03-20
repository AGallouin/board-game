/* Base */
import { useNavigate, Link } from 'react-router-dom'
import { doLogout } from '../contexts/AuthContext'
import { useAuthContext } from '../hooks/useAuthContext'
import { Nav, Navbar, Button } from 'react-bootstrap'

/* Web */
import axios from 'axios'

/* Styling */
import './Navbar.css'


export default function NavigationBar() {

    /* Declaring State Object and Constant variables */
    const { state, dispatch } = useAuthContext()
    const url = "http://localhost:8000/user/logout"
    const navigate = useNavigate()


    /* Declaring Event handler */
    const handleClick = () => {

        axios.post(url, {username: state.username})
            .then((res) => {
                console.log(res)
                console.log('Logout successful!')

                dispatch(doLogout())
                sessionStorage.removeItem("sessionName")
                navigate('/login')
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


    /* Render */
    return (
        <div className="navbar">
            <Navbar bg="light" variant="light">
                <Navbar.Brand>Board Game</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href={`/tictactoe/lobby/${state.username}`}>Tictactoe</Nav.Link>
                    <Nav.Link href="/">Catan</Nav.Link>              
                    <Button className="logout_button" variant='primary' onClick={handleClick}>Logout</Button>
                </Nav>
            </Navbar>
        </div>
    )
}
