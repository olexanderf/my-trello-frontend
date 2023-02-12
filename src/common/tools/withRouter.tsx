// function grapped from https://reactrouter.com/en/v6.3.0/faq
// ts version grapped from https://whereisthemouse.com/how-to-use-withrouter-hoc-in-react-router-v6-with-typescript

import React, { ReactElement } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

/** Use `React Router hooks` instead */
export default function withRouter<Props extends RouteComponentProps>(
  Component: React.ComponentType<Props>
): React.ComponentType<Props> {
  return function withR(props: Omit<Props, keyof RouteComponentProps>): ReactElement {
    const location = useLocation();
    const params = useParams();
    const navigate = useNavigate();

    return <Component {...(props as Props)} router={{ location, params, navigate }} />;
  };
}
