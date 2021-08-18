import React,{useState, useEffect} from 'react'
import "./Inbox.css";
import {
    Link,
  } from "react-router-dom";

function Chats({updatePath, messageData, myUserId}) {

    const [sideData, setSideData] = useState([]);
    
    useEffect(()=>{
        
        if(messageData.user1[0] === myUserId ){
            setSideData(messageData.user2);
        }else{
            setSideData(messageData.user1);
        }

        return;
    },[]);
    console.log("the chat data reference ", sideData);

    return (
        <Link to={`/inbox/${updatePath}`}>
            <div className="inbox__chatHeader">
                    <img className="inbox__chatPhoto" src={sideData[1]} />
                    <p><a>{sideData[2]}</a></p>
            </div>
        </Link>

    )
}

export default Chats
