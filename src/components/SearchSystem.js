import React, { useState , useEffect } from "react";
import "./SearchSystem.css"
import Home from  "./Home.js"
const places = ["Delhi" , "Mumbai","Bangalore", "Kolkata", "Dhanbad"];

places.sort();

function Search(prop){

    const [visibilityDropdown, setVisibilityDropdown]  = useState(true);

    useEffect(() => {
        const handleClickOutside = () => {
            setVisibilityDropdown(false);
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [setVisibilityDropdown]);

    function handleOnClick(name){
            prop.changeState(name);
    }

    return (
        <>
        {
            visibilityDropdown &&  <div className="Search">
                {
                    places.filter(item=>{
                        const searchItem = prop.token.toLowerCase();
                        const itemList=item.toLowerCase()
                        return searchItem && itemList.startsWith(searchItem)
                    }).map((name,index)=>(
                        <ul className="Name" onClick={()=>handleOnClick(name)} >
                            {name}
                        </ul>
                    ))
                }
                 </div>
        }
        </>
    )
}

export default Search
