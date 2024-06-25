//DONT REMOVE THE BELOW COMMENT IT IS USED TO REMOVE ES LINT ERROR
/* eslint-disable no-restricted-globals */

function startWorker(params) {
    
    const threadKillTime = 300000;
    const threadSleepTime = 12000;
    const threadId = params.id;
    let listOfBookedTrains = new Map();
    let listOfTrainId = [];
    console.log("START WORKER");
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
    
    //for patch request to book ticket/cancel ticket
    async function patchData(url) {
        try {
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                console.log("UNABLE TO  PERFORM OPERATION")
            }
    
            return response.json();
        } catch (error) {
            console.log(error);
        }
    
    }
    
    
    /*-----------------SEARCH AND BOOK  TICKET --------------*/
    async function bookTicket() {
    
        try {
            const places = ["Delhi" , "Mumbai","Bangalore", "Kolkata", "Dhanbad"];
            var searchTicketApiEndPoint = "http://localhost:5000/railway/getTrains";
            var bookTicketApiEndPoint = "http://localhost:5000/railway/book";
    
            const indexDeparture = Math.floor(Math.random() * places.length);
            let indexDestination = Math.floor(Math.random() * places.length);
    
            //edge case
            if (indexDeparture == indexDestination)
                indexDestination = (indexDestination + 1) % places.length;
    
            var src = places[indexDeparture];
            var dest = places[indexDestination];
    
            //perform get request for train with above api endpoint and src and destination
            const searchUrl = searchTicketApiEndPoint + `/${src}` + `/${dest}`;
            const searchResponse = await getDataWithBody(searchUrl);
    
            if (searchResponse[0] == undefined){
                const info = `Train from ${src} to ${dest} NOT FOUND!`
                self.postMessage({ type: 'info', message: info , id:threadId});
                return;
            }
            const trainId = searchResponse[0]._id;
            const noOfSeatsAvailableInTrain = 5;
            const noOfSeatsToBook = Math.floor(Math.random() * noOfSeatsAvailableInTrain) + 1;
    
            //post request to book tickets for that train
            const urlBook = bookTicketApiEndPoint + `/${trainId}` + `/${noOfSeatsToBook}`;
    
            patchData(urlBook).then(
                bookResponse => {
                    const info = `${noOfSeatsToBook} Ticket from ${src} to ${dest} Booked Successfully by Thread ${threadId}`;
                    console.log(`${noOfSeatsToBook} Ticket from ${src} to ${dest} Booked Successfully by Thread\n`);
                    const trainInfo = {
                        trainId: trainId,
                        noOfTicketsBooked: noOfSeatsToBook
                    }
    
                    let val = (listOfBookedTrains.has(trainId)) ? listOfBookedTrains.get(trainId) : 0;
                    listOfBookedTrains.set(trainId, val + noOfSeatsToBook)
                    if (!listOfTrainId.includes(trainId))
                        listOfTrainId.push(trainId);
    
                    self.postMessage({ type: 'map', message: listOfBookedTrains, id:threadId });
                    self.postMessage({ type: 'info', message: info , id:threadId});
                    console.log(listOfBookedTrains);
                }
            ).catch(
                err => {
                    console.log("Ticket Booked Successfully\n");
                    console.log(err);
                }
            );
    
        } catch (error) {
            console.log(error);
        }
    }
    /*----------------------------------------------- */
    
    /*-----------------CANCEL TICKET --------------*/
    async function cancelTicket() {

        var searchTicketApiEndPoint = "http://localhost:5000/railway/getTrains";
        var cancelTicketApiEndPoint = "http://localhost:5000/railway/cancel";
        //if booked a train then only it can cancel it
        try {

            if (listOfTrainId.length == 0) {
                const info = `CAN't CANCEL TICKET`;
                console.log("CAN't CANCEL TICKET\n");
                self.postMessage({ type: 'info', message: info, id:threadId });
                return;
            }
    
            const cancelIndex = Math.floor(Math.random() * listOfTrainId.length);
            const trainId = listOfTrainId[cancelIndex];
            const noOfSeatsToCancel = Math.floor(Math.random() * listOfBookedTrains.get(trainId)) + 1;
            const newSeats = listOfBookedTrains.get(trainId) - noOfSeatsToCancel;
            if (newSeats < 0) {
                const info = `CAN't CANCEL TICKET`;
                console.log("CAN't CANCEL TICKET\n");
                self.postMessage({ type: 'info', message: info, id:threadId });
                return;
            }
    
            const urlCancel = cancelTicketApiEndPoint + `/${trainId}` + `/${noOfSeatsToCancel}`;
            const searchUrl = searchTicketApiEndPoint + `/${trainId}`;
            const searchResponse = await getDataWithBody(searchUrl);

            const cancelResponse = patchData(urlCancel).then(
                cancelResponse => {
                    const info = `${noOfSeatsToCancel} Ticket of ${searchResponse[0].name} Cancelled Successfully by Thread ${threadId}`;
                    console.log(`${noOfSeatsToCancel} Ticket of ${trainId} Cancelled Successfully by Thread \n`);
                    listOfBookedTrains.set(trainId, newSeats);
                    self.postMessage({ type: 'map', message: listOfBookedTrains , id:threadId });
                    self.postMessage({ type: 'info', message: info , id:threadId });
                    console.log(listOfBookedTrains);
                }
            ).catch(
                err => {
                    console.log("Ticket Cancellation Failed\n");
                    console.log(err);
                }
            );
    
        } catch (error) {
            console.log(error);
        }
    }
    /*-------------------------------------------------------- */
    
    
    async function executeWorkerFunction() {
        const action = Math.random();
        if (action > 0.2) {
            await bookTicket();
        }
        else {
            await cancelTicket();
        }
    }
    
    self.addEventListener('message', async (event) => {
       await  executeWorkerFunction();

        const intervalId =  setInterval(executeWorkerFunction, threadSleepTime);
    
        setTimeout(() => {
           
            console.log(`Worker ${threadId} terminating...`);
            clearInterval(intervalId); // Clear the interval to stop further executions
             self.postMessage({ type: 'health', message: 'Thread is terminating' , id:threadId });
            self.close(); // Terminate the worker
        }, threadKillTime);
        
        
    },{ once:true});
}


export {startWorker};
