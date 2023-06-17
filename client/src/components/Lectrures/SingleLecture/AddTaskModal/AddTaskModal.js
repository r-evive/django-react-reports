import React, { useContext, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap';
import { User } from '../../../../context/userContext';
import moment from 'moment';

const AddTaskModal = (props) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState(moment().add(1, 'months').format('YYYY-MM-DD'));

    const [user] = useContext(User);

    const handleOpen = () => {
        props.setModalShow(true);
    }

    const handleClose = () => {
        props.setModalShow(false);
    }

    const handleNameChange = (event) => {
        setName(event.target.value ?? '');
    }

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value ?? '');
    }

    const handleDueDateChange = (event) => {
        setDueDate(event.target.value ? moment(event.target.value).format('YYYY-MM-DD') : moment().add(1, 'months').format('YYYY-MM-DD'));
    }


    const handleAddTaskRequest = async () => {
        await fetch('http://localhost:8000/tasks/add', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + user?.token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                description: description,
                lecture: props.lectureId,
                deadline: dueDate,
            })
        }).then(response => response.json()).then(data => {
            console.log(data);
            props.setModalShow(false);
        }).catch((error) => {
            console.error('Error:', error);
            alert('Wystąpił błąd podczas dodawania zadania!');
        });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        handleAddTaskRequest();
    }

    const isActive = props.modalShow;

    return (
        <Modal show={isActive} onHide={handleClose}>
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Dodaj zadanie</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Nazwa:</Form.Label>
                        <Form.Control type="text" placeholder="Wprowadź nazwę zadania" onChange={handleNameChange} value={name} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Opis:</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder='Wprowadź opis zadania' onChange={handleDescriptionChange} value={description} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Termin:</Form.Label>
                        <Form.Control type="date" onChange={handleDueDateChange} value={dueDate} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Zamknij
                    </Button>
                    <Button variant="primary" type="submit">
                        Dodaj
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default AddTaskModal