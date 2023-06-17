import styled from 'styled-components';
import { Colors } from '../../Colors';
import { Button, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';


export const HeaderWrapper = styled(Row)`
    padding-bottom: 40px;
    border-bottom: 1px solid ${Colors.secondaryBorder};
`

export const Header = styled.h4`

`


export const ActionsTH = styled.th`
    max-width: 200px;
    width: 200px;
    text-align: right;
`

export const StyledButton = styled(Button)`
    margin-left: 5px;
    margin-right: 5px;
`

export const StyledLink = styled(Link)`
    color: ${Colors.black};
    text-decoration: none;
    &:hover {
        color: ${Colors.black};
        text-decoration: none;
    }
`