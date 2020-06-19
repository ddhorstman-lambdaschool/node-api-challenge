import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ProjectList from "./components/ProjectList";
import ProjectCard from "./components/ProjectCard";
import Welcome from "./components/Welcome";
import Nav from "./components/Nav";

function App() {
  return (
    <Router>
      <Route path="/" component={Nav} />
      <Route exact path='/' component={Welcome} />
      <Route exact path='/projects' component={ProjectList} />
      <Route exact path='/projects/:id' component={ProjectCard} />
    </Router>
  );
}

export default App;
