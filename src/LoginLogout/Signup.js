import React, { useRef, useState } from 'react'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { useAuth } from '../contexts/AuthContext'
const Signup = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { signup } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (passwordRef.current.value !== passwordConfirmRef.current.value){
            
            return setError("Passwords do not match")
            
        }
        try{
            setError("")
            setLoading(true);
            await signup(emailRef.current.value, passwordRef.current.value)
        } catch {
            setError('Failed to create an account')
        }
        setLoading(false)
        
    }
    return (
        <>
           <Grid>
            <h2>Signup</h2>
            {error && <h1>{error}</h1>}
            <form onSubmit={handleSubmit}>
            <TextField label='Email' placeholder='Enter Email' type='email' inputRef={emailRef} required />
            <br/>
            <TextField label='Password' placeholder='Enter Password' type='password' inputRef={passwordRef} required />
            <br/>
            <TextField label='Confirm Password' placeholder='Enter Password again' type='password' inputRef={passwordConfirmRef} required />
            <br/>
            <Button disabled={loading} type="submit">Signup</Button>
            </form>
            <h3>Already have an account? Log In</h3>
           </Grid>
        </>
    )
}

export default Signup
