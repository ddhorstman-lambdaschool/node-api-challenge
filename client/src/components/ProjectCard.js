import React from "react";

export default function ProjectCard(props) {
  const { name, description, completed } = props;

  return (
    <div>
      <h3>{(completed ? "✔️ " : "❌ ") + name}</h3>
      <p>{description}</p>
    </div>
  );
}
