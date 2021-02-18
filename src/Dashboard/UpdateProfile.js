import React, { useRef, useState } from 'react'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom';
const UpdateProfile = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { currentUser, updatePassword, updateEmail } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory()
    const handleSubmit = (e) => {
        e.preventDefault();

        if (passwordRef.current.value !== passwordConfirmRef.current.value){
            return setError("Passwords do not match") 
        }

        const promises = [];
        setLoading(true);
        setError("")
        if(emailRef.current.value !== currentUser.email) {
            promises.push(updateEmail(emailRef.current.value))
        }

        if(passwordRef.current.value) {
            promises.push(updatePassword(passwordRef.current.value))
        }

        Promise.all(promises).then(() => {
            history.push('/')
        }).catch(() => {
            setError('Failed to update account');
        }).finally(() => {
            setLoading(false);
        })
        
        
        
    }
    return (
        <>
           <Grid>
            <h2>Update Profile</h2>
            {error && <h1>{error}</h1>}
            <form onSubmit={handleSubmit}>
            <TextField label='Email' placeholder='Enter Email' type='email' inputRef={emailRef} required defaultValue={currentUser.email} />
            <br/>
            <TextField label='Password' placeholder='Leave Blank to keep it same' type='password' inputRef={passwordRef} />
            <br/>
            <TextField label='Confirm Password' placeholder='Leave Blank to keep it same' type='password' inputRef={passwordConfirmRef} />
            <br/>
            <Button disabled={loading} type="submit">Update Profile</Button>
            </form>
            <h3><Link to="/">Cancel</Link></h3>
           </Grid>
        </>
    )
}

export default UpdateProfile
