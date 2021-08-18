import React, {useRef, useState, useEffect } from 'react';
import './Edit.css';
import { Form, Button } from 'react-bootstrap';

import { Tab, Nav, Col, Alert} from 'react-bootstrap';
import firebase from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../firebase';
import { useHistory } from "react-router-dom"

function Edit() {
    const newPassWord = useRef();
    const confNewPassword  = useRef();

    const newUserName = useRef();
    const newCaption = useRef();

    const {currentUserData, updatePassword} = useAuth();

    const [loading, setLoading] = useState(false)
    const [newUserData, setNewUserData] = useState(currentUserData?.userData);
    const [addPostImg, setAddPostImg] = useState();
    const [newStatus, setNewStatus] = useState();
    const [userNameState, setUserNameState] = useState(); 
    const [error, setError] = useState("")

    useEffect(()=>{
    
        async function fetchData(){
          setNewUserData(currentUserData.userData);
        } 
    
        fetchData(); 
        console.log("the data main in useeffect ", newUserData);
        
      },[currentUserData]);

    const handleSubmit = (e) =>{

        e.preventDefault();
        console.log("The userName ", newUserName.current.value);
        console.log("The caption  ", newCaption.current.value);
        setNewStatus(newCaption.current.value);
        setUserNameState( newUserName.current.value);
        console.log(`users/${currentUserData?.userData.userId}/profile/${addPostImg.name}`);
        const uploadTask = storage.ref(`users/${currentUserData?.userData.userId}/profile/${addPostImg.name}`).put(addPostImg);
    
    
        uploadTask.on(
            "state_changed",
            snapshot =>{},
            error => {
            console.log("error");
            },
            ()=>{
            storage
            .ref(`users/${currentUserData?.userData.userId}/profile`)
            .child(addPostImg.name)
            .getDownloadURL()
            .then(url => {
               
                // update the state
                let newUser = {...currentUserData?.userData};
                newUser.profileImg = url;
                newUser.status = newStatus;
                newUser.Name = userNameState;
                setNewUserData(newUser);
                
                //update the database 
                firebase.firestore().collection("users").doc(currentUserData.userDocId).update({
                    profileImg: url,
                    status: newStatus,
                    Name:userNameState,
                });
    
            })
            }
    
        )
        e.target.reset();
    }

    const handleChange = e => {
        if (e.target.files[0]) {
          setAddPostImg(e.target.files[0]);
          console.log("The Image files ", e.target.files[0]);
        }
    };

    const updateMyPassword = e =>{
        e.preventDefault();
        if (newPassWord.current.value !== confNewPassword.current.value) {
            return setError("Passwords do not match")
        }

        const promises = updatePassword(newPassWord.current.value);

        Promise.all(promises)
        .then(() => {
            console.log("password updated successfully")
        })
        .catch(() => {
          setError("Failed to update account")
        })
        .finally(() => {
          setLoading(false)
        })


        e.target.reset();

    }

    return (
        <div className="Edit">
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                    <Col className="Edit__side" sm={3}>
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item className="Edit__tab1">
                                <Nav.Link eventKey="first">Edit Profile</Nav.Link>
                            </Nav.Item>
                        
                            <Nav.Item className="Edit__tab1">
                                <Nav.Link eventKey="second">Change Password</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col className="Edit__Data" sm={9}>
                        <img className="profile__photo" src={newUserData?.profileImg} />
                        <p >{newUserData?.Name}</p>
                        <Tab.Content>
                            {error && <Alert variant="danger">{error}</Alert>}

                            <Tab.Pane eventKey="first">
                                <Form className="Edit__DataTab" onSubmit={handleSubmit}>
                                    <Form.Group id="photo" className="Edit__DataTabGroup" >
                                        <Form.Label className="text-center">update photo</Form.Label>
                                        <Form.Control onChange={handleChange} type="file"  required />
                                    </Form.Group>
                                    <Form.Group id="Name" className="Edit__DataTabGroup">
                                        <Form.Label className="text-center" >User Name</Form.Label>
                                        <Form.Control ref={newUserName} type="text" required />
                                    </Form.Group>
                                    <Form.Group id="Status" className="Edit__DataTabGroup">
                                        <Form.Label className="text-center">Status</Form.Label>
                                        <Form.Control ref={newCaption}  type="text"  required />
                                    </Form.Group>
                                    <Button  className="w-100" type="submit">
                                        Update Information
                                    </Button>
                                </Form>

                            </Tab.Pane>

                            <Tab.Pane eventKey="second" >
                                <Form className="Edit__DataTab" onSubmit={updateMyPassword}>
                                    <Form.Group id="Newpassword" className="Edit__DataTabGroup">
                                        <Form.Label className="text-center" >New Password</Form.Label>
                                        <Form.Control type="password" ref={newPassWord} required />
                                    </Form.Group>
                                    <Form.Group id="Confirmpassword-confirm" className="Edit__DataTabGroup">
                                        <Form.Label className="text-center">Confirm New Password</Form.Label>
                                        <Form.Control  type="password" ref={confNewPassword} required />
                                    </Form.Group>
                                    <Button  className="w-100" type="submit">
                                        Change Password
                                    </Button>
                                </Form>

                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
            </Tab.Container>
        </div>
    )
}

export default Edit
