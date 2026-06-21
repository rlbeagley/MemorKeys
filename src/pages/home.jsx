import { useState } from 'react'
import { FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';

export default function Home() {
    const [labels, setLabels] = useState(false);
    const [level, setLevel] = useState(1);
    const navTo = useNavigate();

    // sends form submission info to game page
    function handleSubmit(e) {
        e.preventDefault();
        navTo('/play', { state: { level, labels }});
    }

    return (
        <Container className="column-container">
            <h4 className="mt-3">Welcome to</h4>
            <h1 className="mb-4">MemorKeys</h1>
            <Form onSubmit={handleSubmit}>

            <Form.Group className="mb-3 d-flex flex-column align-items-center">
                <Form.Label>Level</Form.Label>
                <div>
                    <ToggleButtonGroup
                    type="radio"
                    name="level"
                    value={level}
                    onChange={setLevel}
                    className="w-100"
                    >
                <ToggleButton id="level-easy" value={1}>
                    Easy
                </ToggleButton>
                <ToggleButton id="level-normal" value={2}>
                    Normal
                </ToggleButton>
                <ToggleButton id="level-hard" value={3}>
                    Hard
                </ToggleButton>
                </ToggleButtonGroup>
            </div>
            </Form.Group>

            <Form.Group className="mb-3 d-flex flex-column align-items-center">
                <Form.Label>Show Piano Notes</Form.Label>
                <Form.Check 
                type="switch" 
                id="enable-annotated-notes"
                label={labels ? "On" : "Off"}
                checked={labels}
                onChange={(e) => setLabels(e.target.checked)}
                className="custom-toggle"/>
            </Form.Group>

            <Form.Group className="mb-3 d-flex flex-column align-items-center"> 
                <Button type="submit">
                <FaPlay className="me-2"/>
                Lets Begin!</Button>
            </Form.Group>
        </Form>
    </Container>
    

    );
}