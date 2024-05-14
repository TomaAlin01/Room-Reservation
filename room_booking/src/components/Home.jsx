import React, { useState,useContext } from 'react';
import '../styles.css';
import { AuthContext } from './AuthContext';

function Home() {
  const { isLoggedIn, login, logout } = useContext(AuthContext);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const openLoginModal = () => setShowLoginModal(true);
  const closeLoginModal = () => setShowLoginModal(false);
  const openSignUpModal = () => setShowSignUpModal(true);
  const closeSignUpModal = () => setShowSignUpModal(false);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Login successful:', data);
        login();
        closeLoginModal();
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
        username: newUsername, 
        email: newEmail,
        password: newPassword,
      };
  
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData), 
      });
  
      if (response.ok) {
        console.log('Signup successful');
      } else {
        console.error('Signup failed');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
    closeSignUpModal();
  };

  const handleSignOut = () => {
    logout();
    setEmail('');
    setPassword('');
  };


  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
});

const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
        ...prevState,
        [name]: value
    }));
};
  
  const handleSubmit = (event) => {
    event.preventDefault();
    fetch('http://localhost:3000/submit-form', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        setFormData({ name: '', email: '', message: '' });
    })
    .catch((error) => {
        console.error('Error:', error);
    });
};

  return (
    <div>
      <header>
        <h1>Room Booking</h1>
        <nav>
          <img src="logo.png" alt="Company Logo"/>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="/map">Map</a></li>
            <li><a href="/room-list">Room List</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          {!isLoggedIn ? (
            <div>
          <button className="login-button" onClick={openLoginModal}>Login</button>
          <button className="signup-button" onClick={openSignUpModal}>Sign Up</button>
          </div>
          ) : (
            <button className="logout-button" onClick={handleSignOut}>Sign Out</button>
          )}
          {showLoginModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeLoginModal}>&times;</span>
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
              <input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      )}

      {showSignUpModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeSignUpModal}>&times;</span>
            <form onSubmit={(e) => { e.preventDefault(); handleSignUp(); }}>
              <input
                type="text"
                placeholder="Username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button type="submit">Sign Up</button>
            </form>
          </div>
        </div>
      )}
      </nav>
      </header>
      
      <section className="about">
      <div className="text-content">
        <h2>Room Booking Application</h2>
        <p>Effortlessly manage your bookings with our intuitive room booking app. Whether it's for meetings, events, or conferences, our platform simplifies the process. Just log in, browse available rooms, select your preferred date and time, and finalize your booking with a few clicks. Enjoy hassle-free room reservations at your fingertips.</p>
      </div>
      <div className="image-content">
        <img src="about_1.jpg" alt="Imagine" style={{maxWidth: "100%", height: "auto"}} />
      </div>
      </section>
      <section className="about">
      <div className="text-content">
        <h2>Room List</h2>
        <p>On the following link you can see the full list of our rooms and from there you can go forther and check each individual room!</p>
        <a href="/room-list">Room List</a>
      </div>
      <div className="image-content">
        <img src="about_2.jpg" alt="Imagine" style={{maxWidth: "100%", height: "auto"}} />
      </div>
      </section>
      <section id="contact">
      <h2>Get in Touch</h2>
      <p>You wanna know more about our application. Write us right now!</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleInputChange}
          required
        ></textarea>
        <button type="submit">Submit</button>
      </form>
    </section>
      <div className="room-booking">
        
      </div>

      
    
      <footer>
        <p>Copyright &copy; Room Booking Application 2024</p>
    </footer>
    </div>
  );
}

export default Home;
