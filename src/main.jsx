import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import '../src/assets/styles/globalStyle.css';
import * as InstallPwa from './serviceWorkerRegistration.js'

ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
)
InstallPwa.register()