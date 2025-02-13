import React, { FC } from "react";
import Link from "next/link";

interface RouterLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const RouterLink: FC<RouterLinkProps> = ({ href, children, className }) => {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
};

export default RouterLink;
