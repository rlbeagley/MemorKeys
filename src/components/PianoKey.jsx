import {useState} from 'react';

export default function PianoKey({ Svg, id, className, isActive, onPress, onRelease, ...rest}) {

  return (
    <Svg
      id={id}
      className={`${className ?? ""} ${isActive ? "key-pressed" : ""}`}
      onMouseDown={() =>{ 
        onPress(id);
      }}
      onMouseUp={() => {
        onRelease(id);
      }}
      {...rest}
    />
  );
}