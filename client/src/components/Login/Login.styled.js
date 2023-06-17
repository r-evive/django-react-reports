import { Container, Image } from 'react-bootstrap';
import styled from 'styled-components';

export const FluidLoginContainer = styled(Container)`
    height: 100%;
    background: url('bg.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
`

export const LoginContainer = styled.div`
    width: 100%;
    background-color: red;
    height: 500px;
`

export const ImageContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 30%;
`

export const StyledImage = styled(Image)`
    max-height: 100px;
    height: 100%;
    object-fit: contain;
    object-position: center;
    margin-bottom: 50px;
`

export const Error = styled.div`
    width: 100%;
    height: 22px;
    color: #ff0000;
    font-size: 14px;
`