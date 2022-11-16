import React from 'react';
import './progressBar.scss';

type PropsType = {
  completed: number;
};

export default function ProgressBar(props: PropsType): JSX.Element {
  const { completed } = props;
  const progressFiller = {
    width: `${completed}%`,
  };
  return (
    <div className="progressBar-container">
      <div className="progressBar-bg">
        <div className="progressBar-filler" style={progressFiller} />
      </div>
    </div>
  );
}
