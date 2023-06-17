import { Badge } from 'react-bootstrap';
import styled from 'styled-components';


export const Wrapper = styled.tr`
    cursor: pointer;
`
export const StyledBadge = styled(Badge)`

`

export const DeadLine = styled.span`
    color: ${props => props.islate ? 'red' : 'black'};
`