import React, { useEffect, useState } from "react";
import { Avatar, makeStyles } from "@material-ui/core";
import { store } from "react-notifications-component";
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
import arrow from "../images/arrow.png";
import pencil from "../images/editPencil.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import axios from "axios";
import Comment from "./Comment";
import moment from "moment";
import { useHistory } from "react-router";
import "../notify-popup.css";

const Container = styled.div`
  padding-bottom: 20px;
  .postCss {
    width: 22rem;
    border-radius: 33px;
    background: #d6dcf5;
    box-shadow: -5px -5px 10px #5567ab, 5px 5px 10px #95b3ff;
  }
  .liked,
  .notLiked,
  .comment {
    height: 30px;
    width: 30px;
    cursor: pointer;
  }

  .liked:hover {
    box-shadow: 0px 15px 20px rgba(46, 229, 157, 0.4);
    color: #fff;
    transform: translateY(-7px);
  }

  .arrow {
    width: 30px;
    height: 30px;
    transform: rotate(90deg);
  }

  .img__res {
    width: 30px;
    transition: all 0.4s ease-in-out;
    cursor: pointer;
  }

  .img__res:hover {
    transform: scale(1.2);
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

  @media screen and (max-width: 400px) {
    .postCSS {
      width: 20rem;
    }
  }
`;

const PopUpBody = styled.div`
  .cssShadow {
    background: #d6dcf5;
    box-shadow: -5px -5px 10px #5567ab, 5px 5px 10px #95b3ff;
    border: 1px solid black;
  }

  .postCss {
    margin: auto;
    margin-bottom: 10px;
    border-radius: 33px;
    background: #d6dcf5;
    box-shadow: -5px -5px 10px #5567ab, 5px 5px 10px #95b3ff;
  }

  input[type="text"] {
    border: 1px solid #857b7b;
    font-size: 30px;
    border-radius: 15px;
    height: 50px;
    width: 90%;
  }

  .liked,
  .notLiked,
  .comment {
    height: 30px;
    width: 30px;
    cursor: pointer;
  }

  .comment {
    color: #62bbed;
  }
`;

function EditPost({ show, setUpdated, post, onHide }) {
  const [postInput, setPostInput] = useState(post.body);
  var [status, setStatus] = useState(false);
  var userInfo = localStorage.userInfo
    ? JSON.parse(localStorage.userInfo)
    : undefined;

  var dateModified = moment(new Date()).toISOString();

  function updatePost() {
    const data = {
      body: postInput,
      createdAt: dateModified,
    };

    axios
      .post("https://just-post--it.herokuapp.com/post/update=" + post._id, data)
      .then((res) => {
        // fetchReply();
        onHide();
        setStatus(!status);
        setUpdated(!status);
      });
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton className="cssShadow">
        <Modal.Title id="contained-modal-title-vcenter">
          Just Post it!
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ background: "#d6dcf5" }}>
        <PopUpBody>
          <Card
            className="postCss"
            style={{ marginTop: "0rem", width: "22rem" }}
          >
            <h1 style={{ padding: "5%" }}>{postInput}</h1>
            <footer
              style={{
                paddingLeft: "20%",
                display: "flex",
                justifyContent: "center",
              }}
              className="blockquote-footer"
            >
              <cite title="Source Title">
                <Avatar
                  alt="Profile"
                  src={`https://joeschmoe.io/api/v1/${userInfo?.name}`}
                  // className={classes.avatarImage}
                  style={{ backgroundColor: "#7C7F90" }}
                />
                {userInfo.name}
              </cite>
            </footer>

            <Accordion>
              <Card style={{ margin: 10 }}>
                <Card.Header
                  style={{ display: "flex", justifyContent: "space-evenly" }}
                >
                  <FontAwesomeIcon
                    className="liked"
                    style={{ color: "#62bbed" }}
                    icon={faThumbsUp}
                  />
                  <FontAwesomeIcon className="comment" icon={faComment} />
                </Card.Header>
              </Card>
            </Accordion>
          </Card>

          <input
            type="text"
            placeholder="Type here..."
            value={postInput}
            onChange={(e) => setPostInput(e.target.value)}
          />
        </PopUpBody>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={updatePost}>Update</Button>
      </Modal.Footer>
    </Modal>
  );
}

