import React, {useState, useEffect} from 'react'
import './Profile.css';
import { useAuth } from "../../context/AuthContext"
import {useHistory} from 'react-router-dom';
import {Tabs, Button,Tab,CardGroup,Card, Row, Col, Modal} from 'react-bootstrap';
import firebase from '../../firebase';
import FullPost from '../main/FullPost';
import {
    useParams,
  } from "react-router-dom";

function Profile() {
    const {currentUser,  currentUserData} = useAuth();

    const postResp = firebase.firestore().collection("posts");
   //those to select the correct tab between POSTS or SAVED
    const pathname = window.location.pathname.split('/')[2];
    const ID = pathname ? (pathname.toUpperCase() === "SAVED" ? "SAVED" : "POSTS") : "POSTS";

    const userResp = firebase.firestore().collection("users");

    const [lgShow, setLgShow] = useState(false);

    const [MyPosts, setMyPosts] = useState([]);
    const [savedPosts, setSavedPosts] = useState([]);
    const [wnatedId, setWantedID] = useState();
    const [wnatedUser, setWnatedUser] = useState();
    const [wnatedUserPost, setWnatedUserPost] = useState([]);

    useEffect(()=>{
        const pathname = window.location.pathname.split('/')[2];
        const wantedUser =  pathname !== undefined ? pathname : pathname;
        if(wantedUser){
            if(wantedUser.toUpperCase() !== "SAVED"){
                setWantedID(wantedUser);
            }
        }
    },[]);

    async function getWantedUser(){
        if(wnatedId){
            const snapshot = await userResp.where('userId', '==', wnatedId).get();
            if (snapshot.empty) {
                console.log('No matching documents.');
                return;
            }  

            snapshot.forEach(doc => {
                setWnatedUser(doc.data());
            });
        }
    }

    async function getWantedUserPosts(){
        if(wnatedId){
            const snapshot = await postResp.where('postedBy', '==', wnatedId).get();
            if (snapshot.empty) {
                console.log('No matching documents.');
                return;
            }  

            const items = [];
            snapshot.forEach(doc => {
                items.push(doc.data());
            });
            setWnatedUserPost(items);

        }
    }


    useEffect(()=>{
        getWantedUser();
        getWantedUserPosts();
    },[wnatedId]);

    useEffect(()=>{
        fetchSavedPosts();
    
        return ;
    },[currentUserData])

    useEffect(()=>{
        fetchSavedPosts();
    
        return ;
    },[currentUserData])
    
    async function fetchMyPosts(){ 
        //to make sure that we got the user
        if(currentUser){
            const snapshot = await postResp.where('postedBy', '==', currentUser.uid).get();
            if (snapshot.empty) {
                console.log('No matching documents.');
                return;
            }  

            const items = [];
            snapshot.forEach(doc => {
                items.push(doc.data());
            });
            setMyPosts(items);
        }
    }

    async function fetchSavedPosts(){
        
        postResp.onSnapshot((querySnapshot) =>{
            const data = [];
            querySnapshot.forEach((doc) => {
                if(currentUserData.userData?.savedPosts.includes(doc.data().postId)){
                    data.push({data:doc.data()});
                }
            });
            setSavedPosts(data);
          });
        
    }

    useEffect(() => {

        fetchMyPosts();
        return; 
    },[])
    
    const history = useHistory();
    const [error, setError] = useState("");

    const handlePath = ()=>{
        history.push("/profile");
    }

    const createNewMessage = ()=>{
        const roomId = currentUserData.userData?.userId + wnatedUser?.userId + "CHAT";
        if( !currentUserData.userData?.chats.includes(roomId)){
            const chats = currentUserData.userData?.chats;
            const otherchats = wnatedUser?.chats;
            chats.push(roomId);
            otherchats.push(roomId);
            firebase.firestore().collection("users").doc(currentUserData.userDocId).update({
                chats: chats,
            });
            firebase.firestore().collection("users").doc(wnatedUser?.userId).update({
                chats: otherchats,
            });
            firebase.firestore().collection("chats").doc(roomId).set({
                roomId: roomId ,
                user1: [currentUserData.userData?.userId, currentUserData.userData?.profileImg,  currentUserData.userData?.Name],
                user2: [wnatedUser?.userId, wnatedUser?.profileImg,  wnatedUser?.Name],
            })

        }
        history.push("/inbox");
    }

    return (
        <div className="profile">
            <div className = "profile__info">   
                <img className="profile__photo" src={wnatedUser ? wnatedUser?.profileImg : currentUserData.userData?.profileImg} />

                <div className="profile__userinfo">
                    <p>{wnatedUser ? wnatedUser?.Name : currentUserData.userData?.Name}
                        { wnatedUser? 
                        <Button onClick={createNewMessage} variant="link"  className="profile__inbox">Send a Message</Button>:
                        <a href="/edit"  id="Edit">Edit profile</a>
                
                        }
                    </p> 
                    <div className="d-flex mt-3">
                        <p> <a>{wnatedUser ? wnatedUser?.MyPosts.length : currentUserData.userData?.MyPosts.length}</a> Posts </p>
                        <p> <a>0</a> friends</p>
                    </div>
                    <p className="mt-3"> {wnatedUser ? wnatedUser?.status : currentUserData.userData?.status} </p>

                </div>
            </div>

            <Tabs
                defaultActiveKey={ID}
                id="noanim-tab-example"
                className="mb-3"
                >
                    <Tab onClick={()=>handlePath()} eventKey="POSTS" title="POSTS">

                       { wnatedUser ? 
                            <Row xs={1} md={3} className="g-4">
                                {wnatedUserPost?.map(myPost =>
                                    <Col key={myPost.postId + "ColSaved"}>
                                        <Card onClick={()=>setLgShow(true)} key={myPost.postId.toUpperCase}>
                                            <Card.Img variant="top" src={myPost.img} />
                                        </Card>
                                    </Col>
                                )}
                                
                            </Row> :
                            <Row xs={1} md={3} className="g-4">
                                {MyPosts?.map(myPost =>
                                    <Col key={myPost.postId + "ColSaved"}>
                                        <Card onClick={()=>setLgShow(true)} key={myPost.postId.toUpperCase}>
                                            <Card.Img variant="top" src={myPost.img} />
                                        </Card>
                                    </Col>
                                )}
                                
                            </Row> 
                        }
                    </Tab>
                    {   wnatedUser ? <></> :            
                        <Tab eventKey="SAVED" title="SAVED">
                            <Row xs={1} md={3} className="g-4">
                                {savedPosts?.map(savedPost =>
                                    <Col key={savedPost.data.postId + "ColSaved"}>
                                        <Card key={savedPost.data.postId.toUpperCase}>
                                            <Card.Img variant="top" src={savedPost.data.img} />
                                        </Card>
                                    </Col>
                                )}
                                
                            </Row> 
                        </Tab>
                    }
                    
                </Tabs>

        </div>
    )
}

export default Profile
