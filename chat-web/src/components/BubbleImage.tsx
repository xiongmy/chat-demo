import React from 'react';
import { BASE_URL } from "./../http/config";
interface BubbleImageProps {
  url: string;
}

const BubbleImage = React.memo(({ url }: BubbleImageProps) => {
  return (
    <img src={`${BASE_URL}/images/${url}`} width='150' height='auto' />
  );
});

export default BubbleImage;
