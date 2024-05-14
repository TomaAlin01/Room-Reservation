import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Sala from './components/Sala';
import { AuthProvider } from './components/AuthContext';
import RoomList from './components/RoomList';
import Map from './components/Map';
import Login from './components/Login';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';


const App = () => {
  return (
    <AuthProvider>
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sala/:salaId" element={<Sala />} />
          <Route path="/room-list" element={<RoomList />} />
          <Route path="/map" element={<Map />} />
        </Routes>
        </Router>
    </AuthProvider>
  );
};

export default App;