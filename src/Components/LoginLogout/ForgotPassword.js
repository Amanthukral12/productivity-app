import React, { useRef, useState } from 'react'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField'
import { useAuth } from '../../contexts/AuthContext'
import { Link } from 'react-router-dom';
import "../LoginLogout/Login.css";
import photo from '../LoginLogout/photo1.jpg'
import photo2 from './photo2.jpg';
const ForgotPassword = () => {
    const emailRef = useRef();
    const { resetPassword } = useAuth();
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            setMessage('');
            setError("")
            setLoading(true);
            await resetPassword(emailRef.current.value)
            setMessage('Check your inbox for further instructions')
        } catch {
            setError('Failed to reset password')
        }
        setLoading(false)
        
    }
    return (
        <>
        <Grid className="loginRoot">
        <div className="ground">
        <picture className="loginPhoto">
        <source srcSet={photo2} className="loginImage" media="(max-width: 990px)" />
        <img src={photo} className="loginImage" alt=""/>
    </picture>
         <div className="loginRight">
         <h2 className="loginHeading">Produkto</h2>
         {error && <h1 className="error">{error}</h1>}
         {message && <h1 className="message">{message}</h1>}
         <h3 className="welcomeMessage">Forgot Password</h3>           
         <form onSubmit={handleSubmit} className="loginForm">
            <TextField label='Email' placeholder='Enter Email' type='email' inputRef={emailRef} required />
            <br/>
            <button type="submit" className="signin">Reset Password</button>
            <div>
                <h3><Link to="/signup"> Login </Link></h3>
            </div>
            </form>
            <h3>New user? <Link to="/signup"> Signup </Link></h3>
         </div>
         </div>
         
        </Grid> 
           
        </>
    )
}

export default ForgotPassword
