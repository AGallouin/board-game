/* Base */
import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { doLogout } from '../contexts/AuthContext'
import { useAuthContext } from '../hooks/useAuthContext'
import { Nav, Navbar, Button, Container } from 'react-bootstrap'

/* Web */
import axios from 'axios'

/* Styling */
import './Navbar.css'


export default function NavigationBar() {

    /* Declaring State Object and Constant variables */
    const [ isInGame, setIsInGame ] = useState<boolean>(false)
    const { state, dispatch } = useAuthContext()
    const url = process.env.REACT_APP_BACKEND_URL + "/user/logout"
    const navigate = useNavigate()
    const location = useLocation()


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

    
    useEffect(() => {
        setIsInGame(!isNaN(parseInt(location.pathname.replace("/tictactoe/", ""))))
    }, [location.pathname])


    /* Render */
    return (
        <Navbar className="navbar" bg="light" variant="light" fixed="top">
            <Container fluid>
                <Navbar.Brand>Board Game</Navbar.Brand>
                <Nav activeKey={location.pathname} className="me-auto" variant="pills">
                    <Nav.Item>
                        <Nav.Link href="/">Home</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href={`/tictactoe/lobby/${state.username}`}>Tictactoe</Nav.Link>
                    </Nav.Item>
                    { isInGame &&
                        <Nav.Item>
                            <Nav.Link eventKey={location.pathname}>Game: #{location.pathname.replace("/tictactoe/", "")}</Nav.Link>
                        </Nav.Item>
                    }
                </Nav>
                <Button className="logout_button mr-auto" variant='primary' onClick={handleClick}>Logout</Button>
            </Container>
        </Navbar>
    )
}
