import React from 'react';
import { useEffect, useState } from 'react';
import { startWorker } from '../webWorker.js'
import './ProjectStarter.css'
/* eslint-disable no-restricted-globals */

function ProjectStarter() {
  const NUM_THREADS = 20;
  const [threadInfo, setThreadInfo] = useState(Array.from({ length: NUM_THREADS }, () => []));
  const [threadMap, setThreadMap] = useState(Array.from({ length: NUM_THREADS }, () => new Map()));
  const [threadStatus, setThreadStatus] = useState(Array.from({ length: NUM_THREADS }, () => ["Alive"]));

  useEffect(() => {
    // Start the worker and pass any necessary props

    Array.from({ length: NUM_THREADS }, (_, index) => {
      startWorker({ id: index });
    });


    // Add event listener to handle messages from the worker
    const handleMessage = (event) => {
      const message = event.data;
      if (message.type === 'info') {
        setThreadInfo(prevInfo => {
          const newInfo = [...prevInfo];
          newInfo[message.id] = [...newInfo[message.id], message.message];
          return newInfo;
        });
      }
      else if (message.type == 'map') {
        setThreadMap(prevMap => {
          const newMap = [...prevMap];
          newMap[message.id] = message.message;
          return newMap;
        });
      } else if (message.type == 'health') {
        setThreadStatus(prevStatus => {
          const newStatus = [...prevStatus];
          newStatus[message.id] = "Dead";
          return newStatus;
        })
      }
    };

    // Add event listener
    self.addEventListener('message', handleMessage);

    // Clean up event listener on component unmount
    return () => {
      self.removeEventListener('message', handleMessage);
    };
  }, []); // Empty dependency array to run effect only once


  const threadIdArray = Array.from({ length: NUM_THREADS }, (_, index) => index);

  return <>
    <h1 className='heading'>
      THREAD INFO
    </h1>

    <div className='body'>
      {
        threadIdArray.map(threadIndex => (

          <div className='threadCard'>
            THREAD {threadIndex}:
            <div>
              Thread Status: {threadStatus[threadIndex]}
            </div>
            <ul >
              {
                threadInfo[threadIndex].map((info, index) => (
                  <li key={index}>{info}</li>
                ))
              }
            </ul>

            BOOKED TICKET LIST:
            <div >
              {
                Array.from(threadMap[threadIndex].entries()).map((entry) => {
                  const [key, value] = entry;
                  return <div key={key}>{key}: {value}</div>;
                })
              }
            </div>

          </div>
        ))
      }
    </div>
  </>;

}

export default ProjectStarter;