import React, { useState,useEffect } from 'react';
import './Traindata.css';
import { useNavigate } from 'react-router-dom';



const TrainCard = ({ departureStation,departureTime, arrivalStation, arrivalTime , trainName, availableTickets }) => {
  const navigate = useNavigate();

  const book=()=>{
    return navigate("/traindetails");
  }

  return (
    <div className="train-card">
      <h3>{trainName}</h3>
      <p><strong>Departure Station:</strong> {departureStation}</p>
      <p><strong>Departure Time:</strong> {departureTime}</p>
      <p><strong>Arrival Station:</strong> {arrivalStation}</p>
      <p><strong>Arrival Time:</strong> {arrivalTime}</p>
      <p><strong>Available Tickets:</strong> {availableTickets}</p>
      <button type="submit" className="book" onClick={()=>book()}>Book Tickets</button>
      <button type="submit" className="cancel">Cancel Tickets</button>
    </div>
  );
};

const TrainCardList = ({ trains }) => {
  console.log(trains)
  return (
    trains? (
    <div className="train-card-list">
      {trains.map((train, index) => (
        <TrainCard
          key={index}
          departureStation={train.departurePlace}
          departureTime={train.departureTime}
          arrivalStation={train.arrivalPlace}
          arrivalTime={train.arrivalTime}
          trainName={train.name}
          availableTickets={train.noOfSeatsAvailable}
        />
      ))}
    </div>
    ):(
        <p>Loading...</p>
    )
  );
};

const Traindata =  (url) => {
  const [trains,setTrains] = useState([]);
  console.log(url);
  // Example data for trains
  useEffect(()=>{
      const fetchData = async ()=>{
        async function getDataWithBody(url) {
          try {
            const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            });

            if (!response.ok) {
            console.log("UNABLE TO FIND CONTENT")
            }
            return response.json();
          } catch (error) {
              console.log(error);
          }
        }
        var searchTrainUrl = url.url;
        const data =  await getDataWithBody(searchTrainUrl);
        setTrains(data);
      }
        fetchData();
  },[]);
 
  return (
    <div className="App">
      <h1 className='header'>Train Information</h1>
      <TrainCardList trains={trains} />
    </div>
  );
};

export default Traindata;
