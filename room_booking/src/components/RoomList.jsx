import Card from "./Card";
import React, { useState,useContext,useEffect } from 'react';
import '../styles.css';
import { AuthContext } from './AuthContext';

const RoomList = () => {
    const { isLoggedIn, login, logout } = useContext(AuthContext);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignUpModal, setShowSignUpModal] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newRoomName, setNewRoomName] = useState('');
    const [newRoomFloor, setNewRoomFloor] = useState('');
    const [newRoomBuilding, setNewRoomBuilding] = useState('');
    const [newRoomSeats, setNewRoomSeats] = useState('');
    const [newRoomType, setNewRoomType] = useState('');
    const [newRoomMapLink, setNewRoomMapLink] = useState('');
    const [newRoomLatitude, setNewRoomLatitude] = useState('');
    const [newRoomLongitude, setNewRoomLongitude] = useState('');
    const [showAddRoomModal, setShowAddRoomModal] = useState(false);

    const openAddRoomModal = () => setShowAddRoomModal(true);
    const closeAddRoomModal = () => {
      setShowAddRoomModal(false);
      setNewRoomName('');

    };

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
          const { username, email } = data;
          login(username, email);
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
    const handleAddRoom = async (event) => {
      event.preventDefault();
      try {
        const roomData = {
          name: newRoomName,
          floor: newRoomFloor,
          building: newRoomBuilding,
          seats: parseInt(newRoomSeats),
          type: newRoomType,
          map_link: newRoomMapLink,
          latitude: parseFloat(newRoomLatitude),
          longitude: parseFloat(newRoomLongitude),
        };
    
        const response = await fetch('http://localhost:3000/rooms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(roomData),
        });
    
        if (response.ok) {
          console.log('Room added successfully');
          closeAddRoomModal();
        } else {
          console.error('Failed to add room');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    const { isAdmin } = useContext(AuthContext);
    const [rooms, setRooms] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    useEffect(() => {
      const fetchRooms = async () => {
        try {
          const response = await fetch('http://localhost:3000/rooms');
          if (!response.ok) {
            throw new Error('Failed to fetch rooms');
          }
          const data = await response.json();
          setRooms(data);
          setLoading(false);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      };
    
      fetchRooms();
    }, []);
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    
  
  return (
    <div>
      <header>
      <h1>Room List</h1>
        <nav>
        
          <img src="logo.png" alt="Company Logo"/>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/#about">About</a></li>
            <li><a href="/map">Map</a></li>
            <li><a href="/room-list">Room List</a></li>
            <li><a href="/#contact">Contact</a></li>
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
      <div className="banner-container">

</div>

    <div className="container">
  <div className="banner-container">
  <div className="banner-list">
    {rooms.map(room => (
      <Card
        key={room.id}
        imgSrc={room.image || `/sala_${room.id}.png`} 
        imgAlt={`Room ${room.id}`}
        title={room.name}
        description={`Floor: ${room.floor}, Building: ${room.building}`}
        buttonText="Open Page"
        link={`http://localhost:3001/sala/${room.id}`}
        className="banner-card"
      />
    ))}
  </div>
  {/*
    <div className="banner-list">
      <Card
        imgSrc="sala_1.png"
        imgAlt="Banner 1"
        title="Amphitheater 4B"
        description="Room 1"
        buttonText="Open Page"
        link="http://localhost:3001/sala/1"
        className="banner-card"
      />
      <Card
        imgSrc="sala_2.png"
        imgAlt="Banner 1"
        title="Conference A1"
        description="Room 2"
        buttonText="Open Page"
        link="http://localhost:3001/sala/2"
        className="banner-card"
      />
      <Card
        imgSrc="sala_3.png"
        imgAlt="Banner 1"
        title="Conference F5"
        description="Room 3"
        buttonText="Open Page"
        link="http://localhost:3001/sala/3"
        className="banner-card"
      />
      <Card
        imgSrc="sala_4.png"
        imgAlt="Banner 2"
        title="Laboratory 201"
        description="Room 4"
        buttonText="Open Page"
        link="http://localhost:3001/sala/4"
        className="banner-card"
      />
      <Card
        imgSrc="sala_5.png"
        imgAlt="Banner 3"
        title="Laboratory 135"
        description="Room 5"
        buttonText="Open Page"
        link="http://localhost:3001/sala/5"
        className="banner-card"
      />

    </div>
  */}
  </div>
  <div className="rectangle">
    <div className="rectangle-content">
      <Card
        imgSrc="event_1.jpg"
        imgAlt="Banner 4"
        title="Event 1"
        description="Event 1"
        buttonText="Open Page"
        link="http://localhost:3001/sala/6"
        className="banner-card"
      />
      <Card
        imgSrc="event_2.jpg"
        imgAlt="Banner 5"
        title="Event 2"
        description="Event 2"
        buttonText="Open Page"
        link="http://localhost:3001/sala/7"
        className="banner-card"
      />
    </div>
  </div>
</div>
{isAdmin && showAddRoomModal && (
  <div className="modal">
    <div className="modal-content">
      <span className="close" onClick={closeAddRoomModal}>&times;</span>
      <form onSubmit={handleAddRoom}>
        <input
          type="text"
          placeholder="Room Name"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Floor"
          value={newRoomFloor}
          onChange={(e) => setNewRoomFloor(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Building"
          value={newRoomBuilding}
          onChange={(e) => setNewRoomBuilding(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Seats"
          value={newRoomSeats}
          onChange={(e) => setNewRoomSeats(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Type"
          value={newRoomType}
          onChange={(e) => setNewRoomType(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Map Link"
          value={newRoomMapLink}
          onChange={(e) => setNewRoomMapLink(e.target.value)}
        />
        <input
          type="text"
          placeholder="Latitude"
          value={newRoomLatitude}
          onChange={(e) => setNewRoomLatitude(e.target.value)}
        />
        <input
          type="text"
          placeholder="Longitude"
          value={newRoomLongitude}
          onChange={(e) => setNewRoomLongitude(e.target.value)}
        />
        <button type="submit">Add Room</button>
      </form>
    </div>
  </div>
)}

{isAdmin && (
  <button className="add-room-button" onClick={openAddRoomModal}>Add Room</button>
)}


<footer>
        <p>Copyright &copy; Room Booking Application 2024</p>
    </footer>
</div>
  );
};

export default RoomList;