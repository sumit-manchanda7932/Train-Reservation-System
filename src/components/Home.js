import { useNavigate } from 'react-router-dom';
import './Home.css';
import Search from './SearchSystem';
import { useRef, useState } from 'react';

const places = ["Delhi" , "Mumbai","Bangalore", "Kolkata", "Dhanbad"];

function Home(){
    const [text1,setText1]=useState('');    
    const [text2,setText2]=useState('');  
    const [dropDownNumber ,setDropDownNumber] = useState(true);  
    const inputRef1=useRef(null);
    const inputRef2=useRef(null);
    const navigate = useNavigate();

    function handleChange1(event){
        setTimeout(()=>{
            inputRef1.current.focus();
        },1);
        setText1(event.target.value);
        setDropDownNumber(true);
    }

    function handleChange2(event){
        setTimeout(()=>{
            inputRef2.current.focus();
        },1);
        setText2(event.target.value);
        setDropDownNumber(false);
    }

    function submit() {
        if(text1!="" && text2!="" && text1!=text2 && places.includes(text1) && places.includes(text2))
            submitInfo();
        else
           return showErrorDialog();
    }

    function submitInfo(){
        return  navigate("/traindata",{state:{url:{url:`http://localhost:5000/railway/getTrains/${text1}/${text2}`}}});
    }

    function showErrorDialog(){
         alert("Enter valid Source and Destination Station!");
    }

    const Card=()=>{
        return (
            <div>
            <div className="floating-form">
            <h2 className="form-header">Enter Train details</h2>
            <form className="form-container">

              <input  ref= {inputRef1} type="text" placeholder="Enter departing station" value={text1} onChange={handleChange1} className="search-input1" />
             
             <div>
              {dropDownNumber && <Search token={text1} changeState = {setText1}/>}
             </div>
          
              <input  ref = {inputRef2} type="text" placeholder="Enter destination station" value={text2} onChange={handleChange2} className="search-input2" />
              
              <div>
              {!dropDownNumber && <Search token={text2} changeState = {setText2}/>  }  
              </div>

              <button  className="search-button" onClick={()=>submit()}>Search</button>

            </form>
          </div>
       
        </div>
          
          );
    }
    return(
        <Card/>
    );

}


export default Home