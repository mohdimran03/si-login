import { Button, Card, CardContent, TextField, Typography } from '@mui/material';
import React, { useState } from 'react'
import { auth } from './firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth';
import Grid from '@mui/material/Grid';

const App = () => {

  const [phone, setPhone] = useState('+91');
  const [hasFilled, setHasFilled] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [userData, setUserData] = useState(null);

  const generateRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha', {
      'size': 'invisible'
    }, auth);
  }

  const handleSend = (event) => {
    event.preventDefault();
    setHasFilled(true);
    generateRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phone, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
        alert('Invalid Phone Number')
        setHasFilled(false)
      });
  };

  const verifyOtp = (event) => {
    const enteredOtp = event.target.value;
    setOtp(enteredOtp);
    if (enteredOtp.length === 6) {
      const confirmationResult = window.confirmationResult;
      confirmationResult.confirm(enteredOtp)
        .then((result) => {
          console.log(result);
          setUserData(result);
          setIsOtpVerified(true);
          // Handle successful OTP verification here
        })
        .catch((error) => {
          alert('User couldn\'t sign in (bad verification code?)');
        });
    }
  };

  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        setHasFilled(true);
        console.log(result);
        setUserData(result);
        setIsOtpVerified(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleFacebookLogin = () => {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        setHasFilled(true);

        console.log(result);
        setUserData(result);
        setIsOtpVerified(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (!hasFilled) {
    return (
      <div className='app__container'>
        <Card sx={{ width: '300px' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <Typography sx={{ padding: '20px' }} variant='h5' component='div'>Enter your phone number</Typography>
            <form onSubmit={handleSend}>
              <TextField sx={{ width: '240px' }} variant='outlined' autoComplete='off' label='Phone Number' value={phone} onChange={(event) => setPhone(event.target.value)} />
              <Button type='submit' variant='contained' sx={{ width: '240px', marginTop: '20px' }}>Send Code</Button>
              <Button onClick={handleGoogleLogin} variant="contained" sx={{ width: '240px', marginTop: '20px' }}>Google Login</Button>
              <Button onClick={handleFacebookLogin} variant="contained" sx={{ width: '240px', marginTop: '20px' }}>Facebook Login</Button>
            </form>
          </CardContent>
        </Card>
        <div id="recaptcha"></div>
      </div>
    );
  } else if (!isOtpVerified) {
    return (
      <div className='app__container'>
        <Card sx={{ width: '300px' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <Typography sx={{ padding: '20px' }} variant='h5' component='div'>Enter the OTP</Typography>
            <TextField sx={{ width: '240px' }} variant='outlined' label='OTP ' value={otp} onChange={verifyOtp} />
          </CardContent>
        </Card>
        <div id="recaptcha"></div>
      </div>
    );
  } else if (userData) {
    return (
      <div className='app__container'>
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={10} md={8} lg={6}>
            <Card sx={{ minWidth: 300 }}>
              <CardContent>
                <Typography sx={{ marginBottom: 2 }} variant='h5'>
                  OTP Verified Successfully!
                </Typography>
                {userData && (
                  <div>
                    <Typography variant='body1'>User Information:</Typography>
                    <div
                      style={{
                        maxHeight: '200px',
                        overflow: 'auto',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        padding: '8px',
                      }}
                    >
                      <pre>
                        {JSON.stringify(
                          {
                            uid: userData.user?.uid || '',
                            emailVerified: userData.user?.emailVerified || false,
                            isAnonymous: userData.user?.isAnonymous || false,
                            phoneNumber: userData.user?.phoneNumber || '',
                            providerData: userData.user?.providerData || [],
                            stsTokenManager: userData.user?.stsTokenManager || {},
                            createdAt: userData.user?.createdAt || '',
                            lastLoginAt: userData.user?.lastLoginAt || '',
                            apiKey: userData.user?.apiKey || '',
                            appName: userData.user?.appName || '',
                          },
                          null,
                          2
                        )}
                      </pre>
                    </div>
                    <Typography variant='body1'>Token Response:</Typography>
                    <div
                      style={{
                        maxHeight: '200px',
                        overflow: 'auto',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        padding: '8px',
                      }}
                    >
                      <pre>{JSON.stringify(userData._tokenResponse || {}, null, 2)}</pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            <div id="recaptcha"></div>
          </Grid>
        </Grid>
      </div>
    );
  } else {
    return null;
  }
};

export default App;
