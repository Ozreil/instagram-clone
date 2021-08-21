import React, { useEffect, useRef, useState } from 'react';
import './Posts.css';

import Comment from './Comment';
import Card from 'react-bootstrap/Card';
import {  MDBIcon } from "mdbreact";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import FullPost from './FullPost';
import { Modal, Dropdown } from 'react-bootstrap';
import { useAuth } from "../../context/AuthContext";
import firebase from '../../firebase';

function Posts(props) {
    const [lgShow, setLgShow] = useState(false);
    const {currentUserData } = useAuth();

    const [postTime,setPostTime] = useState()
    useEffect(()=>{

        // Create a new JavaScript Date object based on the timestamp
        // multiplied by 1000 so that the argument is in milliseconds, not seconds.
        var date = new Date(props.postInfo?.PostTime * 1000);
        // Hours part from the timestamp
        var hours = date.getHours();
        // Minutes part from the timestamp
        var minutes = "0" + date.getMinutes();
        // Seconds part from the timestamp
        var seconds = "0" + date.getSeconds();

        // Will display time in 10:30:23 format
        var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        setPostTime(formattedTime);
    },[]);

    const commentRef = useRef();

    

    const likePress = ()=>{
        props.likeHandle(props.postInfo.postId);
    }

    const handleBookmark = () =>{
        props.funcHandle(props.postInfo.postId);
    }

    const deleteClicked = () => {
        props.deletePost(props.postInfo?.postId, props.postInfo?.img);
    }   
    
    const hideClicked = () => {
        props.hidePost(props.postInfo?.postId);
    }

    const handleAddComment = (e) =>{
        e.preventDefault();
               
        let num = 1;
        if(props.postInfo?.commentList.length > 0)  {
            let latestComment = props.postInfo?.commentList.slice(-1);
            let words =  latestComment[0].split("_")
            num += Number(words[3]) ;
        }
        const commentData ={
            commentId: props.currentUserId + "_" + props.postInfo?.postId + "_" +  num ,
            commentValue:commentRef.current.value,
            commentedBy: props.currentUserId,
            postId: props.postInfo?.postId,
            time: firebase.firestore.FieldValue.serverTimestamp(),
        }

        e.target.reset();

        props.addComment(commentData, props.postInfo);
    }
    return (
        <div className='posts'>
            <Card style={{ width: '35rem' }}>
        
                <Card.Header>
                    <img className="posts__userImg" src={props.usersInfo[0]?.userData?.profileImg} />
                    <p  className="Posts__userName"><a href={`/profile/${props.usersInfo[0].userData?.userId}`}>{ props.usersInfo[0].userData?.Name }</a></p>
                    
                    <Dropdown>
                        <Dropdown.Toggle variant="lin" id="dropdown-basic">
                            <i id="dropdown-basic" className="fa fa-ellipsis-v" aria-hidden="true"></i>
                        </Dropdown.Toggle>    
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={ props.currentUserId === props.usersInfo[0].userData?.userId ? deleteClicked : hideClicked} > { props.currentUserId === props.usersInfo[0].userData?.userId ?"Delete" : "Hide"}</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                </Card.Header>
                <Card.Img variant="top" src={props.postInfo?.img} />
                
                <Card.Body>
                    <div className='posts__icons'>
                        <div>
                            <svg onClick={()=>likePress()}
                                className={props?.liked ? "posts_iconsLiked posts__actionIcons":"posts_iconsNotLiked posts__actionIcons"} 
                                xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path d="M12 4.435c-1.989-5.399-12-4.597-12 3.568 0 4.068 3.06 9.481 12 14.997 8.94-5.516 12-10.929 12-14.997 0-8.118-10-8.999-12-3.568z"/></svg>

                            <MDBIcon className='posts__actionIcons posts__align__icons' far icon="comment" size="lg" />
                            <MDBIcon className='posts__actionIcons posts__align__icons' far icon="paper-plane" size="lg"  alt='save svg'/>
                        </div>
                            {
                                props?.saved ? <MDBIcon icon="bookmark" onClick={() =>handleBookmark()} />: <MDBIcon far icon="bookmark" onClick={() => handleBookmark()} />
                            }
                        </div>

                    <Card.Text >
                        <p className="Posts__userComment">
                            <a className="Posts_userlink Posts__userName"> {props.usersInfo[0].userData.Name} </a>: {props.postInfo.text}
                        </p>

                        <a onClick={() => setLgShow(true)} className={(props.comments.length > 3 ) ? "showmemore" : "dontshow"}>
                         View all {props.comments.length} comments
                        </a>
                        
                        <Modal size='xl' show={lgShow} onHide={() => setLgShow(false)} id="fullpost" >
                            <FullPost key={ props.postInfo.postId +"_FULLPOST"}  allUsers={props.allUsers} 
                                comments={props?.comments} lgshow={lgShow}  
                                postData={props.postInfo} user={props.usersInfo[0].userData} 
                                fullPostAddComment={props.addComment} currentUserId={props.currentUserId}
                                postInfo={props.postInfo} me={currentUserData?.userData }  likeComment={props.likeComment} 
                                />
                        </Modal>  

                        {
                            props.comments.map( comment =><Comment 
                            key={comment.commentId} liked={currentUserData.userData?.likedComments.includes(comment.commentId)}  fullcomment={false} commentInfo = {comment} lkcom={props.likeComment}  commentUser={props.allUsers.filter(user=>user.userData.userId === comment.commentedBy)}/> )
                        }
                        
                    </Card.Text>
                    <p className="posts__time">
                        { postTime }
                    </p>
                </Card.Body>

                <Card.Footer className="text-muted">
                    <Form onSubmit={handleAddComment}>
                        <MDBIcon far icon="grin-alt" />
                            <FormControl
                            type="text"
                            placeholder="Your Comment ..."
                            className="mr-2"
                            aria-label="Search"
                            ref={commentRef}
                            />
                        <Button variant="link" size='sm'>Post</Button>
                    </Form>
                </Card.Footer>
            </Card>
        </div>
    )
}

export default Posts
