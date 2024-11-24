import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { UserProvider } from './context/UserContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { OtpProvider } from './context/OTPContext';
createRoot(document.getElementById('root')).render(
    // <StrictMode>
    <BrowserRouter>
        <ScrollToTop />
        <UserProvider>
            <OtpProvider>
                <App />
                <ToastContainer
                    position="top-right"
                    autoClose={1000}
                    limit={4}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                    transition:Slide
                    style={{ top: '50px' }}
                />
            </OtpProvider>
        </UserProvider>
    </BrowserRouter>,
    // </StrictMode>,
);
