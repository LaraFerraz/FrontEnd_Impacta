import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './controllers/contexts/AuthContext.jsx';
import Header from './views/components/Header.jsx';
import Footer from './views/components/Footer.jsx';
import AppRoutes from './routes/AppRoutes.jsx';
import './assets/styles/colors.css';
import './assets/styles/App.css';
import './views/components/btn-primary.css';
import './views/components/btn-secondary.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Header />
          <AppRoutes />
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
