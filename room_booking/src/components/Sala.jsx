import React, { useState, useEffect, useContext } from 'react';
import '../styles.css';
import Calendar from './Calendar';
import  Card  from './Card';
import { AuthContext } from './AuthContext';
import { useParams } from 'react-router-dom';

function Sala () {
  
  const { isLoggedIn, login, logout } = useContext(AuthContext);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [rooms, setRooms] = useState([]);


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

  const [events, setEvents] = useState([]);

    useEffect(() => {
      fetch('http://localhost:3000/rooms') 
          .then(response => response.json())
          .then(data => setRooms(data))
          .catch(error => console.error('Error fetching rooms:', error));
  }, []);

  const { salaId } = useParams();
  
  useEffect(() => {
    if (!salaId) return; 

    fetch(`http://localhost:3000/events/${salaId}`)
        .then(response => response.json())
        .then(data => {
            console.log('Fetched events for salaId:', data);
            setEvents(data);
        })
        .catch(error => console.error('Error:', error));
}, [salaId]);
  console.log('salaId from URL:', salaId);
  const currentSalaId = Number(salaId);
  
  const filteredRoom = rooms.find(room => room.id === currentSalaId);
  return (
    <div>
      <header>
        <nav>
        <img src="/logo.png" alt="Company Logo"/>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/#about">About</a></li>
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
        <div>
      <h1>Room Booking</h1>
      <Calendar salaId={salaId} />
    </div>
      </header>
      <section className="about">
      {filteredRoom ? (
        <div key={filteredRoom.id} className="room-card">
            <div className="image-content">
                <img src={`/sala_${filteredRoom.id}.png`} style={{ maxWidth: '100%', height: 'auto' }} />
            </div>
            <div className="text-content">
                <h2>{filteredRoom.name}</h2>
                <p>The room is localized in the following building: {filteredRoom.building}, at the next floor: {filteredRoom.floor}. The room has {filteredRoom.seats} seats and it's of the following type: {filteredRoom.type}.</p>
            </div>
        </div>
      ) : (
        <p>Room not found.</p>
      )}
    </section>
<div className="cards-row">
    {events.map((event) => (
        <Card 
            key={`${event.id}`}
            imgSrc={`/event_${salaId}.jpg`}
            imgAlt={`${event.requester_name}'s event`}
            title={`Event on ${event.date} at ${event.start_time}`}
            description={`Organized by ${event.requester_name} from ${event.start_time} to ${event.end_time}. Contact: ${event.contact}, Participants: ${event.participants}`}
            buttonText="View Details"
            link="#"  
        />
    ))}
</div>
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

export default Sala;
