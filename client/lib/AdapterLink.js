/// in AdapterLink.jsx
import * as React from 'react';
import Link from 'react-router-dom';

function AdapterLink({url, ...rest}) {
  return <Link to={url} {...rest} />;
}
