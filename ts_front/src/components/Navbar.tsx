/* Base */
import { Link, useNavigate } from 'react-router-dom'
import { doLogout } from '../contexts/AuthContext'
import { useAuthContext } from '../hooks/useAuthContext'
import { Nav, Navbar, Button } from 'react-bootstrap'


export default function NavigationBar() {

    /* Declaring State Object and Constant variables */
    const { state, dispatch } = useAuthContext()

    const navigate = useNavigate()


    /* Declaring Event handler */
    const handleClick = () => {

        console.log('Logout successful!')

        dispatch(doLogout())
        navigate('/login')
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
                        <Nav.Link href="signup">Signup</Nav.Link>
                        <Nav.Link href="login">Login</Nav.Link>
                    </>
                }
                </Nav>
            </Navbar>
        </div>
    )
}
