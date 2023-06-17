import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { User } from '../../../context/userContext';
import NotFound from '../../Errors/NotFound/NotFound';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { ActionTH, AddTaskButton, Description, Details, Header, HeaderWrapper, Members, MembersHeader, Tasks, TasksHeader } from './SingleLecture.styled';
import moment from 'moment/moment';
import AddTaskModal from './AddTaskModal/AddTaskModal';
import GoBack from '../../Utils/GoBack/GoBack';
import MembersList from './MembersList/MembersList';
import useAdmin from '../../../hooks/useAdmin';

const SingleLecture = () => {
    const routeID = useParams();
    const [user] = useContext(User);
    const [lecture, setLecture] = useState(null);
    const [error, setError] = useState(false);
    let isAdmin = useAdmin();

    const [modalShow, setModalShow] = useState(false);

    const handleAddClick = () => {
        setModalShow(true);
    }

    const fetchLecture = async () => {
        fetch('http://localhost:8000/lectures/get_single', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + user?.token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: routeID.id })
        }).then(response => response.json()).then(data => {
            console.log(data);
            setLecture(data);
        }).catch((error) => {
            console.error('Error:', error);
            setError(true);
        });
    }

    const handleDeleteTask = async (id) => {
        if (window.confirm('Czy na pewno chcesz usunąć to zadanie?')) {
            await fetch('http://localhost:8000/tasks/delete', {
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
                fetchLecture();
            }).catch((error) => {
                console.error('Error:', error);
                alert('Wystąpił błąd podczas usuwania zadania!');
            });
        }
    }

    useEffect(() => {
        if (user?.logged)
            fetchLecture();
    }, [user.logged]);

    useEffect(() => {
        fetchLecture();
    }, [modalShow]);

    return (
        <>
            {(() => {
                if (error) {
                    return <NotFound />
                }

                if(!lecture)
                    return <></>

                return (
                    <>
                    <GoBack/>
                    <HeaderWrapper>
                        <Col>
                            <Header>Przedmiot: {lecture.name ? lecture.name : ''}</Header>
                            <Description>{lecture.description ? lecture.description : ''}</Description>
                        </Col>
                    </HeaderWrapper>
                    <Form className="mt-5">
                        <Details>
                            <Col xs={12} sm={6} md={4} lg={3}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Prowadzący:</Form.Label>
                                    <Form.Control type="text" disabled value={lecture.owner_name ?? ''} />
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={6} md={4} lg={3}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Data utworzenia:</Form.Label>
                                    <Form.Control type="text" disabled value={lecture.created ? moment(lecture.created).format("DD-MM-YYYY HH:mm"): '---'} />
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={6} md={4} lg={3}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Uczestnicy:</Form.Label>
                                    <Form.Control type="text" disabled value={0} />
                                </Form.Group>
                            </Col>
                        </Details>
                        <Tasks>
                            <Col xs={12} sm={8} md={10} lg={10}>
                                <TasksHeader>Zadania:</TasksHeader>
                            </Col>
                            {isAdmin &&
                            <Col xs={12} sm={4} md={2} lg={2} className="text-end">
                                <AddTaskButton variant="outline-primary" onClick={handleAddClick}><i className="bi bi-plus-lg icon_margin-right text-primary"></i>Dodaj zadanie</AddTaskButton>
                            </Col>}

                            <Col xs={12} sm={12} md={12} lg={12}>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Nazwa zadania:</th>
                                            <th>Termin:</th>
                                            <th>Utworzone:</th>
                                            {isAdmin && <ActionTH></ActionTH>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lecture?.tasks?.map((task, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{task.name}</td>
                                                    <td>{moment(task.deadline).format("DD-MM-YYYY")}</td>
                                                    <td>{moment(task.created).format("DD-MM-YYYY HH:mm")}</td>
                                                    {isAdmin &&<td className="text-center pointer" onClick={() => handleDeleteTask(task.id)}><i className="bi bi-trash3 text-danger"></i></td>}
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                            </Col>
                        </Tasks>
                        {isAdmin &&
                        <Members>
                            <MembersHeader>Uczestnicy:</MembersHeader>
                            <MembersList/>
                        </Members>}
                        
                    </Form>
                    {modalShow && isAdmin? <AddTaskModal modalShow={modalShow} setModalShow={setModalShow} lectureId={routeID.id} />: null}
                    </>
                )
            })()}
        </>
    )
}

export default SingleLecture