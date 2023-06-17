import React, { useContext, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router';
import { User } from '../../context/userContext';

const ProtectedRoute = ({ children }) => {
  let [user, setUser] = useContext(User);
  const navigate = useNavigate();

  const fetchUserData = (token) => {
    return fetch('http://localhost:8000/login/get_user_details', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        return Promise.reject(response);
      }).catch((error) => {

      })
  }

  const checkIfHasToken = async () => {
    if (localStorage.getItem('reportData')) {
      let token = JSON.parse(localStorage.getItem('reportData'))?.token;

      fetchUserData(token).then((userData) => {
        if (userData) {
          setUser({
            logged: true,
            token: token,
            data: userData
          })
        }
      }).catch((error) => {
        localStorage.removeItem('reportData');
        navigate('/login');
      });;
    }
    else {
      navigate('/login');
    }
  }

  useEffect(() => {
    if (!user.logged)
      checkIfHasToken();
  }, [user])

  return children;
};

export default ProtectedRoute;