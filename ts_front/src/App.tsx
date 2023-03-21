/* Base */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

/* Hooks */
import { useAuthContext } from './hooks/useAuthContext';

/* Pages & Components */
import NavigationBar from './components/Navbar';
import Home from './pages/home/Home';
import Signup from './pages/signup/Signup';
import Login from './pages/login/Login';
import Lobby from './pages/tictactoe/Lobby';
import Tictactoe from './pages/tictactoe/Tictactoe';

/* Styles */
import './App.css';


function App() {

    const { state } = useAuthContext()

    return (
        <div className="App">
            
            <BrowserRouter>

                { state.username && <NavigationBar /> }

                <Routes>
                    <Route path="/" element={ state.username ? <Home /> : <Navigate to="/login"/> } />
                    <Route path="/signup" element={ !state.username ? <Signup /> : <Navigate to="/"/> } />
                    <Route path="/login" element={ !state.username ? <Login /> : <Navigate to="/"/> } />
                    <Route path="/tictactoe/lobby/:username" element={ state.username ? <Lobby /> : <Navigate to="/login"/> } />
                    <Route path="/tictactoe/:id" element={ state.username ? <Tictactoe /> : <Navigate to="/login"/> } />
                </Routes>
            </BrowserRouter>

        </div>
    );
}

export default App;
