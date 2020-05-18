import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import ProjectList from './components/ProjectList';
import Welcome from "./components/Welcome";

function App() {
  return (
    <Router>
      <Route exact path = "/" component={Welcome} />
      <Route exact path = "/projects" component={ProjectList} />
    </Router>
  );
}

export default App;
