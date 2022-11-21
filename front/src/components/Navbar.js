// Base
import { Link } from 'react-router-dom'

// Styles
import './Navbar.css'


export default function Navbar() {
    return (
        <nav className="navbar">
            <ul>
                <li> <Link to="/login">Login</Link> </li>
                <li> <Link to="/signup">Signup</Link> </li>
                <li> <button className="btn">Logout</button> </li>
            </ul>
        </nav>
    )
}
