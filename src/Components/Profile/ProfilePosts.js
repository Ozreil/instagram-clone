import React,{useEffect} from 'react'
import './Profile.css';
import {Tabs,Tab,Card, Row, Col} from 'react-bootstrap';

function ProfilePosts({ID ,MyPosts, savedPosts}) {
    useEffect(() => {
   
        console.log("the saved posts are ", savedPosts);
        
    }, [])
    return (
        <div>
            <Tabs
                defaultActiveKey={ID}
                id="noanim-tab-example"
                className="mb-3"
                >
                    <Tab eventKey="POSTS" title="POSTS">
                        <Row xs={1} md={3} className="g-4">
                            {Array.from(MyPosts).map((myPost) => (
                                <Col key={myPost?.postId + "Col"}>
                                    <Card key={myPost?.postId}>
                                        <Card.Img variant="top" src={myPost?.img} />
                                    </Card>
                                </Col>
                            ))}
                        </Row> 
                    </Tab>

                    <Tab eventKey="SAVED" title="SAVED">
                        <Row xs={1} md={3} className="g-4">
                            {savedPosts && Array.from(savedPosts).map((savedPost) => (
                                <Col key={savedPost.postId + "ColSaved"}>
                                    <Card key={savedPost.postId.toUpperCase}>
                                        <Card.Img variant="top" src={savedPost.img} />
                                    </Card>
                                </Col>
                            ))}
                            
                        </Row> 
                    </Tab>
                    
                </Tabs>
        </div>
    )
}

export default ProfilePosts
