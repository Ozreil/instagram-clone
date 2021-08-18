import React, {useEffect, useState, useRef} from 'react';

import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import {Form} from 'react-bootstrap';
import firebase from '../../firebase';
import { useAuth } from "../../context/AuthContext";
import {
    useParams,
  } from "react-router-dom";
import {  MDBIcon } from "mdbreact";

function Messages({messageId, userPhoto}) {

    const {currentUserData } = useAuth();

    const [messages, setMessages] = useState([]);
    const [photo, setPhoto ] = useState({});
    const [roomName, setRoomName] = useState();
    const {roomId} = useParams();

    const myMess = useRef();
    

    async function fetchMessages(){
        if(roomId){

            const userChatsDataBaseData = firebase.firestore().collection("chats").doc(roomId).collection("messages");
        
            userChatsDataBaseData.orderBy("time","asc").onSnapshot((querySnapshot) =>{
                const items = [];

                querySnapshot.forEach((doc) => {
                    items.push(doc.data());
                });
                setMessages(items);
            });
        }
    }

    function getTheImage(){
        if(roomId){
            console.log("befooore  what ", userPhoto);
            const currentChat =  userPhoto?.find(element => element.messageId == roomId);
            console.log("noooooooow what ", currentChat);
            if(currentChat?.chatData.user1[0] === currentUserData.userData?.userId){
                setPhoto(currentChat?.chatData.user2[1]);
                setRoomName(currentChat?.chatData.user2[2]);
            }else{
                setPhoto(currentChat?.chatData.user1[1]);
                setRoomName(currentChat?.chatData.user1[2]);

            }

            console.log("the current photo is ", photo);
        }

    }

    useEffect(() => {
        console.log("In messssssage ",userPhoto );
        fetchMessages();
        getTheImage();
        return ;
    }, [roomId]);


    const sendMessage = (e) => {
        e.preventDefault();
        
        firebase.firestore().collection("chats").doc(roomId).collection("messages").doc().set({
            sentBy: currentUserData.userData?.userId ,
            text: myMess.current.value,
            time: firebase.firestore.FieldValue.serverTimestamp(),
        })

        myMess.current.value = ""
    }

    return (
        <div className="inbox__chat">

            <div className="inbox__chatHeader">
                <img className="inbox__chatPhoto" src={photo} />
                {/* <img className={message.sentBy === currentUserData.userData?.userId ? "inbox__noChatPhoto" : "inbox__chatPhoto" } src={photo?.chatData?.user2[1]} /> */}
                <p><a>{roomName}</a><span>last seen</span></p>
                <MDBIcon className="inbox__chatHeaderInfo" icon="info-circle" />
            </div>

            <div className="chat__body">
                {
                    messages.map(message => {
                        return <div className={message.sentBy === currentUserData.userData?.userId ? "inbox__chatBody__mine": "inbox__chatBody__his"} >
                                    <img className={message.sentBy === currentUserData.userData?.userId ? "inbox__noChatPhoto" : "inbox__chatPhoto" } src={photo} />
                                    <p className="inbox__chats"> 
                                        {message.text} 
                                    </p>
                                </div>
                        } )
                }
            </div>

            <Form onSubmit={sendMessage} className="mb-3">
                <Form.Group>
                    <Form.Control
                    placeholder="Enter Your message ... "
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"      
                    ref={myMess}              
                    />
                </Form.Group>
                <Button type="submit" variant="dark">Send</Button>
            </Form>

        </div>
    )
}

export default Messages
