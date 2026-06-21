import {useState} from 'react';

export default function PianoKey({ Svg, id, className, ...rest}) {
  const [pressed, setPressed] = useState(false);

  return (
    <Svg
      id={id}
      className={`${className ?? ""} ${pressed ? "key-pressed" : ""}`}
      onMouseDown={() =>{ 
        setPressed(true); 
        onPress(id);
      }}
      onMouseUp={() => setPressed(false)}
      {...rest}
    />
  );
}