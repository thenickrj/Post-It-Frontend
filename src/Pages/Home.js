import React, { useState, useEffect } from "react";
import PostCards from "../components/PostCards";
import styled from "styled-components";
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
  Form,
  Modal,
} from "react-bootstrap";
import axios from "axios";
import { useHistory } from "react-router";
import { store } from "react-notifications-component";
import { Avatar, FormControl } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import Loader from "react-loader-spinner";

const Container = styled.div`
  background: #d6dcf5;
  min-height: 100vh;

  .container {
    display: grid;
    grid-gap: 5rem;
    grid-template-columns: repeat(auto-fit, minmax(285px, 1fr));
  }

  .centerFlex {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .notFound {
    text-align: center;
    font-size: 30px;
    padding: 20px;
  }

  .searchBar {
    margin: 0 5%;
    border-radius: 20px;
    height: 30px;
    outline: none;
    margin-right: 50%;
    background: #d6dcf5;
    box-shadow: -5px -5px 10px #858dac, 5px 5px 10px #e7f5ff;
  }

  input[type="text"]::placeholder {
    font-family: "Poppins", sans-serif;
    font-weight: bold;
    color: black;
  }

  .addImg {
    border-radius: 33px;
    background: #d6dcf5;
    box-shadow: -5px -5px 10px #5567ab, 5px 5px 10px #95b3ff;
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

function AddPost(props) {
  const [postInput, setPostInput] = useState("");
  var userInfo = localStorage.userInfo
    ? JSON.parse(localStorage.userInfo)
    : undefined;

  function submitPost() {
    const data = {
      body: postInput,
      userId: userInfo._id,
      name: userInfo.name,
      email: userInfo.email,
      likeCount: 0,
      commentCount: 0,
    };
    console.log(data);

    axios
      .post("https://just-post--it.herokuapp.com/addPost", data)
      .then((res) => {
        // fetchReply();
        props.onHide();
      });
    setPostInput("");
  }

  return (
    <Modal
      {...props}
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
        <Button onClick={submitPost}>Add</Button>
      </Modal.Footer>
    </Modal>
  );
}

function Home() {
  let data = [1, 2, 3, 4];
  var [posts, setPosts] = useState([]);
  var [users, setUsers] = useState([]);
  const [modalShow, setModalShow] = useState(false);

  // var userInfo = JSON.parse(localStorage.userInfo);

  var [deleted, setDeleted] = useState(false);
  var [update, setUpdated] = useState(false);

  let history = useHistory();
  // var [userInfo, setUserInfo] = useState();
  // console.log(userInfo);
  // var userInfo;
  var userInfo = localStorage.userInfo
    ? JSON.parse(localStorage.userInfo)
    : undefined;

  const [searchTerm, setSearchTerm] = useState("");
  const [search, setSearch] = useState(false);
  const [searchPosts, setSearchPosts] = useState([]);

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

  async function checkLogged() {
    if (localStorage.getItem("userInfo") == null) {
      history.push("/login");
    }
  }

  useEffect(() => {
    fetch("https://just-post--it.herokuapp.com/post")
      .then((response) => response.json())
      .then((data) => setPosts(data));

    fetch("https://just-post--it.herokuapp.com/users")
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, [modalShow, deleted, update]);

  //Filter out the posts based on the User Input (searchTerm)
  useEffect(() => {
    // console.log(posts);
    setSearchPosts(
      posts.filter((post) => {
        return post.body.toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [searchTerm]);

  return (
    <Container>
      <br />
      <input
        className="searchBar"
        type="text"
        placeholder="🔍 Search..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
      />
      <img
        className="addImg"
        style={{ margin: "10px 45%", cursor: "pointer" }}
        width="50px"
        src="https://findicons.com/files/icons/2443/bunch_of_cool_bluish_icons/512/add.png"
        alt=""
        onClick={() =>
          userInfo
            ? setModalShow(true)
            : notify("Need to login to post", "warning")
        }
      />
      <br />
      <br />
      {posts ? (
        <div className="container">
          {searchTerm.length == 0 &&
            posts.map((post) => (
              <PostCards
                className="postCSS"
                setDeleted={setDeleted}
                post={post}
                users={users}
                setUpdated={setUpdated}
              />
            ))}
          {searchTerm.length > 0 &&
            searchPosts.length > 0 &&
            searchPosts.map((post) => (
              <PostCards
                className="postCSS"
                setDeleted={setDeleted}
                post={post}
                users={users}
                setUpdated={setUpdated}
              />
            ))}
        </div>
      ) : (
        <>
          <div className="centerFlex">
            <Loader
              type="Bars"
              color="#00BFFF"
              height={100}
              width={100}
              // timeout={3000} //3 secs
            />
          </div>
        </>
      )}

      {/* <div className="container">
        {searchTerm.length == 0 &&
          posts.map((post) => (
            <PostCards
              className="postCSS"
              setDeleted={setDeleted}
              post={post}
              users={users}
              setUpdated={setUpdated}
            />
          ))}
        {searchTerm.length > 0 &&
          searchPosts.length > 0 &&
          searchPosts.map((post) => (
            <PostCards
              className="postCSS"
              setDeleted={setDeleted}
              post={post}
              users={users}
              setUpdated={setUpdated}
            />
          ))}
      </div> */}
      {searchTerm && searchPosts.length === 0 && (
        <div className="notFound">
          No Post with the word {searchTerm} found{" "}
        </div>
      )}
      {userInfo && (
        <AddPost show={modalShow} onHide={() => setModalShow(false)} />
      )}
    </Container>
  );
}

//
export default Home;
