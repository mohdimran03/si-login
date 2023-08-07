import { Button, Card, CardContent, TextField, Typography } from '@mui/material';
import React, { useState } from 'react'
import { auth } from './firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth';

const App = () => {

  const [phone, setPhone] = useState('+91');
  const [hasFilled, setHasFilled] = useState(false);
  const [otp, setOtp] = useState('');

  const generateRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha', {
      'size': 'invisible'
    }, auth);
  }

  const handleSend = (event) => {
    event.preventDefault();
    setHasFilled(true);
    generateRecaptcha();
    let appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phone, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
      }).catch((error) => {
        // Error; SMS not sent
        console.log(error);
      });
  }
  
  const verifyOtp = (event) => {
    let otp = event.target.value;
    setOtp(otp);

    if (otp.length === 6) {
      // verifu otp
      let confirmationResult = window.confirmationResult;
      confirmationResult.confirm(otp).then((result) => {
        // User signed in successfully.
        let user = result.user;
        console.log(user);
        alert('User signed in successfully');
        // ...
      }).catch((error) => {
        // User couldn't sign in (bad verification code?)
        // ...
        alert('User couldn\'t sign in (bad verification code?)');
      });
    }
  }

  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // Handle successful Google login here (e.g., set user state)
        console.log(result.user);
      })
      .catch((error) => {
        // Handle error (if any) during Google login
        console.log(error);
      });
  };

  const handleFacebookLogin = () => {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // Handle successful Facebook login here (e.g., set user state)
        console.log(result.user);
      })
      .catch((error) => {
        // Handle error (if any) during Facebook login
        console.log(error);
      });
  };
  
  if(!hasFilled){
    return (
      <div className='app__container'>
        <Card sx={{ width: '300px'}}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
            <Typography sx={{ padding: '20px'}} variant='h5' component='div'>Enter your phone number</Typography>
            <form onSubmit={handleSend}>
              <TextField sx={{ width: '240px'}} variant='outlined' autoComplete='off' label='Phone Number' value={phone} onChange={(event) => setPhone(event.target.value)} />
              <Button type='submit' variant='contained' sx={{ width: '240px', marginTop: '20px'}}>Send Code</Button>
              <Button onClick={handleGoogleLogin} variant="contained" sx={{ width: '240px', marginTop: '20px' }}>Google Login</Button>
              <Button onClick={handleFacebookLogin} variant="contained" sx={{ width: '240px', marginTop: '20px' }}>Facebook Login</Button>
            </form>
          </CardContent>
        </Card>
        <div id="recaptcha"></div>
        <div>
        {/* Add Google and Facebook login buttons */}
      </div>
      </div>
    ) 
  } else {
    return (
      <div className='app__container'>
        <Card sx={{ width: '300px'}}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
            <Typography sx={{ padding: '20px'}} variant='h5' component='div'>Enter the OTP</Typography>
              <TextField sx={{ width: '240px'}} variant='outlined' label='OTP ' value={otp} onChange={verifyOtp} />
          </CardContent>
        </Card>
        <div id="recaptcha"></div>
      </div>
    )
  }
}

export default App;