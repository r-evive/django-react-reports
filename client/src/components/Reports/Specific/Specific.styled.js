import styled from 'styled-components';
import { Colors } from '../../../Colors';
import { Button, Row } from 'react-bootstrap';

export const Wrapper = styled(Row)`
    margin-top: 20px;

`;


export const HeaderWrapper = styled(Row)`
    padding-bottom: 40px;
    border-bottom: 1px solid ${Colors.secondaryBorder};
`

export const Header = styled.h4`
    display: flex;
    justify-content: space-between;
`

export const Description = styled.h6`
    margin-top: 20px;
    font-weight: 300;  
    margin-bottom: 0;
`

export const DeadLine = styled.span`
    color: ${props => props.islate ? 'red' : 'black'};
`

export const Block = styled(Row)`
    padding-top:40px;
`

export const BlockHeader = styled.h4`
    margin-bottom: 20px;
`

export const AddButton = styled(Button)`
    white-space: nowrap;
    margin-bottom: 20px;
`
export const ActionTH = styled.th`
    width: 40px;
    text-align: center;
`
