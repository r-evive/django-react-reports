import React, { useContext, useEffect, useState } from 'react'
import { Card, Col, Container, Form, Image, Row } from 'react-bootstrap'
import { Error, FluidLoginContainer, ImageContainer, StyledImage } from './Login.styled'
import { User } from '../../context/userContext';
import { useNavigate } from 'react-router';


const Login = () => {
    let [user, setUser] = useContext(User);
    let [login, setLogin] = useState('');
    let [password, setPassword] = useState('');
    const navigation = useNavigate();

    let [error, setError] = useState({
        active: false, 
        message : ''
    });


    const fetchToken = () => {
        return fetch('http://localhost:8000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: login, password: password }),
        })
        .then(response => {
            if(response.ok){
                return response.json();
            }

            return Promise.reject(response);
        }).catch((error) => {
            if(error.status === 401)
                setError({active: true, message: 'Nieprawidłowy login lub hasło!'})
            else
                setError({active: true, message: 'Nieznany błąd!'})
        })
    }

    const fetchUserData = (token) => {
        return fetch('http://localhost:8000/login/get_user_details', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if(response.ok){
                return response.json();
            }
            return Promise.reject(response);
        }).catch((error) => {
            if(error.status === 401)
                setError({active: true, message: 'Nieprawidłowy login lub hasło!'})
            else
                setError({active: true, message: 'Nieznany błąd!'})
        })
    }



    const checkIfPreviouslyLogged = async() => {
        let reportData = localStorage.getItem('reportData');
        if(reportData){
            reportData = JSON.parse(reportData);

            let userData = await fetchUserData(reportData.token);
            setUser(prev => ({...prev, logged: true, token: reportData.token, data: userData}));
            navigation('/');
        }
    }

    const handleLogin = async (event) => {
        event.preventDefault();

        let tokenResult = await fetchToken();

        if(tokenResult?.access){
            let userData = await fetchUserData(tokenResult.access);
            setUser(prev => ({...prev, logged: true, token: tokenResult.access, data: userData}));
            localStorage.setItem('reportData', JSON.stringify({token: tokenResult.access}));
            navigation('/');
        }
    }


    const handleLoginChange = (e) => {
        resetError();
        setLogin(e.target.value ? e.target.value : '');
    }

    const handlePasswordChange = (e) => {
        resetError();
        setPassword(e.target.value ? e.target.value : '');
    }

    const resetError = () => {
        setError({active: false, message: ''})
    }

    useEffect(() => {
        checkIfPreviouslyLogged();
    }, [])

    return (
        <FluidLoginContainer fluid>
            <Container fluid="md">
                <Row className='row justify-content-sm-center h-100'>
                    <Col xxl={4} lg={5} md={6} sm={8} xs={12} className="">
                        <ImageContainer>
                            <StyledImage src="./logo.png" alt="logo" />
                        </ImageContainer>
                        <Card className='shadow-lg'>
                            <Card.Body className='p-4'>
                                <Card.Title className='mb-4'>
                                    Logowanie
                                </Card.Title>
                                <Form onSubmit={handleLogin}>
                                    <Form.Group className="mb-3" controlId="login">
                                        <Form.Label>Login:</Form.Label>
                                        <Form.Control type="text" onChange={handleLoginChange} value={login} required/>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="password">
                                        <Form.Label>Hasło</Form.Label>
                                        <Form.Control type="password" onChange={handlePasswordChange} value={password} required/>
                                    </Form.Group>
                                    <Error>{error.active ? error.message : ''}</Error>
                                    <button className='btn btn-primary w-100 mb-3 mt-3' type='submit'>Zaloguj</button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </FluidLoginContainer>
    )
}

export default Login