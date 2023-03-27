/* Context */
import { Card, Container, Row, Col } from "react-bootstrap";
import { useAuthContext } from "../../hooks/useAuthContext";

/* Styling */
import "./Home.css"


export default function Home() {

    const { state } = useAuthContext()

    return (
        <Container fluid className="home">
            <h1 className="home_title">Welcome { state.username } !</h1>
            <Row className="home_row">
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
    )
}