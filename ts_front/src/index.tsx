/* Base */
import ReactDOM from 'react-dom/client';
import App from './App';

/* Bootstrap */
import '../node_modules/react-bootstrap/dist/react-bootstrap';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

/* Context */
import { AuthContextProvider } from './contexts/AuthContext';

/* Styling */
import './index.css';


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <AuthContextProvider>
        <App />
    </AuthContextProvider>
);
