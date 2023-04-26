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
      {words.map((t, index) => {
        return t.match(urlRgx) ? (
          <a href={t} key={+index + t} target="_blank" rel="noreferrer">
            {`${t} `}
          </a>
        ) : (
          `${t} `
        );
      })}
    </p>
  );
}
