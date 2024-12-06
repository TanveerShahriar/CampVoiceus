import React, { ReactNode } from 'react';
import { Link, useMatch, useResolvedPath } from 'react-router-dom';

interface CustomLinkProps {
  children?: ReactNode;
  to: string;
  [key: string]: any;
}

const CustomLink: React.FC<CustomLinkProps> = ({ children, to, ...props }) => {
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: true });

  return (
    <div className="font-bold text-3xl p-1">
      <Link
        style={{
          color: match ? 'black' : 'blue',
          textDecoration: 'none',
        }}
        to={to}
        {...props}
      >
        {children}
      </Link>
    </div>
  );
};

export default CustomLink;