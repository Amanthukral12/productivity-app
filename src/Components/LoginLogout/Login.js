import React, { useRef, useState } from 'react'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { useAuth } from '../../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom';
const Login = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { login, currentUser } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory()
    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            setError("")
            setLoading(true);
            await login(emailRef.current.value, passwordRef.current.value)
            history.push("/update-profile")
        } catch {
            setError('Failed to sign in')
        }
        setLoading(false)
        
    }
    return (
        <>
           <Grid>
            <h2>Login</h2>
            {error && <h1>{error}</h1>}           
            <form onSubmit={handleSubmit}>
            <TextField label='Email' placeholder='Enter Email' type='email' inputRef={emailRef} required />
            <br/>
            <TextField label='Password' placeholder='Enter Password' type='password' inputRef={passwordRef} required />
            <br/>
            <Button disabled={loading} type="submit">Login</Button>
            <div>
                <Link to="/forgot-password">Forgot Password?</Link>
            </div>
            </form>
            <h3>New user? <Link to="/signup"> Signup </Link></h3>
           </Grid>
        </>
    )
}

export default Login
