import React from 'react';
import './card.scss';

export default function Card(props: string): JSX.Element {
  const title = props;
  return (
    <div className="card">
      <p>{title}</p>
    </div>
  );
}
