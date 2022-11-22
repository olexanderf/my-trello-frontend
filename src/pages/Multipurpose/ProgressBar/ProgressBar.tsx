import React, { useEffect, useState } from 'react';
import './progressBar.scss';

export default function ProgressBar(): JSX.Element {
  const [completed, setCompleted] = useState(20);
  const progressFiller = {
    width: `${completed}%`,
  };
  useEffect(() => {
    if (completed < 100) setCompleted(completed + 20);
  }, [completed]);
  return (
    <div className="progressBar-container">
      <p className="progressBar-name">Loading...</p>
      <div className="progressBar-bg">
        <div className="progressBar-filler" style={progressFiller} />
      </div>
    </div>
  );
}
