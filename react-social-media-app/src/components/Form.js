import React from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {GoogleLogin, GoogleOAuthProvider} from '@react-oauth/google'
import { useCookies } from 'react-cookie';
import {} from 'react-facebook-login'
import UserContext from './Context';





export default function Form(props)
{
    let [user, setUser]= React.useContext(UserContext)
    let [form, setForm] = React.useState({email: "", password: "", name: ""})
    let [error, setError] = React.useState("")
    let [dummyData, setDummyData] = React.useState("")
    let navigate = useNavigate()
    const handleLogin = async googleData => {
        const res = await fetch("http://localhost:5000/api/v1/auth/google", {
            method: "POST",
            body: JSON.stringify({
            token: googleData.credential
          }),
          headers: {
            "Content-Type": "application/json"
          }
        })
        let json = await res.json()
        if(json.success==true)
        {
            console.log(json)
            setUser((prev)=>
            {
                return {jwt: json.profile.jwt, name: json.profile.name, email: json.profile.email, picture: json.profile.picture}
            })
            
            navigate("/", { replace: true });
        }
        else
        {
            setError("Invalid credentials")
        }
        // store returned user somehow
      }
    async function testRequest()
    {
        
        let build = await fetch("http://localhost:5000/test", {headers:{"x-access-token": user}})
        let json = await build.json()
        console.log("Here is the JWT", json)
        
       
        return json;
    }

    
    async function changeForm(evt)
    {
        let name = evt.currentTarget.name
        let value = evt.currentTarget.value
        let response = await testRequest()
        console.log(response)
        setForm((prev)=>
        {
            return {...prev, [name]: value}
        })

    }
    
    async function collectForm(evt)
    {
        evt.preventDefault()
        if(props.page == "login")
        {
            let data = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(form)
            })
            let json = await data.json()
            if(json.success==true)
            {
                console.log(json)
                setUser((prev)=>
                {
                    return {jwt: json.profile.jwt, name: json.profile.name, email: json.profile.email, picture: json.profile.picture}
                })
                navigate("/", { replace: true });
            }
            else
            {
                setError("User already exists")
            }
        }
        else
        {
            let data = await fetch("http://localhost:5000/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(form)
            })
            let json = await data.json()
            if(json.success==true)
            {
                navigate("/login", { replace: true });
            }
            else
            {
                setError("User already exists")
            }
        }
    }

    return (
        <div className="container" id="container">
            <div className="form-container sign-up-container">
                <form>
                    <h1>Create Account</h1>
                    <div className="social-container">
                        <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
                        <a href="/auth/google" className="social"><i className="fab fa-google-plus-g"></i></a>
                        <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
                    </div>
                    <span>or use your email for registration</span>
                    <input type="text" placeholder="Name" />
                    <input type="email" placeholder="Email" />
                    <input type="password" placeholder="Password" />
                    <button>Sign Up</button>
                </form>
            </div>
            <div className="form-container sign-in-container">
                <form>
                    <h1>Sign in</h1>
                    <div className="social-container">
                        
                        <GoogleOAuthProvider clientId={"79040393211-3oclbp3abpnsuoq5gfl5skg45qfn6558.apps.googleusercontent.com"}><GoogleLogin
                            clientId={`79040393211-3oclbp3abpnsuoq5gfl5skg45qfn6558.apps.googleusercontent.com`}
                            buttonText="Log in with Google"
                            onSuccess={handleLogin}
                            onFailure={handleLogin}
                            cookiePolicy={'single_host_origin'}
                            redirectUri={"http://localhost:5000/google/callback"}
                        /></GoogleOAuthProvider>
                        
                    </div>
                    {error && <p className='formError'>{error}</p>}
                    <span>or use your account</span>
                    {props.page == "register" && <input type="text" name='name' placeholder="Name" onChange={changeForm} value={form.name}/>}
                    <input type="email" name='email' placeholder="Email" onChange={changeForm} value={form.email}/>
                    <input type="password" name='password' onChange={changeForm} placeholder="Password" value={form.password}/>
                    <a href="#">Forgot your password?</a>
                    <button onClick={collectForm}>{props.page == "login" ? "Login" : "Sign Up"}</button>
                </form>
            </div>
            <div className="overlay-container">
                <div className="overlay">
                    <div className="overlay-panel overlay-left">
                        <h1>Welcome Back!</h1>
                        <p>To keep connected with us please login with your personal info</p>
                        <button className="ghost" id="signIn">Sign In</button>
                    </div>
                    <div className="overlay-panel overlay-right">
                        <h1>Hello</h1>
                        <p>Enter your personal details and start journey with us</p>
                        {props.page == "login"? <Link to={"/register"}><button className="ghost" id="signUp">Sign Up</button></Link>  : <Link to={"/login"}><button className="ghost" id="signUp">Login</button></Link> }
                        
                    </div>
                </div>
            </div>
            <h1>{dummyData}</h1>
        </div>
    )
}