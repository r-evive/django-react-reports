import { Image, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { styled } from 'styled-components'
import { Colors } from '../../Colors';


export const NavBar = styled(Row)`
    background-color: ${Colors.primary};
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
`


export const Nav = styled.div`
    width: 100%;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media (max-width: 768px) {
        flex-wrap: wrap;
        min-height: 70px;
        height: auto;
        padding: 10px 0;
     }
`;

export const Logo = styled.img`
    max-height: 50px;
    height: 100%;
    object-fit: contain;
    object-position: center;

    @media (max-width: 768px) {
        width: 50%;
     }
`;

export const Items = styled.div`
    display: flex;
    flex: 1;
    justify-self: flex-end;
    align-items: center;
    justify-content: flex-end;
    gap: 25px;
`;

export const MobileItems = styled.div`
    width: 100%;
    display: ${props => props.active ? 'flex' : 'none !important'};

    @media (max-width: 768px) {
        margin-top: 20px;
        flex-direction: column;
        height: auto;

        :last-child{
            margin-bottom: 20px;
        }
     }
`;

export const StyledLink = styled(Link)`
    color: #ffffff;
    text-decoration: none;
    font-size: 18px;

    transition: all 0.3s ease-in-out;

    &:hover{
        color: ${Colors.secondary};
    }

    @media (max-width: 768px) {
        width: 100%;
        padding: 10px 0;
        text-align: center;
        border-bottom: 1px solid ${Colors.secondaryBorder};
     }

`

export const LogoutContainer = styled.div`
    margin-left:50px;
    justify-self: flex-end;
    align-items: center;

    @media (max-width: 768px) {
        width: 50%;
        display: flex;
        justify-self: flex-end;
        justify-content: flex-end;
        margin-left: 0px;
     }
`

export const Hamburger = styled.div`
    display: none;
    flex-direction: column;
    justify-content: space-between;
    width: 30px;
    height: 21px;
    margin-right: 40px;
    cursor: pointer;

    @media (max-width: 768px) {
        display: flex;
    }
`

export const HamburgerLine = styled.div`
    width: 100%;
    height: 3px;
    background-color: #ffffff;
    border-radius: 5px;
`
