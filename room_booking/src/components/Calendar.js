import React from 'react';
import '../styles.css';
import ReservationForm from './ReservationForm';

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.handleSlotClick = this.handleSlotClick.bind(this);
    this.state = {
      selectedDay: null,
      selectedTime: null,
      events: {},
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
    };
  }

  componentDidMount() {
    this.fetchEvents();
  }

  fetchEvents = () => {
    const { salaId } = this.props;
    if (!salaId) {
        console.error("fetchEvents called without a valid salaId.");
        return; 
    }
    fetch(`http://localhost:3000/events/${salaId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
          const eventsByDate = data.reduce((acc, event) => {
              if (!acc[event.date]) {
                  acc[event.date] = {};
              }
              acc[event.date][event.start_time] = event; 
              return acc;
          }, {});
          console.log("Transformed events data:", eventsByDate);
          this.setState({ events: eventsByDate });
      })
        .catch((error) => {
            console.error('Error fetching events for sala:', salaId, error);
        });
}
  submitEvent(eventData) {
    const { salaId } = this.props;
    fetch(`http://localhost:3000/events/${salaId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    })
    .then(response => response.json())
    .then(() => {
      this.fetchEvents();
    })
    .catch(error => {
      console.error('Error submitting event for sala:', salaId, error);
    });
  }

  changeMonth = (delta) => {
    let newMonth = this.state.currentMonth + delta;
    let newYear = this.state.currentYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }

    this.setState({ currentMonth: newMonth, currentYear: newYear });
  }

  daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  }

  selectDay = (day) => {
    const { currentMonth, currentYear } = this.state;
    const fullDate = new Date(currentYear, currentMonth, day, 12);
    this.setState({ selectedDay: fullDate.toISOString().slice(0, 10), selectedTime: null });
}

  renderDay = (i) => {
    return (
      <div key={i} className="day" onClick={() => this.selectDay(i)}>
        {i}
    </div>
    );
  }
  handleSlotClick = (day, time) => {
    const event = this.state.events[day] && this.state.events[day][time];
    if (event) {
        console.log('Event details:', event);
    } else {
        this.setState({ selectedDay: day, selectedTime: time });
    }
}
renderHourSlots = (day) => {
  const slots = [];
  const formattedDay = this.state.selectedDay;
  const dayEvents = this.state.events[formattedDay] || {};

  for (let hour = 8; hour <= 17; hour++) {
      const time = `${hour < 10 ? '0' + hour : hour}:00`;
      const event = dayEvents[time];
      slots.push(
          <div key={time} className="hour-slot" onClick={() => this.handleSlotClick(day, time)}>
              {time} - {event ? `${event.requester_name} (Booked)` : 'Available'}
          </div>
      );
  }
  return slots;
}
updateEvents = () => {
  this.fetchEvents();
}

  render() {
    const { currentMonth, currentYear } = this.state;
    const daysCount = this.daysInMonth(currentMonth, currentYear);
    const days = [];
    for (let i = 1; i <= daysCount; i++) {
      days.push(this.renderDay(i));
    }

    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];

return (
  <div className="calendar-layout">
    <div id="calendar">
      <div className="header">
        <button onClick={() => this.changeMonth(-1)}>&lt;</button>
        <span className="month-name">{monthNames[currentMonth]}</span>
        <span className="year">{currentYear}</span>
        <button onClick={() => this.changeMonth(1)}>&gt;</button>
      </div>
      <div className="weekdays">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      <div className="days">
        {days}
      </div>
      </div>
        {this.state.selectedDay && (
          <div className="event-sidebar active">
            <h2>Events on {this.state.selectedDay}</h2>
            <div className="hourly-slots">
              {this.renderHourSlots(this.state.selectedDay)}
            </div>
          </div>
        )}
        {this.state.selectedDay && this.state.selectedTime && !this.state.events[this.state.selectedDay]?.[this.state.selectedTime] && (
    <ReservationForm
    day={this.state.selectedDay}
    time={this.state.selectedTime}
    salaId={this.props.salaId}
    onClose={() => this.setState({ selectedDay: null, selectedTime: null })}
    onSubmit={this.updateEvents}
  />
)}
</div>
);
}
}

export default Calendar;
