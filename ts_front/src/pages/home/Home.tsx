/* Hooks */
import { useFetch } from '../../hooks/useFetch'


export default function Home() {

    const { data } = useFetch('http://127.0.0.1:8000/1')
    console.log(data)
    console.log()

    return (
        <div>
            <h2>Welcome {data?.username}!</h2>
            <p>Available Board Game</p>
        </div>
    )
}
