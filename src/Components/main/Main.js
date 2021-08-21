import React, { useEffect, useState, Suspense, useRef } from 'react'
import './Main.css';

import Posts from './Posts';
import firebase from '../../firebase';
import { storage } from '../../firebase';
import { useAuth } from "../../context/AuthContext";
import {Modal, Button, Form}from 'react-bootstrap';

function Main() {
  const {currentUserData } = useAuth();

  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [newUserData, setNewUserData] = useState(currentUserData?.userData);
  const [isOpen, setIsOpen] = useState(false);
  const [addPostImg, setAddPostImg] = useState(false);

  const captionRef = useRef()
  const imageRef = useRef()

  const postResp = firebase.firestore().collection("posts");
  const userResp = firebase.firestore().collection("users");
  const commentsResp = firebase.firestore().collection("comments");

  useEffect(()=>{
    
    async function fetchData(){
      setNewUserData(currentUserData.userData);
    } 

    fetchData(); 
    
  },[currentUserData]);

  const fetchPosts = ()=>{
    setLoading(true);
    postResp.onSnapshot((querySnapshot) =>{
      const items = [];
      querySnapshot.forEach((doc) => {
        //if(!currentUserData.userData?.hidden.includes(doc.data().postId))
          items.push(doc.data());
      });
      setPosts(items);
      setLoading(false)
    });
  }

  const fetchUsers = ()=>{
    userResp.onSnapshot((querySnapshot) =>{
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({userData: doc.data(), userDocId: doc.id});
      });
      setUsers(items);
    });

  }

  const fetchComments = ()=>{
    commentsResp.onSnapshot((querySnapshot) =>{
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });
      setComments(items);
    });
  }

  useEffect(()=>{
    fetchUsers();
    fetchPosts();
    fetchComments();
    // setNewUserData(currentUserData?.userData);
  },[])

  
    //this function handle when the user press the save button on the post.
    const handleSave = (post_id)=>{

      const newUserSavedPosts = currentUserData.userData.savedPosts;
      let newUser;

      if(newUserSavedPosts.includes(post_id)){
        // remove the liked post from the list 
        let dataIndex = newUserSavedPosts.indexOf(post_id);
        newUserSavedPosts.splice(dataIndex, 1);
      }else{
        //add the liked post_id to the list 
        newUserSavedPosts.push(post_id);
      }

      // update state
      newUser = {...currentUserData.userData}
      newUser.savedPosts = newUserSavedPosts;
      setNewUserData(newUser);

      //update database 
      firebase.firestore().collection("users").doc(currentUserData.userDocId).update({
        savedPosts: newUser.savedPosts,
      });

    }

    //this function handle when the user press the like button on the post.
    function handleLike( post_id ){

      const newUserLikedPosts = newUserData?.likedPosts;
      let newUser;
    
      if(newUserLikedPosts?.includes(post_id)){
        // remove the liked post from the list 
        let dataIndex = newUserLikedPosts.indexOf(post_id);
        newUserLikedPosts?.splice(dataIndex, 1);
      }else{
        //add the liked post_id to the list 
        newUserLikedPosts?.push(post_id);
      }

      // update the state
      newUser = {...currentUserData.userData};
      newUser.likedPosts = newUserLikedPosts;
      setNewUserData(newUser);
      
      firebase.firestore().collection("users").doc(currentUserData.userDocId).update({
        likedPosts: newUser.likedPosts,
      });

    }

    // Hide post 
    function handleHide(post_id){

      const newUserHiddenPosts = newUserData?.hidden;
      let newUser;

      //add the hidden post_id to the list 
      newUserHiddenPosts?.push(post_id);
    

      // update the state
      newUser = {...currentUserData.userData};
      newUser.hidden = newUserHiddenPosts;
      setNewUserData(newUser);
      
      firebase.firestore().collection("users").doc(currentUserData.userDocId).update({
        hidden: newUser.hidden,
      });

      let newPosts = posts;
      let found = posts.find( post => post.postId ===post_id );
      newPosts.splice(newPosts.indexOf(found), 1);

      setPosts(newPosts);

    }

    // Delete post 
    function handleDelete(post_id, img_url){
      
      const newUserLikedPosts = newUserData?.MyPosts;
      let newUser;
      let dataIndex = newUserLikedPosts.indexOf(post_id);
      newUserLikedPosts?.splice(dataIndex, 1);
      // update the state
      newUser = {...currentUserData.userData};
      newUser.likedPosts = newUserLikedPosts;
      setNewUserData(newUser);

      firebase.firestore().collection("users").doc(currentUserData.userDocId).update({
        MyPosts: newUser.MyPosts,
      });

      postResp.doc(post_id).delete().then(() => {
          console.log("Document successfully deleted!");
      }).catch((error) => {
          console.error("Error removing document: ", error);
      });
      //remove image from the storage
      let pictureRef = storage.refFromURL(img_url);
      pictureRef.delete()
      .then(() => {
        //3.
        console.log("Picture is deleted successfully!");
      })
      .catch((err) => {
        console.log(err);
      });

    }

    const likeComment = (commentId)=>{

      const newLikedComments = newUserData?.likedComments;
      let newUser;

      if(newLikedComments?.includes(commentId)){
        // remove the liked post from the list 
        let dataIndex = newLikedComments.indexOf(commentId);
        newLikedComments?.splice(dataIndex, 1);
      }else{
        //add the liked post_id to the list 
        newLikedComments?.push(commentId);
      }

      newUser = {...currentUserData.userData};
      newUser.likedComments = newLikedComments;
      setNewUserData(newUser);

      firebase.firestore().collection("users").doc(currentUserData.userDocId).update({
        likedComments: newUser.likedComments,
      });

    }

    const onFormSubmit = (e) => {
      e.preventDefault();
      const uploadTask = storage.ref(`users/${newUserData?.userId}/posts/${addPostImg.name}`).put(addPostImg);

      let newId = '';
      if(newUserData?.MyPosts.length > 0){
        const oldID = newUserData?.MyPosts[newUserData?.MyPosts.length - 1];
        const words = oldID?.split('_');
        newId = words[0] + "_" + (Number(words[1]) + 1);
      }else{
        newId = newUserData?.userId + "_" + "1"
      }

      uploadTask.on(
        "state_changed",
        snapshot =>{},
        error => {
          console.log("error", error);
        },
        ()=>{
          storage
          .ref(`users/${newUserData?.userId}/posts`)
          .child(addPostImg.name)
          .getDownloadURL()
          .then(url => {
              //update database 
              const newPost = {
                img: url,
                postId: newId,
                postedBy: currentUserData.userData.userId,
                text: captionRef.current.value,
                commentList:[],
                PostTime:firebase.firestore.FieldValue.serverTimestamp()
              };
              postResp.doc(newId).set(newPost);

              const newUserPosts = newUserData?.MyPosts;
              let newUser;
              newUserPosts?.push(newId);
              
              // update the state
              newUser = {...currentUserData.userData};
              newUser.MyPosts = newUserPosts;
              setNewUserData(newUser);
              
              firebase.firestore().collection("users").doc(currentUserData.userDocId).update({
                MyPosts: newUser.MyPosts,
              });

              setIsOpen(false);
          })
        }

      )

    }

  const handleChange = e => {
    if (e.target.files[0]) {
      setAddPostImg(e.target.files[0]);
    }
  };

  const handleAddComment = (newComment, postInfo) =>{

    //updating database 
    commentsResp.doc(newComment.commentId).set(newComment);
    //updating state
    const newCommentsArray = comments;
    newCommentsArray.push(newComment);
    setComments(newCommentsArray);

    const PostIndex = posts.indexOf(postInfo);
    const newCommentList = posts[PostIndex]?.commentList;
    let newPost;
    newCommentList?.push(newComment.commentId);
    

      // update the state
      newPost = {...posts.userData};
      newPost.commentList = newCommentList;
      //setComments(newPost);
      
      firebase.firestore().collection("posts").doc(newComment.postId).update({
        commentList: newPost.commentList,
      });

  }

  return (
    <div>
      <div className="Main">
          {
            posts.map(post =>  <Posts key={post.postId} liked={newUserData?.likedPosts.includes(post.postId)} saved={newUserData?.savedPosts.includes(post.postId)} 
              allUsers={users} postInfo={post} usersInfo={users?.filter(user => user.userData.userId === post.postedBy)} currentUserId = {newUserData?.userId}
              comments={comments.filter(comment => comment.postId === post.postId)} funcHandle={handleSave} likeHandle={handleLike} likeComment={likeComment}
              deletePost={handleDelete} hidePost={handleHide}  addComment = {handleAddComment}

              />
            
            )
          }  

          <Button onClick={() => setIsOpen(true)} variant="dark" className="Main__addPost"><i class="fa fa-plus"></i></Button>

          <Modal size='xl' onHide={() => setIsOpen(false)} show={isOpen}>
            <Modal.Header closeButton>
              <Modal.Title>Add New Post</Modal.Title>
            </Modal.Header>
              <Modal.Body>

                <Form onSubmit={onFormSubmit} >
                  <Form.Group controlId="formFileSm" className="mb-3">
                    <Form.Label></Form.Label>
                    <Form.Control onChange={handleChange} ref={imageRef} type="file" size="sm" />
                    {/* <img width={50} src={URL.createObjectURL(addPostImg)} /> */}
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicEmail">
                  
                    <Form.Label>Your Caption</Form.Label>
                    <Form.Control ref={captionRef} as="textarea" placeholder="Your Caption" />

                  </Form.Group>

                  <Button variant="primary" type="submit">
                      upload
                   </Button>

                </Form>

              </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => setIsOpen(false)} variant="dark">Close</Button>
            </Modal.Footer>
          </Modal>

      </div> 
 
      </div> 
  )
}

export default Main

