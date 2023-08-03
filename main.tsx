import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { HashRouter } from 'react-router-dom';

ReactDOM.render(
 <HashRouter>
 <React.StrictMode>
    <App />
  </React.StrictMode>,
  </HashRouter>
)