function PostCards({ post, users, setDeleted, setUpdated }) {
  var [likeStatus, setLikeStatus] = useState(false);
  var [likeNumber, setLikeNumber] = useState(post.likeCount);

  // var [likeList, setLikeList] = useState([]);
  var likeList = [];
  // var userEmail = users.map((user) => {
  //   return user.email;
  // });

  var [comments, setComments] = useState([]);
  var [commentNumber, setCommentNumber] = useState(post.commentCount);
  var [commentInput, setCommentInput] = useState("");

  var [likeUsers, setLikeUsers] = useState([]);

  const [modalShow, setModalShow] = useState(false);

  const [showReplies, setShowReplies] = useState(false);
  let history = useHistory();

  // console.log(userInfo);
  // var userInfo;
  var userInfo = localStorage.userInfo
    ? JSON.parse(localStorage.userInfo)
    : undefined;

  const notify = (title, type) => {
    store.addNotification({
      title: title,
      message: " ",
      type: type,
      background: "pink",
      insert: "bottom",
      container: "bottom-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 3000,
        onScreen: true,
      },
    });
  };

  function liking() {
    // fetch("http:localhost")
    if (userInfo) {
      setLikeStatus(!likeStatus);

      const data = {
        email: userInfo?.email,
        postId: post._id,
      };
      if (likeStatus) {
        axios
          .post("https://just-post--it.herokuapp.com/unLike", data)
          .then((res) => {
            setLikeNumber(likeNumber - 1);
            notify("You have unliked the post!", "default");
          });
      } else {
        axios
          .post("https://just-post--it.herokuapp.com/addLike", data)
          .then((res) => {
            setLikeNumber(likeNumber + 1);
            notify("You have liked the post!", "default");
          });
      }
    } else {
      notify("You need to login to like!", "warning");
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
      `https://just-post--it.herokuapp.com/likes/email=${userInfo?.email}/post=${post._id}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.length == 1) {
          setLikeStatus(true);
        }
      });

    // fetch(`https://just-post--it.herokuapp.com/likes/post=${post._id}`)
    //   .then((response) => response.json())
    //   .then((data) => {
    //     var dataEmail = data.map((user) => {
    //       return user.email;
    //     });

    //     dataEmail.map((email) => {
    //       console.log(userEmail.includes(email));
    //       if (userEmail.includes(email)) {
    //         likeUsers.push(email);
    //       }
    //     });
    //   });
    fetchComments();
  }, []);

  const gotoLogin = () => {
    history.push("/login");
  };

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
      name: userInfo?.name,
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
      <Card className="postCss" style={{ marginTop: "0rem" }}>
        <h2 style={{ padding: "5%" }}>{post.body}</h2>
        <footer
          style={{
            paddingLeft: "20%",
            display: "flex",
            justifyContent: "center",
          }}
          className="blockquote-footer"
        >
          <cite title="Source Title">
            <Avatar
              alt="Profile"
              src={`https://joeschmoe.io/api/v1/${post?.name}`}
              // className={classes.avatarImage}
              style={{ backgroundColor: "#7C7F90" }}
            />
            {post.name}
          </cite>
        </footer>
        <Card.Footer
          className="text-muted"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          {moment(post.updatedAt).format("D MMMM YYYY")}
          {userInfo && post.userId === userInfo?._id && (
            <img
              onClick={() => setModalShow(true)}
              className="img__res"
              src={pencil}
              alt=""
            />
          )}
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
                <Accordion.Toggle
                  style={{ display: "flex" }}
                  as={Card.Text}
                  variant="link"
                  eventKey="0"
                >
                  <span style={{ display: "flex" }}>
                    <FontAwesomeIcon className="comment" icon={faComment} />
                    <h3>{commentNumber}</h3>
                  </span>
                  <img className="arrow" src={arrow} alt="" />
                </Accordion.Toggle>
              </span>

              <div>
                {userInfo && post.userId === userInfo?._id && (
                  <Button
                    variant="danger"
                    className="mx-2"
                    style={{ background: "#158CBA", borderColor: "#115b77" }}
                    onClick={deleteHandler}
                  >
                    Delete Post
                  </Button>
                )}
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
                  {userInfo ? (
                    <>
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
                    </>
                  ) : (
                    <Button
                      style={{ height: "28px" }}
                      variant="primary"
                      size="sm"
                      onClick={gotoLogin}
                    >
                      Need to login first
                    </Button>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </Card>

      {userInfo && (
        <EditPost
          show={modalShow}
          setUpdated={setUpdated}
          post={post}
          onHide={() => setModalShow(false)}
        />
      )}
    </Container>
  );
}

export default PostCards;
