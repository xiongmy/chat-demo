import React from "react";

interface TitleProps {
  text: string;
  children?: React.ReactNode;
}

const Title: React.FC<TitleProps> = ({ text, children }) => {
  return (
    <div className="w-full h-8 flex justify-between leading-8 px-2 border-gray-300 text-sm overflow-hidden">
      {text? <p>{text}</p>:''}
      {children}
    </div>
  );
};

export default Title;