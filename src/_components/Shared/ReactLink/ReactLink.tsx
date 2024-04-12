import React from 'react';
import { Link } from 'react-router-dom';

export const ReactLink = ({ ...props }: React.PropsWithChildren<{ to: string; className?: string; }>) => {
  if (/^https?:\/\//.test(props.to))
    return (
      <a href={props.to} {...props} target='_blanc'>
        {props.children}
      </a>)

  return (
    <Link {...props}>
      {props.children}
    </Link>
  );
};