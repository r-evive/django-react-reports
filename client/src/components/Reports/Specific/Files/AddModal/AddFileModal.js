import React, { useContext, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap';
import { User } from '../../../../../context/userContext';
import { useParams } from 'react-router';
import { upload } from '@testing-library/user-event/dist/upload';

const AddFileModal = (props) => {
    const [description, setDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
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

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setError(null);
      };
    

    const handleReportUploadSubmit = (event) => {
        event.preventDefault();

        if(uploading)
            return;
    
        if(!selectedFile)
        {
            setError({
                active: true,
                message: 'Nie wybrano pliku'
            });
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('description', description ?? '');
        formData.append('lecture_id', params.lectureID);
        formData.append('task_id', params.taskID);
        
        setUploading(true);

        fetch('http://localhost:8000/report/upload', {
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
                <Modal.Title>Dodaj sprawozdanie</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Plik:</Form.Label>
                        <Form.Control type="file" placeholder="Wybierz plik" onChange={handleFileChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Opis:</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder='Wprowadź opis...' onChange={handleDescriptionChange} value={description}/>
                    </Form.Group>
                    {error?.active && <p className='text-danger text-right'>{error.message}</p>}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Zamknij
                </Button>
                <Button variant="primary" onClick={handleReportUploadSubmit} disabed={upload}>
                    {uploading ? 'Trwa przesyłanie...' : 'Dodaj'}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AddFileModal