import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EmailForm from './EmailForm';
import Welcome from './Welcome';
import './App.css'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<EmailForm />} />
                <Route path="/welcome" element={<Welcome />} />
            </Routes>
        </Router>
    );
}

export default App;
