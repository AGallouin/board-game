// Hooks
import { useState } from 'react'
import { useFetch } from '../../hooks/useFetch'

// Styles
import './Signup.css'


export default function Signup() {

    // Declare States
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [userName, setUserName] = useState('')
    const [jsonObject, setJsonObject] = useState('')
    const [url, setUrl] = useState('http://localhost:3000/tmp/')
    const [option, setOption] = useState('GET')
    const { data, isPending, error } = useFetch({url, jsonObject, option})


    // Event handlers
    const handleSubmit = (e) => {
        e.preventDefault()

        setJsonObject({ email, password, userName })
        setOption('POST')
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
