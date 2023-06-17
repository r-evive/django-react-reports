import { Button, Row } from 'react-bootstrap';
import styled from 'styled-components';
import { Colors } from '../../../Colors';
import { Link } from 'react-router-dom';


export const HeaderWrapper = styled(Row)`
    padding-bottom: 40px;
    border-bottom: 1px solid ${Colors.secondaryBorder};
`

export const Header = styled.h4`

`


export const Description = styled.h6`
    margin-top: 20px;
    font-weight: 300;  
    margin-bottom: 0;
`

export const Details = styled(Row)`
    padding-bottom: 40px;
    border-bottom: 1px solid ${Colors.secondaryBorder};
`

export const Tasks = styled(Row)`
    padding-top:40px;
`

export const Members = styled(Row)`
    padding-top: 40px;
`

export const MembersHeader = styled.h4`
    margin-bottom: 20px;
`

export const TasksHeader = styled.h4`
    margin-bottom: 20px;
`

export const AddTaskButton = styled(Button)`
    white-space: nowrap;
    margin-bottom: 20px;
`
export const ActionTH = styled.th`
    width: 40px;
    text-align: center;
`
