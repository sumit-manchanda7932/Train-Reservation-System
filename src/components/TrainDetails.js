import React, { useState } from 'react';
import './TrainDetails.css';

const TrainDetails = () => {
  // State to store the number of passengers and passenger details
  const [numPassengers, setNumPassengers] = useState(1);
  const [passengerDetails, setPassengerDetails] = useState([{ name: '', age: '' }]);

  // Function to update the number of passengers
  const handleNumPassengersChange = (e) => {
    var value = parseInt(e.target.value);
    value = Math.min(Math.max(value, 1), 10);
    setNumPassengers(value);
    setPassengerDetails(Array.from({ length: value }, () => ({ name: '', age: '' })));
  };

  // Function to update passenger details
  const handlePassengerDetailsChange = (index, field, value) => {
    const updatedPassengers = [...passengerDetails];
    updatedPassengers[index][field] = value;
    setPassengerDetails(updatedPassengers);
  };

  return (
    <div class="train-details-wrapper">
        <div className="train-details-container">
        <h2 className="train">Train Name: Example Express </h2>
        <div className="details-section">
            <h3>Departure</h3>
            <p>Time: 08:00 AM</p>
            <p>Place: Example Station</p>
        </div>
        <div className="details-section">
            <h3>Arrival</h3>
            <p>Time: 04:00 PM</p>
            <p>Place: Destination Station</p>
        </div>
        <div className="details-section">
            <h3>Tickets</h3>
            <p>Available: 50</p>
        </div>
        <div className="passenger-section">
            <h3>Passenger Details</h3>
            <label htmlFor="numPassengers">Number of Passengers :</label>
            <input
                className=""
                type="number"
                id="numPassengers"
                name="numPassengers"
                min="1"
                max="10"
                value={numPassengers}
                onChange={handleNumPassengersChange}
            />
            {passengerDetails.map((passenger, index) => (
            <div key={index} className="passenger-inputs">
                <input
                type="text"
                placeholder={`Passenger ${index + 1} Name`}
                value={passenger.name}
                onChange={(e) => handlePassengerDetailsChange(index, 'name', e.target.value)}
                />
                <input
                type="text"
                placeholder={`Passenger ${index + 1} Age`}
                value={passenger.age}
                onChange={(e) => handlePassengerDetailsChange(index, 'age', e.target.value)}
                />
            </div>
            ))}
        </div>
        <button  className="book-button">Book</button>
        </div>
    </div>
  );
};

export default TrainDetails;
