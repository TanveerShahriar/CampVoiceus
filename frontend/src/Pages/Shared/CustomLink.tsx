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
    <div>
      <Link
        to={to}
        {...props}
        className={`text-lg font-semibold px-4 py-2 rounded-md ${
          match
            ? 'bg-white text-indigo-600'
            : 'text-white hover:bg-indigo-700 transition'
        }`}
      >
        {children}
      </Link>
    </div>
  );
};

export default CustomLink;