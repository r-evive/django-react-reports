import React from 'react'
import { useContext } from 'react';
import { useEffect } from 'react'
import { User } from '../../../../context/userContext';
import { useNavigate, useParams } from 'react-router';
import { useState } from 'react';
import { UserWrapper, Username } from './MembersList.styled';
import { Badge, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const MembersList = () => {
    const [user] = useContext(User);
    const routeID = useParams();
    const navigator = useNavigate();
    const [data, setData] = useState([]);

    const fetchMembers = async () => {
        fetch('http://localhost:8000/lectures/members', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + user?.token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ lecture_id: routeID.id })
        }).then(response => response.json()).then(data => {
            console.log(data);
            setData(transformData(data));
        }).catch((error) => {
            console.error('Error:', error);
        });
    }

    const transformData = (data) => {
        data.forEach((member) => {
            member?.tasks?.forEach((task) => {
                let properReport = member?.reports?.find((report) => report?.taskID === task.id);
                task.report = properReport ? properReport : null;
            });

            delete member.reports;
        });
        console.log(data);
        return data;
    }

    const getFloatGrade = (grade) => {
        if(!grade)
            return '---';

        return parseFloat(grade, 10).toFixed(1);
    }


    const getTaskStatus = (task) => {
        if(!task?.report)
            return <Badge className="bg-danger">Nie przesłano</Badge>

        if(task?.report?.grade){
            if(task?.report?.grade == "2.0")
                return <Badge className="bg-danger">Ocena: {getFloatGrade(task?.report?.grade)}</Badge>
            return <Badge className="bg-success">Ocena: {getFloatGrade(task?.report?.grade)}</Badge>
        }
        
        if(task?.report?.files){
            try{
                let files = JSON.parse(task?.report?.files);
                if(files?.files?.length > 0)
                    return <Badge className="bg-info">Oczekuje na ocenę</Badge>
            }
            catch(e){

            }
        }

        return <Badge variant="danger">Nie przesłano</Badge>
    }


    const redirectToReport = (user_id, lecture_id, task_id) => {
        navigator(`/sprawozdania/${user_id}/${lecture_id}/${task_id}`)

    }
    
    useEffect(() => {
        if (user?.logged)
            fetchMembers();
    }, [user.logged]);

  return (
    <>
        {
            data.map((member, user_index) => {
                return (
                    <UserWrapper key={`user_${user_index}`}>
                        <Username>{member?.first_name} {member?.last_name}</Username>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Nazwa zadania:</th>
                                    <th className='text-center'>Status:</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    member?.tasks.map((task, task_index) => {
                                        return (
                                            <tr key={`task_${user_index}_${task_index}`} onClick={() => redirectToReport(member.id, routeID.id, task.id)} className='pointer'>
                                                <td >{task?.name}</td>
                                                <td className='text-center'>{getTaskStatus(task)}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </Table>
                    </UserWrapper>
                )
            })
        }
    
    </>
  )
}

export default MembersList