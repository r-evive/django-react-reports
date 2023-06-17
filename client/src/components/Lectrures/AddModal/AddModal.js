import React, { useContext, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap';
import { User } from '../../../context/userContext';

const AddModal = (props) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const [user] = useContext(User);

    const hanldeOpen = () => {
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


    const handleAddRequest = async () => {
        await fetch('http://localhost:8000/lectures/add', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + user?.token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                description: description, 
                owner: user?.data?.user_id
            })
        }).then(response => response.json()).then(data => {
            console.log(data);
            props.setModalShow(false);
        }).catch((error) => {
            console.error('Error:', error);
            alert('Wystąpił błąd podczas dodawania przedmiotu!');
        });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        handleAddRequest();
    }

    const isActive = props.modalShow;

    return (
        <Modal show={isActive} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Dodaj przedmiot</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Nazwa:</Form.Label>
                        <Form.Control type="text" placeholder="Wprowadź nazwę przedmiotu" onChange={handleNameChange} value={name}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Opis:</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder='Wprowadź opis przedmiotu' onChange={handleDescriptionChange} value={description}/>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Zamknij
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Dodaj
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AddModal