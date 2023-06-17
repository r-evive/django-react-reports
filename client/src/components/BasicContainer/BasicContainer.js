import React from 'react'
import { Container } from 'react-bootstrap'
import Navigation from '../Navigation/Navigation'
import { Footer, Wrapper } from './BasicContainer.styled'

const BasicContainer = (props) => {
  return (
    <Container fluid>
        {props.hideNavigation ? null : <Navigation/>}
        <Container>
            <Wrapper>
                {props.children}
            </Wrapper>
            <Footer/>
        </Container>
    </Container>
  )
}

export default BasicContainer