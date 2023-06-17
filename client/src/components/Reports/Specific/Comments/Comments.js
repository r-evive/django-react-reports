import React from 'react'
import { Table } from 'react-bootstrap'
import AddCommentModal from './AddModal/AddCommentModal'
import moment from 'moment'

const Comments = (props) => {

    const formatDate = (date) => {
        if (!date)
            return '-'
        return moment(date).format('DD.MM.YYYY HH:mm');
    }

    return (
        <>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Data:</th>
                        <th>Komenatarz:</th>
                    </tr>
                </thead>
                <tbody>
                    {props?.comments?.map((comment, index) => {
                        return (
                            <tr key={index}>
                                <td>{formatDate(comment.creationDate)}</td>
                                <td>{comment.text}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            {props?.showAddCommentModal && <AddCommentModal modalShow={props.showAddCommentModal} setModalShow={props.setShowAddCommentModal} handleOnUpload={props.handleOnUpload}/>}
        </>
      )
}

export default Comments