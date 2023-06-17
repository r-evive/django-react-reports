import React, { useContext, useState } from 'react'
import { Alert, Button, Card, Col } from 'react-bootstrap'
import { Cards, Name, Welcome } from './Main.styled'
import { User } from '../../context/userContext'
import { useNavigate } from 'react-router'
import useAdmin from '../../hooks/useAdmin'

const Main = () => {
    const [user] = useContext(User);
    const navigator = useNavigate();
    const isAdmin = useAdmin();

    const handleReportsClick = () => {
        if(isAdmin){
            navigator('/zajecia')
            return;
        }

        navigator('/sprawozdania')
    }

    const handleLecturesClick = () => {
        navigator('/zajecia')
    }

    return (
        <>
            <Welcome>Witaj<Name>{user?.data?.full_name ? ', ' + user.data.full_name + '!': '!'}</Name></Welcome>

            <Alert variant="success" className="mt-4">
                Brak nowych powiadomień!
            </Alert>

            <Cards>
                <Col md={6} xs={12} className="d-flex align-items-stretch">
                    <Card className="mt-3 pointer" onClick={handleReportsClick}>
                        <Card.Img variant="" src="1.jpg" />
                        <Card.Body>
                            <Card.Title>Sprawozdania</Card.Title>
                            <Card.Text>
                                {isAdmin ? 'Przeglądaj sprawozdania studentów' :'Dodaj lub przeglądaj swoje sprawozdania!'}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} xs={12} className="d-flex align-items-stretch">
                    <Card className="mt-3 pointer" onClick={handleLecturesClick}>
                        <Card.Img variant="" src="3.jpg" />
                        <Card.Body>
                            <Card.Title>Zajęcia</Card.Title>
                            <Card.Text>
                                {isAdmin ? 'Zarządzaj dostępnymi zajęciami' :'Dołącz do grup zajęciowych!'}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Cards>
        </>
    )
}

export default Main