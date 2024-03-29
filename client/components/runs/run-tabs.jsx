import React from 'react';
import { Link } from 'react-router-dom';

export default function RunTabs(props) {
  const { children } = props;

  return (
    <div>
      <ul className="flex w-full text-center bg-blue-200 md:hidden">
        {children.map(tab => {
          const { label } = tab.props;
          return (
            <li key={label} className={`${label === props.tab ? 'border-b-2 border-purple-700' : 'border-b-2 border-blue-200'} w-1/3`}>
              <Link className="block p-4 transition-all ease-in-out duration-200 hover:bg-blue-300 hover:bg-opacity-30 hover:cursor-pointer" to={`/home/${label}`}>{label.charAt(0).toUpperCase() + label.slice(1)}</Link>
            </li>
          );
        })}
      </ul>
      <div>
        {children.map(tabContent => {
          const { label, children } = tabContent.props;
          if (label === props.tab) {
            return (
              <div key={label}>{children}</div>
            );
          } return '';
        })}
      </div>
    </div>
  );
}
