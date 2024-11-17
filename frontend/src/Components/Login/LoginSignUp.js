import React, { Fragment, useRef, useState, useEffect } from "react";
import "./LoginSignUp.css";
import Loader from "./../Car/loader";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import FaceIcon from "@material-ui/icons/Face";
import Notiflix from 'notiflix';

const LoginSignUp = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = user;

  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);

  // Login Handler
  const loginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("https://secure-mae-na0w0-0a956918.koyeb.app/api/v1/user/login", {
        method: "POST",
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user._id); // Save user ID
        Notiflix.Notify.success("Login successful!");
        navigate(`/cars`);
      } else {
        setError(data.message);
        Notiflix.Notify.failure(data.message || "Login failed!");
      }
    } catch (err) {
      setError("An error occurred during login.");
      Notiflix.Notify.failure("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  // Register Handler
  const registerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userData = {
      name,
      email,
      password,
    };

    try {
      const response = await fetch("https://secure-mae-na0w0-0a956918.koyeb.app/api/v1/user/register", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id); // Save user ID
        Notiflix.Notify.success("Registration successful!");
        navigate(`/cars`);
      } else {
        setError(data.message);
        Notiflix.Notify.failure(data.message || "Registration failed!");
      }
    } catch (err) {
      setError("An error occurred during registration.");
      Notiflix.Notify.failure("An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  // Handle changes in registration form
  const registerDataChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Switch between login and register tabs
  const switchTabs = (e, tab) => {
    if (tab === "login") {
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");

      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    }
    if (tab === "register") {
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToNeutral");

      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
  
      navigate("/cars");
    }
  }, [])
  
  useEffect(() => {
    if (error) {
      Notiflix.Notify.failure(error);
    }
    
  }, [error, navigate]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="LoginSignUpContainer">
            <div className="LoginSignUpBox shadow-xl">
              <div>
                <div className="login_signUp_toggle">
                  <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
                  <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
                </div>
                <button ref={switcherTab}></button>
              </div>

              {/* Login Form */}
              <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
                <div className="loginEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="loginPassword">
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <Link to="/password/forgot">Forget Password?</Link>
                <input type="submit" value="Login" className="loginBtn" />
              </form>

              {/* Register Form */}
              <form
                className="signUpForm"
                ref={registerTab}
                encType="multipart/form-data"
                onSubmit={registerSubmit}
              >
                <div className="signUpName">
                  <FaceIcon />
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    name="name"
                    value={name}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="signUpEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="signUpPassword">
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    name="password"
                    value={password}
                    onChange={registerDataChange}
                  />
                </div>
                <input type="submit" value="Register" className="signUpBtn" />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default LoginSignUp;
