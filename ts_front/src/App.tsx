/* Base */
import { BrowserRouter, Routes, Route } from 'react-router-dom';

/* Hooks */
import { useAuthContext } from './hooks/useAuthContext';

/* Pages & Components */
import NavigationBar from './components/Navbar';
import Home from './pages/home/Home';
import Signup from './pages/signup/Signup';
import Login from './pages/login/Login';
import Tictactoe from './pages/tictactoe/Tictactoe';

/* Styles */
import './App.css';
import Lobby from './pages/tictactoe/Lobby';



function App() {

    const { state } = useAuthContext()

    return (
        <div className="App">

            <BrowserRouter>
                <NavigationBar />
                <Routes>
                    { state.username && 
                        <>
                            <Route path="" element={<Home />} />
                        </>
                    }
                    { !state.username && 
                        <>
                            <Route path="signup" element={<Signup />} />
                            <Route path="login" element={<Login />} />
                        </>
                    }
                    <Route path="tictactoe/lobby/:username" element={<Lobby />} />
                    <Route path="tictactoe/:id" element={<Tictactoe />} />
                </Routes>
            </BrowserRouter>

        </div>
    );
}

export default App;
