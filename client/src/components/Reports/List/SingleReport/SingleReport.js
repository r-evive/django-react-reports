import moment from 'moment'
import React, { useContext } from 'react'
import { Badge } from 'react-bootstrap'
import { DeadLine, StyledBadge, Wrapper } from './SingleReport.styled'
import { useNavigate } from 'react-router'
import { User } from '../../../../context/userContext'

const SingleReport = (props) => {
    const [user] = useContext(User);
    const navigator = useNavigate();

    if (props.empty)
        return (<tr><td colSpan={"100%"} className="text-center">Prowadzący nie zdefiniował sprawozdań</td></tr>)

    const formatDeadline = (deadline) => {
        if(!deadline)
            return '-'
        return <DeadLine islate={!moment(deadline).isSameOrAfter(moment(), 'day') ? 1 : 0} >{moment(deadline).format('DD.MM.YYYY')}</DeadLine>
    }


    const handleOnClick = (id) => {
        navigator(`/sprawozdania/${user?.data?.user_id}/${props?.lecture?.lecture_id}/${id}`)
    }

    return (
        <>
            {props?.lecture?.reports?.map((report, index) => {
                return (
                        <Wrapper key={index} onClick={() => handleOnClick(report?.id)}>
                            <td>{report.name}</td>
                            <td>{props?.lecture?.lecture_owner}</td>
                            <td className='text-center'>{formatDeadline(report.deadline)}</td>
                            <td className='text-center'><StyledBadge className="bg-danger">Oczekujące</StyledBadge></td>
                        </Wrapper>
                    )
                }
            )}
        </>
    )
}

export default SingleReport