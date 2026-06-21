import { useLocation } from 'react-router-dom';
import { useState } from 'react'
import { FaPlay } from "react-icons/fa";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import WhiteKeySvg from '../assets/imgs/white-key.svg?react';
import BlackKeySvg from '../assets/imgs/black-key.svg?react';
import PianoKey from '../components/PianoKey';


export default function Play() {
  const location = useLocation();
  const navTo = useNavigate();
  const { level, labels } = location.state || {};

  // states
  const [gameStage, setGameStage] = useState('demo');
  const [score, setScore] = useState(0);
  const [clickedKeys, setClickedKeys] = useState([""]);
  const [desiredKeys, setDesiredKeys] = useState([""]);

  const whiteKeys = ["C","D","E","F","G","A","B"];
  const whiteKeyWidth = 100 / whiteKeys.length;

  // "after" = index of the white key each black key sits between
  const blackKeys = [
    { note: "C#", after: 0 },
    { note: "D#", after: 1 },
    { note: "F#", after: 3 },
    { note: "G#", after: 4 },
    { note: "A#", after: 5 },
  ];

  // handle state (demo or play)
  // handlePressKey (add to array, check if right)
  // for HandlePressKey, if in demo mode, don't need to check if right.

  const handleNavToSettings = () => {
    navTo("/");
  };

  const handlePressKey = (note) => {
    setClickedNotes(prev => [...prev, note]);
    

    // add logic to check if this is equal to the array of desired keys.
    // if not, trigger end scene
    // if it is, increase score, trigger add new desired key, which will trigger a demo scene. 
  }

  return (
    <Container className="column-container my-3">
      <h2 className="d-flex justify-content-center">
        <FaPlay style={{ fontSize: "1.5rem" }} className="me-3 light-icon"/>
        Click Anywhere To Start
      </h2>
      
      <Container fluid className="position-relative d-flex align-items-start">
        {whiteKeys.map((note) => (
          <PianoKey Svg={WhiteKeySvg} 
          key={note} 
          id={note} 
          className="flex-fill m-1"
          onPress={handlePressKey}
          />
        ))}

        {blackKeys.map(({ note, after }) => (
          <PianoKey Svg={BlackKeySvg}
            key={note}
            id={note}
            className="position-absolute m-0"
            style={{
              left: `${(after + 1) * whiteKeyWidth}%`,
              transform: "translateX(-50%)",
              width: `${whiteKeyWidth * 0.55}%`,
            }}
            onPress={handlePressKey}
          />
        ))}

      </Container>

      <Container className="d-flex justify-content-between align-items-center">
        <Button onClick={handleNavToSettings} className="text-start px-4" size="lg">
          Settings
        </Button>

        <h3>Score: {score}</h3>
      </Container>
    </Container>
  );
}