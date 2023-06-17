import React, { useContext, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap';
import { User } from '../../../../../context/userContext';
import { useParams } from 'react-router';
import { upload } from '@testing-library/user-event/dist/upload';

const RateModal = (props) => {
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);
    const params = useParams();
    const [user] = useContext(User);
    const [uploading, setUploading] = useState(false);
    const [grade, setGrade] = useState("3.0");

    const handleClose = () => {
        props.setModalShow(false);
    }

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value ?? '');
        setError(null);
    }

    const handleGradeSubmit = (event) => {
        event.preventDefault();

        if(uploading)
            return;
    
        if(!grade)
        {
            setError({
                active: true,
                message: 'Nie wybrano oceny'
            });
            return;
        }

        setUploading(true);

        fetch('http://localhost:8000/report/setgrade', {
          method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + user?.token,
                'Content-Type': 'application/json',
            },
          body: JSON.stringify({
            lecture_id: params.lectureID,
            task_id: params.taskID,
            user_id: params.userID,
            grade: grade,
            description: description ?? ''
          })
        })
          .then(response => response.json())
          .then(data => {
            setUploading(false);
            if(data?.status == 'error')
            {
                setError({
                    active: true,
                    message: data.message ?? 'Nieznany błąd'
                });
                return;
            }

            props.handleOnUpload();
            handleClose();
          })
          .catch(error => {
            setUploading(false);
            //console.log('Błąd podczas wysyłania formularza:', error?.message ?? 'Nieznany błąd');
          });
    };

    const handleGradeChange = (event) => {
        setGrade(event.target.value ?? '3.0');
        setError(null);
    }

    const isActive = props.modalShow;

    return (
        <Modal show={isActive} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Wystaw ocenę</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Ocena:</Form.Label>
                        <Form.Control as="select" value={grade} onChange={handleGradeChange}>
                            <option value="2.0">2.0</option>
                            <option value="3.0">3.0</option>
                            <option value="3.5">3.5</option>
                            <option value="4.0">4.0</option>
                            <option value="4.5">4.5</option>
                            <option value="5.0">5.0</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Komentarz:</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder='Wprowadź opcjonalny komantarz...' onChange={handleDescriptionChange} value={description}/>
                    </Form.Group>
                    {error?.active && <p className='text-danger text-right'>{error.message}</p>}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Zamknij
                </Button>
                <Button variant="primary" onClick={handleGradeSubmit} disabed={upload}>
                    {uploading ? 'Trwa przesyłanie...' : 'Dodaj'}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default RateModal