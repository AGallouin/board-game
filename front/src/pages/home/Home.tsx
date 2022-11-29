/* Hooks */
import { useFetch } from '../../hooks/useFetch'


export default function Home() {

    const { data } = useFetch('http://localhost:8000/users/')


    return (
        <div>
            <h2>Welcome {data?.username}!</h2>
            <p>Available Board Game</p>
        </div>
    )
}
