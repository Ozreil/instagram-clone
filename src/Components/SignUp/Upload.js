import React, {useRef, useState} from 'react'
import './Upload.css'

import { useHistory } from "react-router-dom"
import { Form, Button, Card } from 'react-bootstrap';
import firebase from '../../firebase';
import { storage } from '../../firebase';
import { useAuth } from "../../context/AuthContext";


function Upload() {

    const userName = useRef();
    const caption = useRef();
    const history = useHistory()
    const [addPostImg, setAddPostImg] = useState();
    const [newStatus, setNewStatus] = useState();
    const [userNameState, setUserNameState] = useState(); 

    const {currentUser } = useAuth();

    const handleUpload = (e) => {

        e.preventDefault();

        setNewStatus(caption.current.value);
        setUserNameState( userName.current.value);
        const name = userName.current.value;
        const capt = caption.current.value;
        const userId = currentUser.uid;
        const uploadTask = storage.ref(`users/${userId}/profile/${addPostImg.name}`).put(addPostImg);
    
    
        uploadTask.on(
            "state_changed",
            snapshot =>{},
            error => {
            console.log("error ", error);
            },
            ()=>{
            storage
            .ref(`users/${userId}/profile`)
            .child(addPostImg.name)
            .getDownloadURL()
            .then(url => {
               
                // update the state
                let newUser = {
                    MyPosts:[],
                    Name: name,
                    chats:[],
                    friends_list:[],
                    hidden:[],
                    likedComments:[],
                    likedPosts:[],
                    profileImg:url,
                    savedPosts:[],
                    status: capt,
                    userId:userId,
                };
                
                //update the database 
                firebase.firestore().collection("users").doc(userId).set(newUser)
                .then(() => {
                    console.log("Document successfully written!");
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });

            })
            }
    
        )
        e.target.reset();

        history.push("/");
    }
    
    const handleChange = (e) =>{
        if (e.target.files[0]) {
            setAddPostImg(e.target.files[0]);
        }
    }

    return (
        <div className="upload">
        <Card>
        <Card.Body>

            <Form className="Edit__DataTab" onSubmit={handleUpload}>
                <Form.Group id="photo" className="Edit__DataTabGroup" >
                    <Form.Label className="text-center">update photo</Form.Label>
                    <Form.Control onChange={handleChange} type="file"  required />
                </Form.Group>
                <Form.Group id="Name" className="Edit__DataTabGroup">
                    <Form.Label className="text-center" >User Name</Form.Label>
                    <Form.Control ref={userName} type="text" required />
                </Form.Group>
                <Form.Group id="Status" className="Edit__DataTabGroup">
                    <Form.Label className="text-center">Status</Form.Label>
                    <Form.Control ref={caption}  type="text"  required />
                </Form.Group>
                <Button  className="w-100" type="submit">
                    Update Information
                </Button>
            </Form>
            </Card.Body>
            </Card>
        </div>
    )
}

export default Upload
