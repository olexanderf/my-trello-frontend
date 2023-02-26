import React from 'react';
import { urlRgx } from '../../../../../common/constants/regExp';

interface PropsType {
  text: string;
}

export default function LinkComponent(props: PropsType): JSX.Element {
  const { text } = props;
  const words = text.split(' ');
  return (
    <p>
      {words.map((t) => {
        return t.match(urlRgx) ? (
          <a href={t} target="_blank" rel="noreferrer">
            {`${t} `}
          </a>
        ) : (
          `${t} `
        );
      })}
    </p>
  );
}
