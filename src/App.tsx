import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'
import Routes from './routes';
import './css/app.css';
import AuthProvider from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>

      <Router>
        <div id="toast"></div>
        <Routes />
      </Router>
    </AuthProvider>
  );
}

export default App;
