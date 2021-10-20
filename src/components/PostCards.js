import React, { useEffect, useState } from "react";
import {
  Accordion,
  Badge,
  Button,
  Card,
  Col,
  ListGroup,
  Nav,
  Navbar,
  Row,
} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import axios from "axios";
import Comment from "./Comment";
import moment from "moment";

const Container = styled.div`
  .liked,
  .notLiked,
  .comment {
    height: 30px;
    width: 30px;
    cursor: pointer;
  }

  .notLiked {
    color: lightblue;
  }
  .comment {
    color: #62bbed;
  }

  .post_bottom {
    display: flex;
    justify-content: space-around;
  }

  .like_container {
    margin-left: 6%;
    display: flex;
    object-fit: contain;
  }

  .body {
    font-size: 30px;
  }

  .reply_control {
    color: #62bbed;
    text-decoration: underline;
    cursor: pointer;
    margin: 0;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
      border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out,
      border-radius 0.15s ease;
  }

  .comment_section {
    display: flex;
    justify-content: space-between;
    margin-bottom: -15px;
  }

  input[type="text"] {
    border-radius: 8px;
    border: 1px solid #857b7b;
  }
`;

function PostCards({ post, setDeleted }) {
  var [likeStatus, setLikeStatus] = useState(false);
  var [likeNumber, setLikeNumber] = useState(post.likeCount);

  var [comments, setComments] = useState([]);
  var [commentNumber, setCommentNumber] = useState(post.commentCount);
  var [commentInput, setCommentInput] = useState("");

  const [showReplies, setShowReplies] = useState(false);
  var userInfo = JSON.parse(localStorage.userInfo);

  function liking() {
    // fetch("http:localhost")
    setLikeStatus(!likeStatus);

    const data = {
      email: userInfo.email,
      postId: post._id,
    };
    if (likeStatus) {
      axios
        .post("https://just-post--it.herokuapp.com/unLike", data)
        .then((res) => {
          setLikeNumber(likeNumber - 1);
        });
    } else {
      axios
        .post("https://just-post--it.herokuapp.com/addLike", data)
        .then((res) => {
          setLikeNumber(likeNumber + 1);
        });
    }
  }

  function fetchComments() {
    fetch(`https://just-post--it.herokuapp.com/comment/post=${post._id}`)
      .then((response) => response.json())
      .then((data) => setComments(data));

    setCommentInput("");
  }
  useEffect(() => {
    fetch(
      `https://just-post--it.herokuapp.com/likes/email=${userInfo.email}/post=${post._id}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.length == 1) {
          setLikeStatus(true);
        }
      });

    fetchComments();
  }, []);

  function deleteHandler() {
    if (window.confirm("Delete this post?")) {
      console.log(post);
      console.log(post._id);
      axios
        .delete("https://just-post--it.herokuapp.com/post/delete=" + post._id)
        .then((response) => {
          console.log(response.data);
          setDeleted(true);
        });
    }
  }

  function addComment() {
    const data = {
      name: userInfo.name,
      body: commentInput,
      postId: post._id,
    };

    console.log(data);
    axios
      .post("https://just-post--it.herokuapp.com/addComment", data)
      .then((res) => {
        setCommentNumber(commentNumber + 1);
        fetchComments();
      });
  }

  return (
    <Container>
      <Card
        style={{ marginTop: "0rem", width: "22rem", border: "1px solid black" }}
      >
        <h1 style={{ padding: "5%" }}>{post.body}</h1>
        <footer style={{ paddingLeft: "20%" }} className="blockquote-footer">
          <cite title="Source Title"> {post.name}</cite>
        </footer>
        <Card.Footer className="text-muted">
          {moment(post.createdAt).format("D MMMM YYYY")}
        </Card.Footer>

        <span className="like_container">
          {likeStatus ? (
            <FontAwesomeIcon
              className="liked"
              style={{ color: "#62bbed" }}
              onClick={liking}
              icon={faThumbsUp}
            />
          ) : (
            <FontAwesomeIcon
              className="notLiked"
              onClick={liking}
              icon={faThumbsUp}
            />
          )}
          <h3>{likeNumber}</h3>
        </span>

        <Accordion>
          <Card style={{ margin: 10 }}>
            <Card.Header style={{ display: "flex" }}>
              <span
                // onClick={() => ModelShow(note)}
                style={{
                  color: "black",
                  textDecoration: "none",
                  flex: 1,
                  cursor: "pointer",
                  alignSelf: "center",
                  fontSize: 18,
                }}
              >
                <Accordion.Toggle as={Card.Text} variant="link" eventKey="0">
                  <span style={{ display: "flex" }}>
                    <FontAwesomeIcon className="comment" icon={faComment} />
                    <h3>{commentNumber}</h3>
                  </span>
                </Accordion.Toggle>
              </span>

              <div>
                <Button
                  variant="danger"
                  className="mx-2"
                  onClick={deleteHandler}
                >
                  Delete Post
                </Button>
              </div>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <ListGroup>
                <ListGroup.Item>
                  <Accordion>{/* <Comment /> */}</Accordion>
                </ListGroup.Item>
                {comments.map((comment) => (
                  <ListGroup.Item>
                    <Accordion>
                      <Comment comment={comment} />
                    </Accordion>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <input
                    type="text"
                    placeholder="Add a comment"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                  />
                  <Button
                    style={{ height: "28px" }}
                    variant="primary"
                    size="sm"
                    onClick={addComment}
                  >
                    Add
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </Card>
    </Container>
  );
}

export default PostCards;
