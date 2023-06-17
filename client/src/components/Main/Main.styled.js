import styled from 'styled-components';
import { Colors } from '../../Colors';
import { Row } from 'react-bootstrap';


export const Welcome = styled.h4`
    padding-bottom: 40px;
    border-bottom: 1px solid ${Colors.secondaryBorder};
`

export const Name = styled.span`
    color: ${Colors.tertiary};
`

export const Cards = styled(Row)`
    margin-top: 10px;
`