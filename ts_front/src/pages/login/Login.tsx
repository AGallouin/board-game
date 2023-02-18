/* Base */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

/* Hook */



export default function Login() {

    /* Declaring State Object */
    const [password, setPassword] = useState<string>('')
    const [username, setUsername] = useState<string>('')
    const [url, setUrl] = useState<RequestInfo>('http://localhost:8000/')
    const [error, setError] = useState<any>(null)

    const navigate = useNavigate()

    /* Declaring Event handler */
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault()

        setUrl('http://localhost:8000/')

    }

    
    /* Render */
    return (
        <form onSubmit={handleSubmit}>
            <label>
                <span>User name:</span>
                <input
                    required 
                    type="text"
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
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
            <button>Log in</button>
        </form>
    )
}
