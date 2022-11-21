// Hooks
import { useState } from 'react'

// Styles
import './Signup.css'


export default function Signup() {

    // Declare States
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [userName, setUserName] = useState('')


    // Event handlers
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(email, password, userName)
    }
    

    // Rendering
    return (
        <form className="signup-form" onSubmit={handleSubmit}>
            <label>
                <span>User e-mail:</span>
                <input
                    required
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
            </label>
            <label>
                <span>User password:</span>
                <input
                    required
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
            </label>
            <label>
                <span>User name:</span>
                <input
                    required
                    type="text"
                    onChange={(e) => setUserName(e.target.value)}
                    value={userName}
                />
            </label>
            <button className="btn">Sign up</button>
        </form>

    )
}
