import React, { useState, useEffect } from 'react';

const ReservationForm = ({ day, time, salaId, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [participants, setParticipants] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    const startTime = new Date(`2024-01-01T${time}:00Z`);
    startTime.setHours(startTime.getHours() + 1); 
    const newEndTime = startTime.toISOString().slice(11, 16);
    setEndTime(newEndTime);
  }, [time]);
  console.log('salaId from:', salaId);
  const handleSubmit = (e) => {
    e.preventDefault();
    const bookingData = {
      date: day,
      start_time: time,
      end_time: endTime,
      requester_name: name,
      contact,
      participants: parseInt(participants, 10),
      status: 'pending',
      salaId: salaId, 
    };
    
    fetch('http://localhost:3000/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      onSubmit(); 
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    <div className="reservation-form">
      <h3>Reserve Slot for Room {salaId}</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Date:</label>
          <span>{day}</span>
        </div>
        <div>
          <label>Start Time:</label>
          <span>{time}</span>
        </div>
        <div>
          <label>End Time:</label>
          <span>{endTime}</span>
        </div>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Contact:</label>
          <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} required />
        </div>
        <div>
          <label>Participants:</label>
          <input type="text" value={participants} onChange={(e) => setParticipants(e.target.value)} />
        </div>
        <button type="submit">Submit</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default ReservationForm;