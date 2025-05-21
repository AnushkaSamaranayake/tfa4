import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom'
import {
    signInWithEmailAndPassword,
    getMultiFactorResolver,
    PhoneAuthProvider,
    RecaptchaVerifier,
} from 'firebase/auth';
import { auth } from '../firebase';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [resolver, setResolver] = useState(null);
    const [verificationId, setVerificationId] = useState('');
    const [mfaStep, setMfaStep] = useState(false);

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email,password);
            alert('Login Successfull - no 2-step verification is required');
            // navigate('/')
        }catch (error) {
            if (error.code === 'auth/multi-factor-auth-required.') {
                const mfaResolver = getMultiFactorResolver(auth, error);
                setResolver(mfaResolver);

                window.recaptchaVerifier = new RecaptchaVerifier(
                    auth,
                    'recaptcha-container',
                    { size:'invisible' },
                );

                const phoneAuthProvider = new PhoneAuthProvider(auth);
                const verificationID = await phoneAuthProvider.verifyPhoneNumber(
                    phoneInfoOptions,
                    window.recaptchaVerifier
                );

                setVerificationId(verificationID);
                setMfaStep(true);
                alert("OTP sent to your phone");
            } else {
                alert(error.message);
            }

        }
    };

    const handleVerifyOtp = async () => {
        try {
            const cred = PhoneAuthProvider.credential(verificationId, otp);
            const MultiFactorAssertion = PhoneAuthProvider.assertion(cred);
            const userCredential = await resolver.resolveSignIn(MultiFactorAssertion);
            
            alert("2-step verification success, Logged in")
        } catch (error) {
            console.error("OTP verification error");
            alert(error.message);

        }
    };
    
    return (
        <div className='p-10 border mt-10 m-3'>
            <h2>Login with 2-Step Verifiaction</h2>
            <input className='border mr-4 px-2 mt-5' type="email" placeholder='Email' onChange={e => setEmail(e.target.value)} />
            <input className='border mr-4 px-2 mt-5' type="password" placeholder='Password' onChange={e => setPassword(e.targer.value)} />
            <button onClick={handleLogin} className='border px-2 py-1 rounded-md'>Log In</button>
            
            <br />

            {mfaStep && (
                <>
                    <h2 className='mt-5'>2 Step Verification</h2>
                    <input className='border mr-4 px-2 mt-5' type="number" placeholder='Enter OTP' onChange={e => setOtp(e.target.value)} />
                    <button className='border px-2 py-1 rounded-md' onClick={handleVerifyOtp}>Verify OTP</button>
                </>
            )}

            <div id='recaptcha-container'></div>
        </div>
    )
}

export default Login
