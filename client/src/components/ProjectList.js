import React from "react";
import { axiosWithoutAuth } from "../utils/axiosWithAuth";
import ProjectCard from "./ProjectCard";
import { Link } from "react-router-dom";

const initialState = { projects: [] };

export default class ProjectList extends React.Component {
  state = initialState;

  componentDidMount() {
    this.fetchProjects();
  }

  fetchProjects = async () => {
    const { data: projects } = await axiosWithoutAuth().get("/projects");
    this.setState({ projects });
  };

  render() {
    return (
      <div className='project-list'>
        <h1>Projects</h1>
        {this.state.projects.map(project => (
          <Link key={project.id} to={`/projects/${project.id}`}>
            <ProjectCard {...project} />
          </Link>
        ))}
      </div>
    );
  }
}
