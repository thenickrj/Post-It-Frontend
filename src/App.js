import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { faThumbsUp, faThumbtack } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./App.css";

import { useEffect, useState } from "react";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Header from "./components/Header";
import { useHistory } from "react-router";

// const Container = styled.div``;

function App() {
  const [like, setLike] = useState(false);
  const [userInfo, setUserInfo] = useState(localStorage.getItem("userInfo"));
  var history = useHistory();

  // if (localStorage.userInfo) {
  // setUserInfo(JSON.parse(localStorage.userInfo) || undefined);
  // }
  useEffect(() => {
    setUserInfo(localStorage.getItem("userInfo"));
  }, []);
  return (
    <div>
      <Router>
        <Switch>
          <Route path="/signup">
            <SignUp />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/">
            {userInfo !== null ? (
              <>
                <Header />
                <Home />
              </>
            ) : (
              <div className="App-header">
                <h1>
                  You need to <a href="/login">Login</a> first
                </h1>
              </div>
            )}
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
