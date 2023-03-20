/* Context */
import { Card, Container, Row, Col } from "react-bootstrap";
import { useAuthContext } from "../../hooks/useAuthContext";

/* Styling */
import "./Home.css"

export default function Home() {

    const { state } = useAuthContext()

    return (
        <div className="home">
            
            <Container fluid>
                <h1>Welcome { state.username } !</h1>
                <Row>
                    <Col className="home_col">
                        <Card className="home_card">
                            <Card.Header>Any idea here</Card.Header>
                            <Card.Body>
                                <>
                                    <p>Random place holder</p>
                                </>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col className="home_col">
                        <Card className="home_card">
                            <Card.Header>XXX stats</Card.Header>
                            <Card.Body>
                                <>
                                    <p>Game played</p>
                                    <p>Win rate</p> 
                                    <p>Show some graph</p>
                                    <p>Machine Learning?</p> 
                                </>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

        </div>
    )
}