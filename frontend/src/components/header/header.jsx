import React, { useRef, useEffect, useContext } from 'react';
import { Container, Row, Button } from 'reactstrap';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import './header.css';
import { AuthContext } from '../../pages/context/authContext';

const nav__links = [
  {
    path: '/home',
    display: 'Home',
  },
  {
    path: '/tours',
    display: 'Tours',
  },
];

const Header = () => {
  const headref = useRef(null);
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  const stickyHeaderFunc = () => {
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
      headref.current.classList.add('sticky_header');
    } else {
      headref.current.classList.remove('sticky_header');
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', stickyHeaderFunc);

    // Cleanup function
    return () => {
      window.removeEventListener('scroll', stickyHeaderFunc);
    };
  }, []);

  return (
    <header className="header" ref={headref}>
      <Container>
        <Row>
          <div className="nav__wrapper d-flex align-items-center justify-content-between">
            {/* Logo */}
            <div>
              <img src={logo} alt="Travel Logo" />
            </div>

            {/* Navigation Links */}
            <div className="navigation">
              <ul className="menu d-flex align-items-center gap-5">
                {nav__links.map((item, index) => (
                  <li className="nav_item" key={index}>
                    <NavLink
                      to={item.path}
                      className={(navClass) => (navClass.isActive ? 'active__link' : '')}
                    >
                      {item.display}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Section */}
            <div className="nav__right d-flex align-items-center gap-4">
              <div className="nav__btns d-flex align-items-center gap-4">
                {
                  user ? (
                    <>
                      <h5 className='mb-0'>{user.username}</h5>
                      <Button className="btn btn-dark" onClick={logout}>Logout</Button>
                    </>
                  ) : (
                    <>
                      <NavLink to="/login" className="btn secondary__btn">Login</NavLink>
                      <NavLink to="/register" className="btn primary__btn">Register</NavLink>
                    </>
                  )
                }
              </div>
            </div>

            {/* Mobile Menu Icon */}
            <span className="mobile__menu">
              <i className="ri-menu-line"></i>
            </span>
          </div>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
