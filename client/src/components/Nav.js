import React from "react";
import { NavLink } from "react-router-dom";

export default function Nav(props) {
  const projectID = props.location.pathname.match(/[0-9]+$/)?.[0];
  return (
    <nav>
      <NavLink exact to='/'>
        Home
      </NavLink>
      <NavLink exact to='/projects'>
        Projects
      </NavLink>
      {projectID && (
        <NavLink exact to={`/projects/${projectID}`}>
          Details
        </NavLink>
      )}
    </nav>
  );
}
