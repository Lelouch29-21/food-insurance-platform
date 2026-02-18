import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from './App';
import './styles/index.css';

const Router = import.meta.env.VITE_USE_HASH_ROUTER === 'true' ? HashRouter : BrowserRouter;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Toaster position="top-right" />
      <App />
    </Router>
  </React.StrictMode>,
);
