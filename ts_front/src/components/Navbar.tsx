/* Base */
import { useNavigate } from 'react-router-dom'
import { doLogout } from '../contexts/AuthContext'
import { useAuthContext } from '../hooks/useAuthContext'
import { Nav, Navbar, Button } from 'react-bootstrap'

/* Web */
import axios from 'axios'


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

                { state.username && 
                    <>
                        <Button variant='primary' onClick={handleClick}>Logout</Button>
                    </> 
                }
                { !state.username && 
                    <>
                        <Nav.Link href="/signup">Signup</Nav.Link>
                        <Nav.Link href="/login">Login</Nav.Link>
                    </>
                }
                </Nav>
            </Navbar>
        </div>
    )
}
