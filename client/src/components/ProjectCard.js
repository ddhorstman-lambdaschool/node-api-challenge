import React from "react";
import { axiosWithoutAuth } from "../utils/axiosWithAuth";

export default function ProjectCard(props) {
  const { id } = props.match?.params || props;
  const [state, setState] = React.useState(props);

  React.useEffect(() => {
    axiosWithoutAuth()
      .get(`/projects/${id}`)
      .then(r => setState(r.data))
      .catch(console.error);
  }, [id]);

  return (
    <div>
      {state.name && (
        <>
          <h3>{(state.completed ? "✔️ " : "❌ ") + state.name}</h3>
          <p>{state.description}</p>
        </>
      )}
      {
        /* Only show actions if this is the direct child of a Route */
        props.match && state.actions && (
          <ul>
            {state.actions.map(action => (
              <li key={action.id}>
                <h4>{(action.completed ? "✔️ " : "❌ ") + action.notes}</h4>
                <p>{state.description}</p>
              </li>
            ))}
          </ul>
        )
      }
    </div>
  );
}
