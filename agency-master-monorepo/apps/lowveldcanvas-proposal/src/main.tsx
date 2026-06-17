import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import posthog from 'posthog-js'

posthog.init('phc_mock_key_for_telemetry', { api_host: 'https://app.posthog.com' })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
