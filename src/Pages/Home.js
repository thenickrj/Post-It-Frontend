import React, { useState, useEffect } from "react";
import PostCards from "../components/PostCards";
import styled from "styled-components";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import { useHistory } from "react-router";

const Container = styled.div`
  .container {
    display: grid;
    grid-gap: 5rem;
    grid-template-columns: repeat(auto-fit, minmax(285px, 1fr));
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
  var userInfo = JSON.parse(localStorage.userInfo);

  function submitPost() {
    const data = {
      body: postInput,
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
  var userInfo;
  if (localStorage.userInfo) {
    userInfo = JSON.parse(localStorage.userInfo) || undefined;
  }

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
      <img
        style={{ margin: "10px 45%", cursor: "pointer" }}
        width="50px"
        src="https://findicons.com/files/icons/2443/bunch_of_cool_bluish_icons/512/add.png"
        alt=""
        onClick={() => setModalShow(true)}
      />
      <br />
      <br />
      <div className="container">
        {posts.map((post) => (
          <PostCards setDeleted={setDeleted} post={post} />
        ))}
      </div>
      <AddPost show={modalShow} onHide={() => setModalShow(false)} />
    </Container>
  );
}

//
export default Home;
