import { createContext, useState, useEffect, useContext } from 'react';
import { axiosClient } from '~/api/apiRequest';
import { jwtDecode } from 'jwt-decode';
import { UserContext } from './UserContext';

const ClinicContext = createContext();

const ClinicProvider = ({ children }) => {
  const [clinicId, setClinicId] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchClinicId = async () => {
      const storedClinicId = localStorage.getItem('clinicId');
      if (storedClinicId) {
        setClinicId(storedClinicId);
        setLoading(false);
        return;
      }

      try {
        if (user?.auth && user?.accessToken) {
          const decoded = jwtDecode(user.accessToken);
          if (decoded.roleId === 'R4') {
            const response = await axiosClient.get(`/user/${decoded.userId}/clinic`);
            console.log("response", response);
            
            if (response.status === 200) {
              const id = response.data.clinicId;
              localStorage.setItem('clinicId', id);
              setClinicId(id);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching clinicId:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClinicId();
  }, [user]);

  const updateClinicId = (id) => {
    localStorage.setItem('clinicId', id);
    setClinicId(id);
  };

  const clearClinicId = () => {
    localStorage.removeItem('clinicId');
    setClinicId(null);
  };

  return (
    <ClinicContext.Provider value={{ clinicId, loading, updateClinicId, clearClinicId }}>
      {children}
    </ClinicContext.Provider>
  );
};

export { ClinicContext, ClinicProvider };