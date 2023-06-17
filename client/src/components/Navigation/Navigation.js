import React, { useContext, useState } from 'react'
import { Hamburger, HamburgerLine, Items, Logo, LogoutContainer, MobileItems, Nav, NavBar, StyledLink } from './Navigation.styled'
import { Button, Col, Container } from 'react-bootstrap';
import { User } from '../../context/userContext';
import { RoutesArray } from '../../routes/Routes';
import { useNavigate } from 'react-router';
import useAdmin from '../../hooks/useAdmin';

const Navigation = () => {

    let [user, setUser] = useContext(User);
    let [menuActive, setMenuActive] = useState(false);
    const navigator = useNavigate();
    let isAdmin = useAdmin();

    const handleLogout = (event) => {
        event.preventDefault();

        localStorage.removeItem('reportData');

        setUser({
            logged: false,
            token: null,
            data: {}
        })
        navigator('/login');
    }

    const handleOnLinkClick = () => {
        setMenuActive(false);
    }

    const generateMenu = () => {
        return RoutesArray.map((route, index) => {
            if(!user.logged) return;
            if(route.adminVisibility === false && isAdmin) return;

            return route.nav ? <StyledLink key={index} to={route.path} onClick={handleOnLinkClick}>{route.name}</StyledLink> : null;
        })
    }  

    const handleLogoClick = () => {
        setMenuActive(false);
        navigator('/');
    }


    const toogleMenu = () => {
        setMenuActive(prev => !prev);
    }

    return (
    <NavBar>
        <Col>
            <Container>
                <Nav>
                    <Logo className="pointer" src="/logo_white.png" onClick={handleLogoClick}/>  
                    <Items className="d-none d-md-flex">
                        {generateMenu()}
                    </Items>
                    <LogoutContainer>
                        <Hamburger onClick={toogleMenu}>
                            <HamburgerLine/>
                            <HamburgerLine/>
                            <HamburgerLine/>
                        </Hamburger>
                        <Button variant="outline-light" onClick={handleLogout}>Wyloguj</Button>
                    </LogoutContainer>

                    
                    <MobileItems className="d-flex d-md-none" active={menuActive ? 1 : 0}>
                        {generateMenu()}
                    </MobileItems>
                </Nav>
            </Container>
        </Col>
    </NavBar>
  )
}

export default Navigation