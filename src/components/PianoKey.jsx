import {useState} from 'react';

export default function PianoKey({id, className, isActive, onPress, onRelease, showLabel, ...rest}) {

  return (

    <div  
      id={id}
      className={`${className ?? ""} ${isActive ? "key-pressed" : ""}`}
      onMouseDown={() =>{ 
        onPress(id);
      }}
      onMouseUp={() => {
        onRelease(id);
      }}
      {...rest}> 
    
      {showLabel && <h3 className="key-label">{id}</h3>}
    </div>
      
  );
}