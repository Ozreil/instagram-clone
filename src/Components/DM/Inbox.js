import React, {useEffect, useState} from 'react'
import './Inbox.css';


import {  MDBIcon } from "mdbreact";
import firebase from '../../firebase';
import { useAuth } from "../../context/AuthContext";
import Chats from "./Chats";
import Messages from './Messages';
import {
    BrowserRouter as Router,
    Switch,
    Route,
  } from "react-router-dom";

function Inbox() {

    const {currentUserData} = useAuth();
    const userChatsDataBase = firebase.firestore().collection("chats");

    const [userChats, setUserChats] = useState([]);
    const [chatPath, setChatPath] = useState();
    const [newUserData, setNewUserData] = useState(currentUserData.userData);

    useEffect(()=>{
    
        async function fetchData(){
          const what = await currentUserData != undefined;
          setNewUserData(currentUserData.userData);
          
        } 
    
        fetchData(); 
        console.log("the data index in useeffect ", newUserData);
        return;
        
    },[]);

    useEffect(()=>{
        //those to select the correct tab between POSTS or SAVED
        const pathname = window.location.pathname.split('/')[2];
        const ID =  pathname ? pathname : "";
        console.log("the path >> ", ID)
        setChatPath(ID);
    },[]);

    async function getUserChats(){ 
        
        //to make sure that we got the user
        if(currentUserData.userData){
            console.log("the new user data in inbox >>>>>>> ", newUserData);
            await userChatsDataBase.onSnapshot((querySnapshot) =>{
                const items = [];
                querySnapshot.forEach((doc) => {
                    if(currentUserData.userData.chats.includes(doc.data().roomId)){
                        items.push({chatData: doc.data(), messageId: doc.id});
                        console.log("the chat data inbox ", doc.data());
                    }
                });
                setUserChats(items);
                console.log("the userChats >>>>> ", userChats);

            });

        }
    }

    useEffect(() => {
        getUserChats();
        return;
    }, [currentUserData]);

    return (
        <div className="inbox">
            <Router>
                    <div className="inbox__Sidebar">
                        <div className="inbox__SidebarHeader">
                            <p><a>{currentUserData.userData?.Name} </a></p>
                            <MDBIcon className="inbox__chatHeaderInfo" far icon="edit" />
                        </div>
                        <div className="inbox__SidebarRooms ">
                            {
                                userChats.map(chat => <Chats key={chat.messageId} updatePath={chat.messageId} messageData={chat.chatData} myUserId={currentUserData.userData?.userId} />)
                            }
                        </div>
                    </div>
                <Switch>
                    <Route path="/inbox/:roomId">
                        <Messages messageId={chatPath} userPhoto={userChats}/>
                    </Route>
                </Switch>
            </Router>
        </div>
    )
}

export default Inbox

