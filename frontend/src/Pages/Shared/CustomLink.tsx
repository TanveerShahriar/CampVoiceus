import { ReactNode } from 'react';
import { Link, useMatch, useResolvedPath } from "react-router-dom";

interface CustomLinkProps {
  children: ReactNode;
  to: string;
  className?: string;
  icon?: ReactNode;
}

export default function CustomLink({ children, to, className, icon, ...props }: CustomLinkProps) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <Link
      to={to}
      className={`${className ? className : 'text-indigo-200 hover:bg-indigo-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium'} ${
        isActive ? 'bg-indigo-700 text-white' : ''
      } flex items-center`}
      {...props}
    >
      {icon}
      {children}
    </Link>
  );
}

