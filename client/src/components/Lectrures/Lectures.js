import React, { useContext, useEffect, useState } from 'react'
import { ActionsTH, Header, HeaderWrapper, StyledButton, StyledLink } from './Lectures.styled'
import { Button, Col, Row, Table } from 'react-bootstrap'
import AddModal from './AddModal/AddModal'
import { User } from '../../context/userContext'
import { Link } from 'react-router-dom'
import useAdmin from '../../hooks/useAdmin'

const Lectures = () => {
    const [user] = useContext(User);
    const [modalShow, setModalShow] = useState(false);

    const isAdmin = useAdmin();
    const [lectures, setLectures] = useState([]);

    const handleLecturesFetch = async () => {
        await fetch('http://localhost:8000/lectures/get', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + user?.token,
                'Content-Type': 'application/json',
            },
        }).then(response => response.json()).then(data => {
            setLectures(data);
        })
    }

    const handleAddClick = () => {
        setModalShow(true);
    }


    const handleLectureDelete = async (id) => {
        if (window.confirm('Czy na pewno chcesz usunąć ten przedmiot?')) {
            await fetch('http://localhost:8000/lectures/delete', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + user?.token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: id
                })
            }).then(response => response.json()).then(data => {
                console.log(data);
                handleLecturesFetch();
            }).catch((error) => {
                console.error('Error:', error);
                alert('Wystąpił błąd podczas usuwania przedmiotu!');
            });
        }
    }

    const handleLectureJoin = async (id) => {
        await fetch('http://localhost:8000/lectures/join', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + user?.token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id
            })
        }).then(response => response.json()).then(data => {
            console.log(data);
            handleLecturesFetch();
        }).catch((error) => {
            console.error('Error:', error);
            alert('Wystąpił błąd podczas dołączania!');
        });
    }

    useEffect(() => {
        if (user.logged)
            handleLecturesFetch();
    }, [user.logged, modalShow])

    return (
        <>
            <HeaderWrapper>
                <Col sm={9}>
                    <Header>Dostępne zajęcia:</Header>
                </Col>
                {isAdmin &&
                <Col sm={3} className='d-flex justify-content-end'>
                    <Button variant="primary" block onClick={handleAddClick}><i className="bi bi-plus-lg icon_margin-right"></i>Dodaj</Button>
                </Col>
                }
            </HeaderWrapper>

            <Row className="mt-5">
                <Col>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nazwa przedmiotu:</th>
                                <th>Prowadzący:</th>
                                <ActionsTH></ActionsTH>
                            </tr>
                        </thead>
                        <tbody>
                            {lectures.map((lecture, index) => (
                                <tr key={lecture.id}>
                                    <td>{index + 1}</td>
                                    <td><StyledLink to={`/zajecia/${lecture.id}`} >{lecture.name}</StyledLink></td>
                                    <td>{lecture.owner_name}</td>
                                    <td className="text-center">
                                        {!lecture.joined && !isAdmin ? <StyledButton variant="primary" size="sm" onClick={() => handleLectureJoin(lecture.id)}><i className="bi bi-person-plus-fill icon_margin-right"></i>Dołącz</StyledButton> : null}
                                        {isAdmin && <StyledButton variant="danger" size="sm" onClick={() => handleLectureDelete(lecture.id)}><i className="bi bi-trash3 icon_margin-right"></i>Usuń</StyledButton>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            
            {modalShow ? <AddModal modalShow={modalShow} setModalShow={setModalShow} />: null}
        </>
    )
}

export default Lectures