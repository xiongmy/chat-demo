import React from "react";
import ReactJsonViewer from 'react-json-viewer-cool';

interface JsonProps {
  json: object;
}

const JsonViewer: React.FC<JsonProps> = ({ json }) => {

  return (
    <div className="text-xs leading-4">
      <ReactJsonViewer data={json} />
    </div>
  );
};

export default JsonViewer;