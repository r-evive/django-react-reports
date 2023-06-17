import React from 'react'
import { Arrow, GoBackLink } from './GoBack.styled'
import { useNavigate } from "react-router-dom";


const GoBack = (props) => {
    const history = useNavigate();

    const handleOnClick = () => {
        history(-1);
    }

    return (
        <>
            <GoBackLink onClick={handleOnClick}><Arrow direction='left'/>Powrót</GoBackLink>
        </>
  )
}

export default GoBack