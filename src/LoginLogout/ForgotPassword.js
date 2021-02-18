import React, { useRef, useState } from 'react'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom';
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
           <Grid>
            <h2>Forgot Password</h2>
            {error && <h1>{error}</h1>}
            {message && <h1>{message}</h1>}           
            <form onSubmit={handleSubmit}>
            <TextField label='Email' placeholder='Enter Email' type='email' inputRef={emailRef} required />
            <br/>
            <button type="submit">Reset Password</button>
            <div>
                <Link to="/login">Login</Link>
            </div>
            </form>
            <h3>New user? <Link to="/signup"> Signup </Link></h3>
           </Grid>
        </>
    )
}

export default ForgotPassword
