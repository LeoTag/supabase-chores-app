import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/css/reset.css'
import './assets/css/index.css'
import './assets/css/App.css'
import App from './App.tsx'
import { SpeedInsights } from "@vercel/speed-insights/react"

createRoot(document.getElementById('root')!).render(
    // <StrictMode>
    <>
        <SpeedInsights />
        <App />
    </>
    // </StrictMode>,
)
