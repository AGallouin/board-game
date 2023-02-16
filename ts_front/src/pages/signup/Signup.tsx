/* Base */
import { useState } from 'react'

/* Hook */
import { useFetch } from '../../hooks/useFetch'


export default function Signup() {

    /* Declaring State Object */
    const [email, setEmail] = useState<string>('')
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [url, setUrl] = useState<RequestInfo>('http://localhost:8000/')
    const [method, setMethod] = useState<string>('GET')

    const { fetchPostOption, data, isPending, error } = useFetch(url, method)


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault()

        setMethod('POST')
        setUrl('http://localhost:8000/')
        fetchPostOption({email, username, password})
        console.log(isPending)
        console.log(error)
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
            
            {/* { error && <p>{error}</p> } */}
            { isPending && <button className='btn' disabled>Loading</button> }
            { !isPending && <button>Sign up</button> }

        </form>
    )
}
