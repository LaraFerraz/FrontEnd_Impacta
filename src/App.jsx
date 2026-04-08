import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './controllers/contexts/AuthContext.jsx';
import Header from './views/components/Header.jsx';
import Footer from './views/components/Footer.jsx';
import AppRoutes from './routes/AppRoutes.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import './assets/styles/index.css';
import './assets/styles/colors.css';
import './assets/styles/components.css';
import './assets/styles/App.css';

function App() {
  return (
    <Router>
      <ScrollToTop />
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
