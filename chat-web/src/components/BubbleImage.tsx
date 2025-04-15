import React from 'react';
import { Image } from 'antd'
import { BASE_URL } from "./../http/config";
interface BubbleImageProps {
  url: string;
}

const BubbleImage = React.memo(({ url }: BubbleImageProps) => {
  return (
    <Image width={150}  src={`${BASE_URL}/images/${url}`} />
  );
});

export default BubbleImage;
