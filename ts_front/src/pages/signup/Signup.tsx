/* Base */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

/* Authentication Context */
import { useAuthContext } from '../../hooks/useAuthContext'
import { doLogin } from '../../contexts/AuthContext'


export default function Signup() {

    /* Declaring State Object */
    const [email, setEmail] = useState<string>('')
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<string>('')

    const { dispatch } = useAuthContext()

    const url = 'http://localhost:8000/signup'

    const navigate = useNavigate()


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault()

        axios.post(url, {email, username, password})
            .then((res) => {

                console.log('Login successful!')
                console.log('Response:,', res)

                dispatch(doLogin(username))
                navigate('/')

            })
            .catch((err) => {
                if (err.response) {
                    /* The request was made and the server responded with a status code that falls out of the range of 2xx */
                    console.log(Object.values(err.response.data.error).join(', '))
                    setError(Object.values(err.response.data.error).join(', '))

                } else if (err.request) {
                    /* The request was made but no response was received */
                    console.log(err.request)
                    setError(err.request)

                } else {
                    /* Something happened in setting up the request that triggered an Error */
                    console.log(err.message)
                    setError(err.message)
                }
                console.log(err.config)
            });
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
            
            <button>Sign up</button>
            { (error != '') && <p>{error}</p> }

        </form>
    )
}
