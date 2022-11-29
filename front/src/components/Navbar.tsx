/* Base */
import { Link } from 'react-router-dom'

/* Styles */
import './Navbar.css'


export default function Navbar() {

    return (
        <div className="navbar">
            <nav>
                <ul>
                    <li> <Link to="/">Home</Link> </li>
                    <li> <Link to="/signup">Sign up</Link> </li>
                    <li> <Link to="/login">Login</Link> </li>
                </ul>
            </nav>
            
        </div>
    )
}
