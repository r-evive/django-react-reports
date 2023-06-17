import React, { useContext, useEffect, useState } from 'react'
import { AddButton, AddReportButton, Block, BlockHeader, DeadLine, Description, Header, HeaderWrapper, RateButton, RateIcon, Wrapper } from './Specific.styled'
import { User } from '../../../context/userContext';
import { useParams } from 'react-router';
import NotFound from '../../Errors/NotFound/NotFound';
import { Col, Form } from 'react-bootstrap';
import moment from 'moment';
import Files from './Files/Files';
import Comments from './Comments/Comments';
import { Arrow, GoBackLink } from '../../../GlobalStyles';
import GoBack from '../../Utils/GoBack/GoBack';
import Rate from './Rate/Rate';
import useAdmin from '../../../hooks/useAdmin';

const Specfic = () => {
    const routeParams = useParams();
    let [user] = useContext(User);
    let [error, setError] = useState(false)
    let [report, setReport] = useState(null);
    let [showAddFileModal, setShowAddFileModal] = useState(false);
    let [showAddCommentModal, setShowAddCommentModal] = useState(false);
    let isAdmin = useAdmin();

    const fetchDetails = async () => {
        await fetch('http://localhost:8000/report/details', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: routeParams?.userID,
                lecture_id: routeParams?.lectureID,
                task_id: routeParams?.taskID
            })
        })
            .then(res =>{
                if(res.status != 200) {
                    throw new Error('Not found');
                }
                return res.json();
            })
            .then(data => {
                setReport(data);
            })
            .catch(err => {
                setError(true);
                console.log(err);
            })
    }

    const formatDeadline = (deadline) => {
        if(!deadline)
            return '-'
        return moment(deadline).format('DD.MM.YYYY');
    }

    useEffect(() => {
        if (user.logged) {
            fetchDetails();
        }

    }, [user.logged]);


    const handleAddReport = () => {
        setShowAddFileModal(true);
    }

    const handleAddComment = () => {
        setShowAddCommentModal(true);
    }

    const getFloatGrade = (grade) => {
        if(!grade)
            return 'Nie oceniono';

        return parseFloat(grade, 10).toFixed(1);
    }



    return (
        <>
            {(() => {
                if (error) {
                    return <NotFound />
                }

                if (!report) {
                    return <></>
                }

                return (
                    <>
                        <GoBack />
                        <HeaderWrapper>
                            <Header>{report?.lecture_name ?? ''}: {report?.name ?? ''}{isAdmin && <Rate handleOnUpload={fetchDetails}/>}</Header>
                            <Description>{report?.description ?? ''}</Description>
                        </HeaderWrapper>
                        <Form className="mt-2">
                            <Wrapper>
                                <Col md={3} sm={6} xs={12}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Student:</Form.Label>
                                        <Form.Control type="text" disabled value={report?.student_name ?? ''} />
                                    </Form.Group>
                                </Col>
                                <Col md={3} sm={6} xs={12}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Prowadzący:</Form.Label>
                                        <Form.Control type="text" disabled value={report?.lecture_owner ?? ''} />
                                    </Form.Group>
                                </Col>
                                <Col md={3} sm={6} xs={12}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Termin oddania:</Form.Label>
                                        <Form.Control type="text" disabled value={formatDeadline(report?.deadline)} />
                                    </Form.Group>
                                </Col>
                                <Col md={3} sm={6} xs={12}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Ocena:</Form.Label>
                                        <Form.Control type="text" disabled value={getFloatGrade(report?.report?.grade)}/>
                                    </Form.Group>
                                </Col>
                            </Wrapper>
                            <Block>
                                <Col xs={12} sm={8} md={10} lg={10}>
                                    <BlockHeader>Przesłane pliki:</BlockHeader>
                                </Col>
                                {!isAdmin &&
                                <Col xs={12} sm={4} md={2} lg={2} className="text-end">
                                    <AddButton variant="outline-primary" onClick={handleAddReport}><i className="bi bi-plus-lg icon_margin-right text-primary"></i>Dodaj sprawozdanie</AddButton>
                                </Col>
                                }
                                <Col xs={12}>
                                    <Files showAddFileModal={showAddFileModal} setShowAddFileModal={setShowAddFileModal} files={report?.files} handleOnUpload={fetchDetails}/>
                                </Col>
                            </Block>
                            <Block>
                                <Col xs={12} sm={8} md={10} lg={10}>
                                    <BlockHeader>Komenatrze prowadzącego:</BlockHeader>
                                </Col>
                                {isAdmin &&
                                <Col xs={12} sm={4} md={2} lg={2} className="text-end">
                                    <AddButton variant="outline-primary" onClick={handleAddComment}><i className="bi bi-plus-lg icon_margin-right text-primary"></i>Dodaj komenatarz</AddButton>
                                </Col>}
                                <Col xs={12}>
                                    <Comments showAddCommentModal={showAddCommentModal} setShowAddCommentModal={setShowAddCommentModal} comments={report?.comments} handleOnUpload={fetchDetails}/>
                                </Col>

                            </Block>
                        </Form>
                    </>
                )
            })()}
        </>
    )
}

export default Specfic