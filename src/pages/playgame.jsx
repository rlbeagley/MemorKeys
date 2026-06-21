import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react'
import { FaPlay, FaEye } from "react-icons/fa";
import { TbHandClick } from "react-icons/tb";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import WhiteKeySvg from '../assets/imgs/white-key.svg?react';
import BlackKeySvg from '../assets/imgs/black-key.svg?react';
import PianoKey from '../components/PianoKey';

//TODO: replace SVGs with div blocks
// TODO: implement fail page
// TODO: add notes
//TODO: fix weird margin error
// TODO: finish report

function MessageHeader({gameStage}) {
    if (gameStage == 'awaitingStart') {
      return (<h2 className="d-flex justify-content-center">
        <FaPlay style={{ fontSize: "1.5rem" }} className="me-3 light-icon"/>
        Click Anywhere To Start
      </h2>);
    }
    else if (gameStage == 'demo') {
      return (<h2 className="d-flex justify-content-center">
        <FaEye style={{ fontSize: "1.5rem" }} className="me-3 light-icon"/>
        Memorize the Sequence
      </h2>);

    } else if (gameStage == 'play') {
      return (
        <div className="d-flex flex-column justify-content-center align-items-center">
          <h2 className="d-flex justify-content-center">
            <TbHandClick style={{ fontSize: "1.5rem" }} className="me-2 light-icon"/>
            Your Turn!
          </h2>
          <h4>Repeat the sequence.</h4>
        </div>
      );
    }
}

export default function Play() {
  const location = useLocation();
  const navTo = useNavigate();
  const { level, labels } = location.state || {};

  // states
  const [gameStage, setGameStage] = useState('awaitingStart'); // awaitingStart, demo, play, end
  const [score, setScore] = useState(0);
  const [clickedKeys, setClickedKeys] = useState([]);
  const [desiredKeys, setDesiredKeys] = useState([]);
  const [activeNote, setActiveNote] = useState(null); // to help enable and disable notes during demo

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

  const randomGenerateNote = () => {
    // 12 total numbers
    let newNote = Math.floor(Math.random() * (11 - 0 + 1));

    if (newNote <= 6) {
      return whiteKeys[newNote];
    }
    else {
      return blackKeys[newNote-7].note;
    }

  }

  // handle demo stage
  useEffect(() => {
    if (gameStage !== 'demo') return;
    console.log(gameStage);
    const newPattern = [...desiredKeys, randomGenerateNote()];
    setDesiredKeys(newPattern);
    console.log(newPattern);

    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    async function playDemo() {
      for (const note of newPattern) {
        await delay(500);
        setActiveNote(note);
        await delay(1000);
        setActiveNote(null);
        await delay(500);
      }
      setGameStage('play'); // sequence finished, hand control to the user
    }

    playDemo(); // call playDemo
  }, [gameStage]);

  // Compare user input to desired keys
  useEffect(() => {
    console.log(clickedKeys);
    if (gameStage !== "play") return; // only run in play stage.

    // check if length of clickedKeys = length of desired key, check if arrays are equal in values.
    if (clickedKeys.length == desiredKeys.length) {
      if (clickedKeys.toString() == desiredKeys.toString()) {
        setScore(score+1);
        setClickedKeys([]);
        setGameStage('demo');
      } else {
        setGameStage('end');
      }
    }

    let numKeysClicked = clickedKeys.length;
    let slicedDesiredKeys = desiredKeys.slice(0, numKeysClicked);

    if (clickedKeys.toString() !== slicedDesiredKeys.toString()) {
      setGameStage('end');
    }

    return;

    // Compare clickedKeys with desiredKeys
  }, [clickedKeys]);




  const handleNavToSettings = () => {
    navTo("/");
  };

  const handleStartGame = () => {
    if (gameStage == 'awaitingStart') {
      setGameStage('demo');
    }
  }

  const handlePressKey = (note) => {
    if (gameStage !== 'play') return;
    setActiveNote(note);
    setClickedKeys(prev => [...prev, note]);
    

    // add logic to check if this is equal to the array of desired keys.
    // if not, trigger end scene
    // if it is, increase score, trigger add new desired key, which will trigger a demo scene. 
  }

  const handleReleaseKey = (note) => {
    if (gameStage !== 'play') return;
    setActiveNote(null);
  }

  return (
    <Container className="column-container my-3" onClick={handleStartGame}>
        <MessageHeader gameStage={gameStage}/>
        
      
      <Container fluid className="position-relative d-flex align-items-start">
        {whiteKeys.map((note) => (
          <PianoKey Svg={WhiteKeySvg} 
          key={note} 
          id={note} 
          className="flex-fill m-1"
          onPress={handlePressKey}
          onRelease={handleReleaseKey}
          isActive={activeNote === note}
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
            onRelease={handleReleaseKey}
            isActive={activeNote === note}
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
