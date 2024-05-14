import React, { useRef, useEffect, useState, useContext } from 'react';
import  Card  from './Card';
import '../styles.css';
import { AuthContext } from './AuthContext';

function Map() {
    const mapRef = useRef(null);
    const [rooms, setRooms] = useState([]);
    const [startLocation, setStartLocation] = useState(null);
    const [travelTime, setTravelTime] = useState('');
    const [roomEvents, setRoomEvents] = useState([]);
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

    useEffect(() => {
        fetch('http://localhost:3000/rooms-map')
        .then(response => response.json())
        .then(data => {
            console.log(data);  
            setRooms(data);
        })
        .catch(error => console.error('Error fetching rooms:', error));
    }, []);
    function fetchRoomEvents(roomId) {
        fetch(`http://localhost:3000/events/${roomId}`)
            .then(response => response.json())
            .then(data => {
                console.log('Fetched events for roomId:', data);
                setRoomEvents(data);
            })
            .catch(error => console.error('Error fetching events:', error));
    }

    useEffect(() => {
        const googleMaps = window.google.maps;
        if (googleMaps && rooms.length > 0) {
            const map = new googleMaps.Map(mapRef.current, {
                center: { lat: rooms[0].latitude, lng: rooms[0].longitude },
                zoom: 12
            });

            const directionsService = new googleMaps.DirectionsService();
            const directionsRenderer = new googleMaps.DirectionsRenderer();
            directionsRenderer.setMap(map);

            map.addListener('click', (e) => {
                setStartLocation(e.latLng);
                new googleMaps.Marker({
                    position: e.latLng,
                    map: map,
                    title: 'Start Location',
                    icon: {
                        url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                    }
                });
            });

            rooms.forEach(room => {
                const marker = new googleMaps.Marker({
                    position: { lat: room.latitude, lng: room.longitude },
                    map: map,
                    title: room.name
                });

                marker.addListener('click', () => {
                    displayRoomDetails(room, map, marker, googleMaps);
                    fetchRoomEvents(room.id); 
                    if (startLocation) {
                        fetchDirections(directionsService, directionsRenderer, startLocation, marker.getPosition(), googleMaps);
                    } else {
                        alert("Please select a start location on the map.");
                    }
                });
            });
        }
    }, [rooms, startLocation]);

    function displayRoomDetails(room, map, marker, googleMaps) {
        const infoWindow = new googleMaps.InfoWindow({
            content: `<div><strong>${room.name}</strong><br/>Floor: ${room.floor}<br/>Building: ${room.building}<br/>Seats: ${room.seats}<br/>Type: ${room.type}</div>`
        });
        infoWindow.open(map, marker);
    }

    function fetchDirections(directionsService, directionsRenderer, origin, destination, googleMaps) {
        directionsService.route({
            origin,
            destination,
            travelMode: googleMaps.TravelMode.DRIVING
        }, (response, status) => {
            if (status === googleMaps.DirectionsStatus.OK) {
                directionsRenderer.setDirections(response);
                const durationDriving = response.routes[0].legs[0].duration.text;
                setTravelTime(prev => ({ ...prev, driving: `Drive time: ${durationDriving}` }));
            } else {
                window.alert('Directions request failed for driving due to ' + status);
            }
        });

        directionsService.route({
            origin,
            destination,
            travelMode: googleMaps.TravelMode.WALKING
        }, (response, status) => {
            if (status === googleMaps.DirectionsStatus.OK) {
                const durationWalking = response.routes[0].legs[0].duration.text;
                setTravelTime(prev => ({ ...prev, walking: `Walk time: ${durationWalking}` }));
            } else {
                window.alert('Directions request failed for walking due to ' + status);
            }
        });
    }

    return (
        <div>
      <header>
      <h1>Map</h1>
        <nav>
        <img src="/logo.png" alt="Company Logo"/>
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

          <div style={{ display: 'flex', height: '100vh' }}>
            <div ref={mapRef} style={{ flex: 3, height: '100%' }} />
            <div style={{ width: '330px', overflowY: 'auto', padding: '20px', height: '100vh', boxSizing: 'border-box' }}>
                <h2>Room Events</h2>
                {roomEvents.length > 0 ? roomEvents.map(event => (
                    <Card
                        key={event.id}
                        imgSrc={`/event_${event.roomId}.jpg`}
                        imgAlt={`${event.requester_name}'s event`}
                        title={`Event on ${event.date} at ${event.start_time}`}
                        description={`Organized by ${event.requester_name} from ${event.start_time} to ${event.end_time}. Contact: ${event.contact}, Participants: ${event.participants}`}
                        buttonText="View Details"
                        link="#"
                    />
                )) : <p>No events scheduled.</p>}
                <div>
                    <h2>{travelTime.driving}</h2>
                    <h2>{travelTime.walking}</h2>
                </div>
            </div>
        </div>
        
        <footer>
        <p>Copyright &copy; Room Booking Application 2024</p>
    </footer>
    </div>
    );
}

export default Map;