/* Base */
import { useState } from 'react'

/* Hook */
import { useFetch } from '../../hooks/useFetch'


export default function Signup() {

    /* Declaring State Object */
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [username, setUsername] = useState<string>('')
    const [url, setUrl] = useState<RequestInfo>('http://localhost:8000/')
    const [method, setMethod] = useState<string>('GET')

    const { fetchPostOption, data } = useFetch(url, method)


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault()

        setMethod('POST')
        setUrl('http://localhost:8000/users/')
        fetchPostOption({email, password, username})
        console.log({email, password, username})
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
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                />
            </label>
            <button>Sign up</button>
        </form>
    )
}
