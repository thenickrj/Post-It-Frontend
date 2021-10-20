import axios from "axios";
import React, { useEffect, useState } from "react";
import { Accordion, Button, Card, ListGroup } from "react-bootstrap";

function Comment({ comment }) {
  var [reply, setReply] = useState([]);

  var [replyInput, setReplyInput] = useState("");

  var userInfo = JSON.parse(localStorage.userInfo);

  function fetchReply() {
    fetch(
      `https://just-post--it.herokuapp.com/reply/post=${comment.postId}/comment=${comment._id}`
    )
      .then((response) => response.json())
      .then((data) => setReply(data));
  }

  useEffect(() => {
    fetchReply();
  }, []);

  function addReply() {
    const data = {
      name: userInfo.name,
      body: replyInput,
      postId: comment.postId,
      commentId: comment._id,
    };

    console.log(data);
    axios
      .post("https://just-post--it.herokuapp.com/addReply", data)
      .then((res) => {
        fetchReply();
        setReplyInput("");
      });
  }

  return (
    <div>
      <span className="comment_section">
        <p>{comment.body}</p>
        <footer style={{ marginTop: "0rem" }} className="blockquote-footer">
          <cite title="Source Title">{comment.name}</cite>
        </footer>

        <Accordion.Toggle as={Card.Text} variant="link" eventKey="1">
          <p className="reply_control">
            {reply.length > 0 ? "Show Replies" : "Add Reply"}
          </p>
        </Accordion.Toggle>
      </span>
      <Accordion.Collapse eventKey="1">
        <ListGroup>
          {reply.map((rep) => (
            <ListGroup.Item>{rep.body}</ListGroup.Item>
          ))}
          <ListGroup.Item>
            <input
              type="text"
              placeholder="Add a comment"
              value={replyInput}
              onChange={(e) => setReplyInput(e.target.value)}
            />
            <Button
              style={{ height: "25px", marginBottom: "5px" }}
              variant="primary"
              size="sm"
              onClick={addReply}
            >
              Add
            </Button>
          </ListGroup.Item>
        </ListGroup>
      </Accordion.Collapse>
    </div>
  );
}

export default Comment;
