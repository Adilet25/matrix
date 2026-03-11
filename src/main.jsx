import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './App.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <div style={{backgroundColor:'black'}}>

      <App />
    </div>
    </BrowserRouter>
  </StrictMode>,
)
