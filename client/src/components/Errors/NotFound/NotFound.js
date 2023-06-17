import React from 'react'
import { Col, Row } from 'react-bootstrap'

const NotFound = () => {
  return (
    <Row>
        <Col className='d-flex justify-content-center flex-wrap text-center align-items-center mt-5'>
            <h1 className="w-100 mt-5">404</h1>
            <h4 className="w-100">Strona nie istnieje!</h4>
        </Col>
    </Row>
  )
}

export default NotFound