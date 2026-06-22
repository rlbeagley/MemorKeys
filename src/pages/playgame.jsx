import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react'
import { FaPlay, FaEye, FaHome, FaRedo } from "react-icons/fa";
import { TbHandClick } from "react-icons/tb";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import PianoKey from '../components/PianoKey';

import cNote from '../assets/audio/c.mp3';
import aNote from '../assets/audio/a.mp3';
import aSharpNote from '../assets/audio/aSharp.mp3';
import bNote from '../assets/audio/b.mp3';
import dNote from '../assets/audio/d.mp3';
import dSharpNote from '../assets/audio/dSharp.mp3';
import eNote from '../assets/audio/e.mp3';
import fNote from '../assets/audio/f.mp3';
import gNote from '../assets/audio/g.mp3';
import gSharpNote from '../assets/audio/gSharp.mp3';

// TODO: finish report

function MessageHeader({gameStage}) {
    if (gameStage == 'awaitingStart') {
      return (
        <div className="d-flex flex-column justify-content-center align-items-center">
          <h2 className="d-flex justify-content-center">
            <FaPlay style={{ fontSize: "1.5rem" }} className="me-3 light-icon"/>
          Click Anywhere To Start
          </h2>
          <h4>Have fun!</h4>
        </div>
      );
    }
    else if (gameStage == 'demo') {
      return (
      <div className="d-flex flex-column justify-content-center align-items-center">
        <h2 className="d-flex justify-content-center">
          <FaEye style={{ fontSize: "1.5rem" }} className="me-3 light-icon"/>
          Memorize the Sequence
        </h2>
        <h4>Get ready to play it back.</h4>
      </div>
      );

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
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("highScore");
    return saved ? Number(saved) : 0;
  });
  
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

  // I couldn't find mp3's of each note... some wont have sounds...
  const noteSounds = {
  "A": aNote,
  "A#": aSharpNote,
  "B": bNote,
  "C": cNote,
  "D": dNote,
  "D#": dSharpNote,
  "E": eNote,
  "F": fNote,
  "G": gNote,
  "G#": gSharpNote
  };

  const difficultyMultipliers = [1,0.5,0.25];


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
    const newPattern = [...desiredKeys, randomGenerateNote()];
    setDesiredKeys(newPattern);
    console.log("We are in the demo, this is the new desired pattern: " + newPattern.toString());

    let difficultyMultiplier = 0;

    if (level == 1) {
      difficultyMultiplier = difficultyMultipliers[0];
    } else if (level==2) {
      difficultyMultiplier = difficultyMultipliers[1];
    } else {
      difficultyMultiplier = difficultyMultipliers[2];
    }

    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    async function playDemo() {
      for (const note of newPattern) {
        await delay(600 * difficultyMultiplier);
        setActiveNote(note);
        await delay(600 * difficultyMultiplier);
        setActiveNote(null);
        await delay(400 * difficultyMultiplier);
      }
      await delay(1200);
      setGameStage('play'); // sequence finished, hand control to the user
    }

    playDemo(); // call playDemo
  }, [gameStage]);

  useEffect(() => {
    if (!activeNote) return; // dont play null
    if (activeNote in noteSounds) {
      const audio = new Audio(noteSounds[activeNote]);
      audio.play();
    }
    
  }, [activeNote]);

  // Compare user input to desired keys
  useEffect(() => {
    if (gameStage !== "play") return; // only run in play stage.
    console.log("These are the user's keys: "+ clickedKeys.toString());

    // check if length of clickedKeys = length of desired key, check if arrays are equal in values.
    if (clickedKeys.length == desiredKeys.length) {
      if (clickedKeys.toString() == desiredKeys.toString()) {
        setScore(score+1);
        setClickedKeys([]);
        setGameStage('demo');
        return;
      } else {
        setGameStage('end');
        return;
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

  // highscore setter
  useEffect(() => {
    if (gameStage === "end") {
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("highScore", score);
      }
    }
  }, [gameStage]);

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
  }

  const handleReleaseKey = (note) => {
    if (gameStage !== 'play') return;
    setActiveNote(null);
  }

  const handleRestartGame = () => {
    setScore(0);
    setClickedKeys([]);
    setDesiredKeys([]);
    setActiveNote(null);
    setGameStage('awaitingStart');
  }

  if (gameStage == 'end') { 
    return(
    <Container className="d-flex vh-100 flex-column justify-content-center align-items-between vw-75">
      <h1>Game Over</h1>
      <div className="d-flex justify-content-between">
        <h3>Score:</h3>
        <h3>{score}</h3>
      </div>
      <div className="d-flex justify-content-between">
        <h3>Highscore:</h3>
        <h3>{highScore}</h3>
      </div>
      <div className="d-flex justify-content-between">
        <Button size="lg" onClick={handleNavToSettings} >
          <FaHome style={{ fontSize: "1.5rem" }} className="me-2"/>
          Home
        </Button>
        <Button size="lg" onClick={handleRestartGame}>
          <FaRedo style={{ fontSize: "1.5rem" }} className="me-3"/>
          Play Again
        </Button>
      </div>
    </Container>); 
  } else { // game stage 
      return (
      <Container className="column-container my-3 vw-75 vh-100" onClick={handleStartGame}>
        <MessageHeader gameStage={gameStage}/>
        <Container className="position-relative d-flex align-items-start my-3 mx-5 p-2 vw-75" style={{backgroundColor: '#8D81CA'}}>
          {whiteKeys.map((note) => (
            <PianoKey
              key={note}
              id={note}
              className="white-key flex-fill mx-1"
              onPress={handlePressKey}
              onRelease={handleReleaseKey}
              isActive={activeNote === note}
              showLabel={labels}
            />
          ))}

          {blackKeys.map(({ note, after }) => (
            <PianoKey
              key={note}
              id={note}
              className="black-key position-absolute"
              style={{
                left: `${(after + 1) * whiteKeyWidth}%`,
                transform: "translateX(-50%)",
                width: `${whiteKeyWidth * 0.55}%`,
              }}
              onPress={handlePressKey}
              onRelease={handleReleaseKey}
              isActive={activeNote === note}
              showLabel={labels}
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

}
