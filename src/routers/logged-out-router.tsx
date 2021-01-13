import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { LOGOUT_HASH } from "../constants";
import { NotFound } from "../pages/404";
import { CreateAccount } from "../pages/create-account";
import { Login } from "../pages/login";

export const LoggedOutRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path="/create-account">
          <CreateAccount />
        </Route>
        <Route path="/" exact>
          <Login />
        </Route>
        <Redirect from="/accounts" to="/users" />
        <Route>
          {window.location.hash === `#${LOGOUT_HASH}` ? (
            <Redirect to="/" />
          ) : (
            <NotFound />
          )}
        </Route>
      </Switch>
    </Router>
  );
};
