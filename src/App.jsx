import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './views/layouts/Header.jsx';
import Footer from './views/layouts/Footer.jsx';
import AppRoutes from './routes/AppRoutes.jsx';
import './assets/styles/colors.css';
import './assets/styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <AppRoutes />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
