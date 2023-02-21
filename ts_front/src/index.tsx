import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

/* Bootstrap */
import '../node_modules/react-bootstrap/dist/react-bootstrap';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

/* Context */
import { AuthContextProvider } from './contexts/AuthContext';


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    
    <AuthContextProvider>
        <App />
    </AuthContextProvider>
    
    /* <React.StrictMode>
    </React.StrictMode> */
);
