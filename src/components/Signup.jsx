import React, { useState } from 'react';
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    multiFactor,
    PhoneAuthProvider,
    RecaptchaVerifier,
    signInWithEmailAndPassword,
    PhoneMultiFactorGenerator,
} from 'firebase/auth';
import { auth } from '../firebase';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [verificatiionId, setVerificationId] = useState('');
    const [signedUp, setSignedUp] = useState(false);

    const handleSignUp = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await sendEmailVerification(user);
            alert("Verification Email sent. Please Verify the Email.");
            setSignedUp(true);

            auth.signOut();
        } catch (error) {
            console.error('Signup error', error);
            alert(error.message);
        }
    };

    const handleSignIn = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            alert('Successfully logged in')

        } catch (error) {
            console.log('Login error', error)
            alert('Login Error')
        }
    }

    const checkEmailVerifiedAndSendOTP = async () => {
        console.log(auth.currentUser);
        await auth.currentUser.reload();
        if (!auth.currentUser.emailVerified) {
            alert('Please verify your email first before setting up 2-step verification');
            return;
        }

        try {
            if (!window.recaptchaVerifier) {
                window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                    size: 'invisible',
                    callback: () => console.log('reCAPTCHA verified')
                    }
                )};
                await window.recaptchaVerifier.render();

            const recaptchaVerifier = window.recaptchaVerifier;
            console.log("Recaptcha", recaptchaVerifier);

            const session = await multiFactor(auth.currentUser).getSession();

            const phoneAuthProvider = new PhoneAuthProvider(auth);
            const verificatiionId = await phoneAuthProvider.verifyPhoneNumber({
                phoneNumber: phone,
                session: session
            }, recaptchaVerifier);

            setVerificationId(verificatiionId);
            setOtpSent(true);
            alert('OTP sent to phone');
        } catch (error) {
            console.error('OTP error:', error);
            alert(error.message);
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const cred = PhoneAuthProvider.credential(verificatiionId, otp);
            const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);

            await multiFactor(auth.currentUser).enroll(multiFactorAssertion, 'Phone Number');
            alert('2-Step verification enabled successfully!');
        } catch (error) {
            console.error('OTP verification error: ',error);
            alert(error.message);
        }
    };
    
    return (
        <div className='p-10 border m-3'>
            <h2>Sign Up with 2-Step Verification</h2>
            <input className='border mr-4 px-2 mt-5' type="email" placeholder='Email' onChange={e => setEmail(e.target.value)} />
            <input className='border mr-4 px-2 mt-5' type="password" placeholder='Password' onChange={e => setPassword(e.target.value)} />
            <button onClick={handleSignUp} className='border px-2 py-1 rounded-md'>Sign Up</button>

            <hr />

            {signedUp && (
                <>
                    <h2 className='mt-5'>Login After Email is Verified</h2>
                    <input className='border mr-4 px-2 mt-5' type="email" placeholder='Email' onChange={e => setEmail(e.target.value)} />
                    <input className='border mr-4 px-2 mt-5' type="password" placeholder='Password' onChange={e => setPassword(e.target.value)} />
                    <button onClick={handleSignIn} className='border px-2 py-1 rounded-md'>Sign In</button>
                
                    <hr />

                    <h2 className='mt-5'>Enable 2-Step Verification</h2>
                    <input className='border mr-4 px-2 mt-5' type="tel" placeholder='Phone' onChange={e => setPhone(e.target.value)} />
                    <button onClick={checkEmailVerifiedAndSendOTP} className='border px-2 py-1 rounded-md'>Send OTP</button>
                </>
            )}

            <hr />

            {otpSent && (
                <>
                    <h2 className='mt-5'>Enable 2-Step Verification</h2>
                    <input className='border mr-4 px-2 mt-5' type="number" placeholder='Enter OTP' onChange={e => setOtp(e.target.value)} />
                    <button onClick={handleVerifyOtp} className='border px-2 py-1 rounded-md'>Verify and Enable 2SV</button>
                </>
            )}

            <div id='recaptcha-container'></div>
        </div>
    );
} 

export default Signup;
