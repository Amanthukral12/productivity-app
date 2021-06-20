import React, { useRef, useState } from 'react'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField'
import { useAuth } from '../../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom';
import "./Login.css";
import photo from './photo1.jpg'
import photo2 from './photo2.jpg';
const Signup = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { signup } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory()
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (passwordRef.current.value !== passwordConfirmRef.current.value){
            
            return setError("Passwords do not match")
            
        }
        try{
            setError("")
            setLoading(true);
            await signup(emailRef.current.value, passwordRef.current.value)
            history.push("/login")
        } catch {
            setError('Failed to create an account')
        }
        setLoading(false)
        
    }
    return (
           <Grid className="loginRoot">
           <div className="ground">
           <picture className="loginPhoto">
           <source srcSet={photo2} className="loginImage" media="(max-width: 990px)" />
           <img src={photo} className="loginImage" alt=""/>
           </picture>
            <div className="loginRight">
            <h2 className="loginHeading">Produkto</h2>
            {error && <h1 className="error">{error}</h1>}
            <h3 className="welcomeMessage">Welcome to Produkto</h3>           
            <form onSubmit={handleSubmit} className="loginForm">
            <TextField label='Email' placeholder='Enter Email' type='email' inputRef={emailRef} required />
            
            <TextField label='Password' placeholder='Enter Password' type='password' inputRef={passwordRef} required />
           
            <TextField label='Confirm Password' placeholder='Enter Password again' type='password' inputRef={passwordConfirmRef} required />
            <br/>
            <button disabled={loading} type="submit" className="signin">Signup</button>
            </form>
            <h3 className="newUser">Already have an account? <Link to="/login" className="newUser">Log In</Link></h3>
            </div>
            </div>
            
           </Grid>
        
    )
}

export default Signup
