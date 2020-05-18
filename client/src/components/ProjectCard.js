import React from "react";
import { axiosWithoutAuth } from "../utils/axiosWithAuth";
import { useHistory } from 'react-router-dom';

export default function ProjectCard(props) {
  const { id } = props.match?.params || props;
  const [state, setState] = React.useState(props);
  const history = useHistory();

  React.useEffect(() => {
    axiosWithoutAuth()
      .get(`/projects/${id}`)
      .then(r => setState(r.data))
      .catch(e => {
        console.error(e);
        history.push("/projects");
      });
  }, [id, history]);

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
