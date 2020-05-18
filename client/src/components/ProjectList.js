import React from "react";
import { axiosWithoutAuth } from "../utils/axiosWithAuth";
import ProjectCard from "./ProjectCard";

const initialState = { projects: [] };

export default class ProjectList extends React.Component {
  state = initialState;

  componentDidMount() {
    this.fetchProjects();
  }

  fetchProjects = async () => {
    const projects = (await axiosWithoutAuth().get("/projects")).data;
    this.setState({ projects });
  };

  render() {
    return (
      <>
        <h1>Projects</h1>
        {this.state.projects.map(project => (
          <ProjectCard {...project} key={project.id} />
        ))}
      </>
    );
  }
}
