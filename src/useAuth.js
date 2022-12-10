import React, {useState, useEffect} from 'react';
import axios from 'axios';

function useAuth(code) {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefereshToken] = useState();
  const [expireToken, setExpireToken] = useState();

  useEffect(() => {
    axios.post('http://localhost:3001/login', {
        code
    }).then((res) => {
        console.log(res.data);
        setAccessToken(res.data.accessToken);
        setRefereshToken(res.data.refreshToken);
        setExpireToken(res.data.expireToken);
        //window.history.pushState({}, null, '/');
    }).catch(() => {
        //window.location = '/';
    });
  }, [code]);

  useEffect(() => {
    if(!refreshToken || !expireToken) return;
    const timeout = setInterval(() => {
    axios.post('http://localhost:3001/refresh', {
        refreshToken
    }).then((res) => {
        console.log(res.data);
        setAccessToken(res.data.accessToken)
        //setRefereshToken(res.data.refreshToken);
        setExpireToken(61);
        //window.history.pushState({}, null, '/');
    }).catch(() => {
        //window.location = '/';
    })
    }, (expireToken - 60) * 1000);
    
    return () => {
        clearInterval(timeout);
    };
  }, [refreshToken, expireToken]);
  
  return accessToken;
}
export default useAuth;
