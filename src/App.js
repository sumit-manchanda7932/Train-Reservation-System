import './App.css';
import NavBar from './components/Navbar';
import Home from './components/Home'
import Traindata from './components/Traindata';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import BackgroundSlideshow from './components/BackgroundSlideshow';
import TrainDetails from './components/TrainDetails';
import ProjectStarter from './components/ProjectStarter';



function App() {
  const url = "http://localhost:5000/railway/getAllTrains";
  return (
    <>
      <Router>
        <NavBar/>
        <BackgroundSlideshow/>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/traindata' element={<Traindata url = {url}/>} />
          <Route path='/traindetails' element={<TrainDetails/>} />
          <Route path='/projectStarter' element={<ProjectStarter/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
