import React, { useState, useEffect } from "react";
import PostCards from "../components/PostCards";
import styled from "styled-components";
import { Button, Form, Modal } from "react-bootstrap";
import axios from "axios";
import { useHistory } from "react-router";
import { store } from "react-notifications-component";
import { FormControl } from "@material-ui/core";

const Container = styled.div`
  background: #d6dcf5;

  .container {
    display: grid;
    grid-gap: 5rem;
    grid-template-columns: repeat(auto-fit, minmax(285px, 1fr));
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
  input[type="text"] {
    border: 1px solid #857b7b;
    font-size: 30px;
    border-radius: 15px;
    height: 50px;
    width: 90%;
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
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Just Post it!
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <PopUpBody>
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
  const [modalShow, setModalShow] = useState(false);

  // var userInfo = JSON.parse(localStorage.userInfo);

  var [deleted, setDeleted] = useState(false);

  let history = useHistory();
  // var [userInfo, setUserInfo] = useState();
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

  async function checkLogged() {
    if (localStorage.getItem("userInfo") == null) {
      history.push("/login");
    }
  }

  useEffect(() => {
    fetch("https://just-post--it.herokuapp.com/post")
      .then((response) => response.json())
      .then((data) => setPosts(data));

    // checkLogged();
  }, [modalShow, deleted]);

  return (
    <Container>
      <br />
      <input
        className="searchBar"
        type="text"
        placeholder="🔍 Search..."
        // value={searchTerm}
        // onChange={(e) => {
        //   setSearchTerm(e.target.value);
        // }}
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
      <div className="container">
        {posts.map((post) => (
          <PostCards className="postCSS" setDeleted={setDeleted} post={post} />
        ))}
      </div>
      {userInfo && (
        <AddPost show={modalShow} onHide={() => setModalShow(false)} />
      )}
    </Container>
  );
}

//
export default Home;
