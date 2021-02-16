import React, { useRef } from 'react'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { useAuth } from '../contexts/AuthContext'
const Signup = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { signup } = useAuth();


    const handleSubmit = (e) => {
        e.preventDefault();
        signup(emailRef.current.value, passwordRef.current.value)
    }
    return (
        <>
           <Grid>
            <h2>Signup</h2>
            <TextField label='Email' placeholder='Enter Email' type='email' ref={emailRef} required />
            <br/>
            <TextField label='Password' placeholder='Enter Password' type='password' ref={passwordRef} required />
            <br/>
            <TextField label='Confirm Password' placeholder='Enter Password again' type='password' ref={passwordConfirmRef} required />
            <br/>
            <Button>Signup</Button>
            <h3>Already have an account? Log In</h3>
           </Grid>
        </>
    )
}

export default Signup
