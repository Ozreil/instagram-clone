import React, {useState, useEffect, useRef} from 'react'
import { Modal, Button, Form, FormControl } from 'react-bootstrap'
import './FullPost.css';
import Comment from './Comment';
import {  MDBIcon } from "mdbreact";

function FullPost(props) {
    const commentRef = useRef();

    const [isOpen, setIsOpen] = useState();
    useEffect(() => {
        setIsOpen(props?.lgshow);

        return ;
    }, [props.lgshow]);

    const handleAddCommentFull = (e) =>{
        e.preventDefault();
               
        let num = 1;
        if(props.postInfo?.commentList.length > 0)  {
            let latestComment = props.postInfo?.commentList.slice(-1);
            let words =  latestComment[0].split("_")
            num += Number(words[3]) ;
        }
        const commentData ={
            commentId: props.currentUserId + "_" + props.postInfo?.postId + "_" +  num ,
            commentValue: commentRef.current.value,
            commentedBy: props.currentUserId,
            postId: props.postInfo?.postId,
            time: Math.floor(Date.now() / 1000),
        }

        e.target.reset();

        props.fullPostAddComment(commentData, props.postInfo);
    }

    return (
            <>    
                <div className="fullpost__image">
                    <img src={props.postData.img}  height="300"/>
                </div>

                <div className="fullpost__sidedata">

                    <Modal.Header >
                        <img className="posts__userImg" src={props.user.profileImg} />
                        <Modal.Title>{props.user.Name}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        {
                            props.comments.map( comment =><Comment 
                            key={comment.commentId} liked={props.me?.likedComments.includes(comment.commentId)}  fullcomment={true} commentInfo = {comment} lkcom={props.likeComment}  commentUser={props.allUsers.filter(user=>user.userData.userId === comment.commentedBy)}/> )
                        }
                    </Modal.Body>

                    <Modal.Footer>
                        <Form onSubmit={handleAddCommentFull}>
                            <MDBIcon far icon="grin-alt" />
                            <FormControl
                            type="text"
                            placeholder="Your Comment ..."
                            className="mr-2"
                            aria-label="Search"
                            ref={commentRef}
                            />
                            <Button  variant="link" size='sm'>Post</Button>
                        </Form>
                    </Modal.Footer>
                </div>
            </>
    )
}

export default FullPost
