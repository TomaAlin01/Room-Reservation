import React, { useEffect, useState, useContext } from 'react';
import { MDBContainer, MDBCol, MDBRow, MDBBtn, MDBIcon, MDBInput, MDBCheckbox } from 'mdb-react-ui-kit';
import '../styles.css';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom'; 

function Login() {

    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate(); 
    const [isLoginView, setIsLoginView] = useState(true); 
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showRegistrationSuccess, setShowRegistrationSuccess] = useState(false);

    
    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, password: formData.password })
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Login successful:', data);
                login(data.username, data.email);
                setShowSuccessMessage(true);
                setTimeout(() => {
                    setShowSuccessMessage(false);
                    navigate('/');
                }, 1000);
            } else {
                console.error('Login error:', data.error);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };

    const handleSignUp = async () => {
        try {
            const userData = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
            };
    
            const response = await fetch('http://localhost:3000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });
    
            if (response.ok) {
                console.log('Signup successful');
                setShowRegistrationSuccess(true); 
                setTimeout(() => {
                    setShowRegistrationSuccess(false); 
                    setFormData({ username: '', email: '', password: '' });
                    toggleView(); 
                }, 1000);
            } else {
                console.error('Signup failed', await response.text());
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };
    

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setFormData({ email: '', password: '', username: '' });
};

  return (
    <MDBContainer fluid className="p-3 my-5 h-custom">
            {showSuccessMessage && (
                <div style={{
                    position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)',
                    backgroundColor: 'lightgreen', padding: '20px', borderRadius: '10px', zIndex: 1000
                }}>
                    Successfully logged in!
                </div>
            )}
            {showRegistrationSuccess && (
                <div style={{
                    position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)',
                    backgroundColor: 'lightgreen', padding: '20px', borderRadius: '10px', zIndex: 1000
                }}>
                    Successfully registered!
                </div>
            )}
        <MDBRow>
            <MDBCol col='10' md='6'>
                <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" className="img-fluid" alt="Sample image" />
            </MDBCol>
            <MDBCol col='4' md='6'style={{ marginTop: '120px' }}>
            <div className="d-flex flex-row align-items-center justify-content-center">
                        <p className="lead fw-normal mb-0 me-3">Welcome to Room Reservation</p>
                    </div>
                {isLoginView ? (
                    <>
                        <div className="divider d-flex align-items-center my-4">
                            <p className="text-center fw-bold mx-3 mb-0">Login</p>
                        </div>
                        <MDBInput wrapperClass='mb-4' label='Email address' name="email" type='email' size="lg" value={formData.email} onChange={handleInputChange} />
                        <MDBInput wrapperClass='mb-4' label='Password' name="password" type='password' size="lg" value={formData.password} onChange={handleInputChange} />
                        <div className='text-center text-md-start mt-4 pt-2'>
                            <MDBBtn className="mb-0 px-5" size='lg' onClick={handleLogin}>Login</MDBBtn>
                            <p className="small fw-bold mt-2 pt-1 mb-0">Don't have an account? <a href="#!" className="link-danger" onClick={toggleView}>Register</a></p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="divider d-flex align-items-center my-4">
                            <p className="text-center fw-bold mx-3 mb-0">Sign Up</p>
                        </div>
                        <MDBInput wrapperClass='mb-4' label='Username' name="username" type='text' size="lg" value={formData.username} onChange={handleInputChange} />
                        <MDBInput wrapperClass='mb-4' label='Email address' name="email" type='email' size="lg" value={formData.email} onChange={handleInputChange} />
                        <MDBInput wrapperClass='mb-4' label='Password' name="password" type='password' size="lg" value={formData.password} onChange={handleInputChange} />
                        <div className='text-center text-md-start mt-4 pt-2'>
                            <MDBBtn className="mb-0 px-5" size='lg' onClick={handleSignUp}>Sign Up</MDBBtn>
                            <p className="small fw-bold mt-2 pt-1 mb-0">Already have an account? <a href="#!" className="link-danger" onClick={toggleView}>Login</a></p>
                        </div>
                    </>
                )}
            </MDBCol>
        </MDBRow>
    </MDBContainer>
);
}
      
      {/*
      <div className="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary">
        <div className="text-white mb-3 mb-md-0">
          Copyright © 2020. All rights reserved.
        </div>
        
        <div>
          <MDBBtn tag='a' color='none' className='mx-3' style={{ color: 'white' }}>
            <MDBIcon fab icon='facebook-f' size="md"/>
          </MDBBtn>
          <MDBBtn tag='a' color='none' className='mx-3' style={{ color: 'white'  }}>
            <MDBIcon fab icon='twitter' size="md"/>
          </MDBBtn>
          <MDBBtn tag='a' color='none' className='mx-3' style={{ color: 'white'  }}>
            <MDBIcon fab icon='google' size="md"/>
          </MDBBtn>
          <MDBBtn tag='a' color='none' className='mx-3' style={{ color: 'white'  }}>
            <MDBIcon fab icon='linkedin-in' size="md"/>
          </MDBBtn>
        </div>
  
      </div>
      */}
   

export default Login;