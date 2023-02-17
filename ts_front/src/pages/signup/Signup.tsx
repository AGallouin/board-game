/* Base */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

/* Hook */
import { useSignup } from '../../hooks/useSignup'


export default function Signup() {

    /* Declaring State Object */
    const [email, setEmail] = useState<string>('')
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    const [url, setUrl] = useState<RequestInfo>('http://localhost:8000/')

    const { fetchPostOption, data, isPending, error } = useSignup(url)

    const navigate = useNavigate()

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault()
        setUrl('http://localhost:8000/')
        setIsLoggedIn(true)
        fetchPostOption({email, username, password, isLoggedIn})

        if (error != '') {
            navigate('/')
        }
        
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                <span>User email:</span>
                <input
                    required 
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
            </label>
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
            
            { (error != '') && <p>{error}</p> }
            { isPending && <button className='btn' disabled>Loading</button> }
            { !isPending && <button>Sign up</button> }

        </form>
    )
}
