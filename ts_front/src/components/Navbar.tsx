/* Base */
import { Link, useNavigate } from 'react-router-dom'
import { doLogout } from '../contexts/AuthContext'
import { useAuthContext } from '../hooks/useAuthContext'

/* Styles */
import './Navbar.css'


export default function Navbar() {

    const { state, dispatch } = useAuthContext()

    const navigate = useNavigate()

    const handleClick = () => {

        console.log('Logout successful!')

        dispatch(doLogout())
        navigate('/login')
    }

    return (
        <div className="navbar">
            <nav>
                <ul>
                { state.username && 
                    <>
                        <button onClick={ handleClick }>Logout</button>
                    </> 
                }
                { !state.username && 
                    <>
                        <li> <Link to="/signup">Sign up</Link> </li>
                        <li> <Link to="/login">Login</Link> </li>
                    </>
                }
                </ul>
            </nav>
            
        </div>
    )
}
