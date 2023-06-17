import React, { useContext, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap';
import { User } from '../../../../../context/userContext';
import { useParams } from 'react-router';
import { upload } from '@testing-library/user-event/dist/upload';

const AddCommentModal = (props) => {
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);
    const params = useParams();

    const [user] = useContext(User);
    const [uploading, setUploading] = useState(false);

    const handleClose = () => {
        props.setModalShow(false);
    }

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value ?? '');
        setError(null);
    }


    const handleCommentUploadSubmit = (event) => {
        event.preventDefault();

        if(uploading)
            return;
    
        if(!description || description.length < 1)
        {
            setError({
                active: true,
                message: 'Nie podano treści komentarza'
            });
            return;
        }

        const formData = new FormData();
        formData.append('description', description ?? '');
        formData.append('lecture_id', params.lectureID);
        formData.append('task_id', params.taskID);
        formData.append('user_id', params.userID);
        
        setUploading(true);

        fetch('http://localhost:8000/comments/add', {
          method: 'POST',
            headers: {
                'Authorization': `Bearer ${user.token}`,
            },
          body: formData
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

    const isActive = props.modalShow;

    return (
        <Modal show={isActive} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Dodaj komentarz</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Opis:</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder='Wprowadź treść...' onChange={handleDescriptionChange} value={description}/>
                    </Form.Group>
                    {error?.active && <p className='text-danger text-right'>{error.message}</p>}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Zamknij
                </Button>
                <Button variant="primary" onClick={handleCommentUploadSubmit} disabed={upload}>
                    {uploading ? 'Trwa przesyłanie...' : 'Dodaj'}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AddCommentModal