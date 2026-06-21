import { useLocation } from 'react-router-dom';

export default function Play() {
  const location = useLocation();
  const { level, labels } = location.state || {};

  return (
    // temporary, i just needed to check if I could get the state
    <div>
      <h2>Level: {level}</h2>
      <h2>Show Notes: {labels ? "Yes" : "No"}</h2>
    </div>
  );
}