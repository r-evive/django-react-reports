import React from 'react'
import { Table } from 'react-bootstrap'
import AddFileModal from './AddModal/AddFileModal'
import moment from 'moment'
import { useNavigate } from 'react-router'

const Files = (props) => {
    const formatDate = (date) => {
        if (!date)
            return '-'
        return moment(date).format('DD.MM.YYYY HH:mm');
    }

    const downloadFile = (id, fileName) => {
        //window.open(`http://localhost:8000/report/download/${id}/${fileName}`)

        const link = document.createElement("a");
        link.href = `http://localhost:8000/report/download/${id}/${fileName}`;
        link.setAttribute("download", "file");
        document.body.appendChild(link);
        link.click();
    }

    return (
        <>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Data:</th>
                        <th>Nazwa pliku:</th>
                        <th>Opis:</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {props?.files?.map((file, index) => {
                        return (
                            <tr key={index}>
                                <td>{formatDate(file.creationDate)}</td>
                                <td>{file.name}</td>
                                <td>{file.description}</td>
                                <td className="text-center">
                                    <i className="bi bi-download text-primary pointer" onClick={() => downloadFile(file.id, file.path)}></i>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>

            {props.showAddFileModal && <AddFileModal modalShow={props.showAddFileModal} setModalShow={props.setShowAddFileModal} handleOnUpload={props.handleOnUpload}/>}
        </>
    )
}

export default Files