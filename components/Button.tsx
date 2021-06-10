import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ text, className, ...props }) => {
  if(typeof className==='undefined'){
    className='px-3 py-2 rounded-md shadow-md  bg-blue-600 hover:bg-blue-500 text-white'
  }
  return (
    <button {...props} className={className}>
      {text}
    </button>
  );
};

export default Button;