/* Base */
import { Link } from "react-router-dom";

/* Context */
import { useAuthContext } from "../../hooks/useAuthContext";


export default function Home() {

    const { state } = useAuthContext()

    return (
        <div>
            <h2>Welcome { state.username } !</h2>
            <p>Available Board Game</p>
                <Link to="/tictactoe">Tic Tac Toe</Link>
        </div>
    )
}