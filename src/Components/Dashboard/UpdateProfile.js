import React, { useRef, useState } from 'react'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField'
import { useAuth } from '../../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom';
import "../LoginLogout/Login.css";
import photo from '../LoginLogout/photo1.jpg'
const UpdateProfile = () => {
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { currentUser, updatePassword, updateEmail, updateName, updateProfileImage } = useAuth();
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
        if(nameRef.current.value) {
            promises.push(updateName(nameRef.current.value))
        }
        if(emailRef.current.value !== currentUser.email) {
            promises.push(updateEmail(emailRef.current.value))
        }

        if(passwordRef.current.value) {
            promises.push(updatePassword(passwordRef.current.value))
        }

        promises.push(updateProfileImage(currentUser.photoURL));

        Promise.all(promises).then(() => {
            history.push('/')
        }).catch(() => {
            setError('Failed to update account');
        }).finally(() => {
            setLoading(false);
        })
        
        
        
    }
    return (
           <Grid className="loginRoot">
           <div className="ground">
            <div className="loginPhoto">
                <img src={photo} className="loginImage" alt=""/>
            </div>
            <div className="loginRight">
            <h2 className="loginHeading">Produkto</h2>
            {error && <h1 className="error">{error}</h1>}
            <h3 className="welcomeMessage">Update Profile</h3>           
            <form onSubmit={handleSubmit} className="loginForm">
            <TextField label='Name' placeholder='Enter Name' type='text' inputRef={nameRef} required defaultValue={currentUser.displayName} />
            <br/>
            <TextField label='Email' placeholder='Enter Email' type='email' inputRef={emailRef} required defaultValue={currentUser.email} />
            <br/>
            <TextField label='Password' placeholder='Leave Blank to keep it same' type='password' inputRef={passwordRef} />
            <br/>
            <TextField label='Confirm Password' placeholder='Leave Blank to keep it same' type='password' inputRef={passwordConfirmRef} />
            <br/>
            <button disabled={loading} type="submit" className="signin">Update Profile</button>
            </form>
            <h3 ><Link to="/" className="newUser">Cancel</Link></h3>
            </div>
            </div>
            
           </Grid>
    )
}

export default UpdateProfile
