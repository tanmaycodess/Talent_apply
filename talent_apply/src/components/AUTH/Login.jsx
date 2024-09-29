import React, { useState } from 'react';
import Logo from '/Images/logo1.png';
import './Login.css';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    };

    const handleSignupChange = (e) => {
        const { name, value } = e.target;
        setSignupData({ ...signupData, [name]: value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });

            const data = await response.json(); 
            if (!response.ok) {
                throw new Error(data.message);
            }

            // Save token, applicantId, and name to local storage
            localStorage.setItem('token', data.token);
            localStorage.setItem('applicantId', data.applicantId); // Assuming the applicantId is returned as 'id'
            localStorage.setItem('name', data.name);

            alert('Login successful');
            window.location.href = '/landing'; // Redirect to landing page
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        if (signupData.password !== signupData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(signupData),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }

            // Save token, applicantId, and name after successful signup
            localStorage.setItem('token', data.token); // If the token is returned on signup
            localStorage.setItem('applicantId', data.applicantId); // Save applicantId from response
            localStorage.setItem('name', data.name);

            alert('User registered successfully');
            setIsLogin(true); // Switch to login view after successful signup
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <section className="h-100 gradient-form" style={{ backgroundColor: '#eee' }}>
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-xl-10">
                        <div className="card rounded-3 text-black">
                            <div className="row g-0">
                                <div className="col-lg-6">
                                    <div className="card-body p-md-5 mx-md-4">
                                        <div className="text-center">
                                            <img src={Logo} style={{ width: '185px' }} alt="logo" />
                                            <h4 className="mt-1 mb-5 pb-1">We are Insansa Technology</h4>
                                        </div>

                                        {isLogin ? (
                                            <form onSubmit={handleLogin}>
                                                <p>Please login to your account</p>
                                                {error && <p className="text-danger">{error}</p>}
                                                <div className="form-outline mb-4">
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        className="form-control"
                                                        placeholder="Email address"
                                                        required
                                                        value={loginData.email}
                                                        onChange={handleLoginChange}
                                                    />
                                                    <label className="form-label">Email</label>
                                                </div>

                                                <div className="form-outline mb-4">
                                                    <input
                                                        type="password"
                                                        name="password"
                                                        className="form-control"
                                                        placeholder="Password"
                                                        required
                                                        value={loginData.password}
                                                        onChange={handleLoginChange}
                                                    />
                                                    <label className="form-label">Password</label>
                                                </div>

                                                <div className="text-center pt-1 mb-5 pb-1">
                                                    <button className="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3" type="submit">
                                                        Log in
                                                    </button>
                                                    <a className="text-muted m-4" href="#!">Forgot password?</a>
                                                </div>

                                                <div className="d-flex align-items-center justify-content-center pb-4">
                                                    <p className="mb-0 me-2">Don't have an account?</p>
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger"
                                                        onClick={() => setIsLogin(false)}
                                                    >
                                                        Create New
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <form onSubmit={handleSignup}>
                                                <p>Create your account</p>
                                                {error && <p className="text-danger">{error}</p>}

                                                <div className="form-outline mb-4">
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        className="form-control"
                                                        placeholder="Full Name"
                                                        required
                                                        value={signupData.name}
                                                        onChange={handleSignupChange}
                                                    />
                                                    <label className="form-label">Name</label>
                                                </div>

                                                <div className="form-outline mb-4">
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        className="form-control"
                                                        placeholder="Email address"
                                                        required
                                                        value={signupData.email}
                                                        onChange={handleSignupChange}
                                                    />
                                                    <label className="form-label">Email</label>
                                                </div>

                                                <div className="form-outline mb-4">
                                                    <input
                                                        type="password"
                                                        name="password"
                                                        className="form-control"
                                                        placeholder="Password"
                                                        required
                                                        value={signupData.password}
                                                        onChange={handleSignupChange}
                                                    />
                                                    <label className="form-label">Password</label>
                                                </div>

                                                <div className="form-outline mb-4">
                                                    <input
                                                        type="password"
                                                        name="confirmPassword"
                                                        className="form-control"
                                                        placeholder="Confirm Password"
                                                        required
                                                        value={signupData.confirmPassword}
                                                        onChange={handleSignupChange}
                                                    />
                                                    <label className="form-label">Confirm Password</label>
                                                </div>

                                                <div className="text-center pt-1 mb-5 pb-1">
                                                    <button className="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3" type="submit">
                                                        Sign up
                                                    </button>
                                                </div>

                                                <div className="d-flex align-items-center justify-content-center pb-4">
                                                    <p className="mb-0 me-2">Already have an account?</p>
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger"
                                                        onClick={() => setIsLogin(true)}
                                                    >
                                                        Log in
                                                    </button>
                                                </div>
                                            </form>
                                        )}
                                    </div>
                                </div>
                                <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
                                    <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                                        {isLogin ? (
                                            <h4 className="mb-4">We are more than just a company</h4>
                                        ) : (
                                            <h4 className="mb-4">Join Us</h4>
                                        )}
                                        {isLogin ? (
                                            <p className="textDescription small mb-0">
                                                Over the years, we have witnessed Technology is the catalyst to enhance processes & positively impact business outcomes irrespective of type of industry. There has been a paradigm shift in the way technology is conceived, delivered & consumed. We help our clients excel by offering Technology solutions relevant to changing times with a broad portfolio of solutions & services that has immense utility across multiple functions and departments of modern global organizations.
                                            </p>
                                        ) : (
                                            <p className="textDescription small mb-0">
                                                INSANSA Technologies is formed by professionals with diversified experience of more than a decade in SAP consulting serving clients across industries & geographies.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Auth;
