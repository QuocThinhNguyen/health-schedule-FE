import { createContext, useState, useContext } from 'react';

const OtpContext = createContext();

const OtpProvider = ({ children }) => {
    const [emailRegister, setEmailRegister] = useState(null);
    const [otpToken, setOtpToken] = useState(null);

    return (
        <OtpContext.Provider value={{ otpToken, setOtpToken, emailRegister, setEmailRegister }}>
            {children}
        </OtpContext.Provider>
    );
};

const useOtpToken = () => {
    return useContext(OtpContext);
};

export { useOtpToken, OtpProvider };
