import React, { useContext, useEffect, useState } from 'react';
import './Comment.css';

import Nav from 'react-bootstrap/Nav';

function Comment(props) {

    const [date, setDate] = useState();
    
    useEffect(()=>{
        // Create a new JavaScript Date object based on the timestamp
        // multiplied by 1000 so that the argument is in milliseconds, not seconds.
        var date = new Date(props.commentInfo?.time * 1000);
        // Hours part from the timestamp
        var hours = date.getHours();
        // Minutes part from the timestamp
        var minutes = "0" + date.getMinutes();
        // Seconds part from the timestamp
        var seconds = "0" + date.getSeconds();

        // Will display time in 10:30:23 format
        var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        setDate(formattedTime);
    },[])

    const likeComment = ()=>{
        props.lkcom(props.commentInfo.commentId);
    }
    return (
        <div className ={`comment ${props.fullcomment ? 'fullcomment' : ''}`} >
            <div className="comment__maindata">
                <img src={props.commentUser[0].userData.profileImg} className ={` ${props.fullcomment ? 'commentImg' : 'nocommentImg'}`} />
                <Nav.Link eventKey="link-2">{props.commentUser[0].userData.Name}</Nav.Link>
                <p>: {props.commentInfo.commentValue}</p>
                <svg onClick={()=>likeComment()} className= {props.liked ? "comment__liked" : "comment__notliked" }  xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path d="M12 4.435c-1.989-5.399-12-4.597-12 3.568 0 4.068 3.06 9.481 12 14.997 8.94-5.516 12-10.929 12-14.997 0-8.118-10-8.999-12-3.568z"/></svg>        
            </div>
            <span className ={` ${props.fullcomment ? 'comment__date' : 'nocommentImg'}`}>
                {date}
            </span>

        </div>
    )
}

export default Comment
