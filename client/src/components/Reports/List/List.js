import React from 'react'
import { Table } from 'react-bootstrap'
import { Header, Icon } from './List.styled'
import SingleReport from './SingleReport/SingleReport'

const List = (props) => {

    const generateList = () => {
        if(!props?.lecture?.reports.length) {
            return <SingleReport empty />
        }

        return <SingleReport lecture={props.lecture} />
    }

  return (
    <>
        <Header><Icon className="bi bi-book"/>{props?.lecture?.lecture_name ?? ''}</Header>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Temat:</th>
                    <th>Prowadzący:</th>
                    <th className='text-center'>Termin:</th>
                    <th className='text-center'>Status:</th>
                </tr>
            </thead>
            <tbody>
                {generateList()}
            </tbody>
        </Table>
    </>
  )
}

export default List