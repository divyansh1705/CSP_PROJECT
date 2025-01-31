import React, { useState, useContext } from 'react'; // Import useState
import { Container, Row, Col, Form, FormGroup, Button } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import registerImg from '../assets/images/register.png';
import userIcon from '../assets/images/user.png'; // Assuming this should be a different image
import "../styles/login.css"; // Fixed typo in CSS import
import { AuthContext } from './context/authContext';
import { BASE_URL } from '../utils/config';

const Register = () => {
    const [credentials, setCredentials] = useState({
        username: '', // Updated to match input id
        email: '',
        password: '',
    });

    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials), // Fixed typo here
            });

            const data = await res.json();

            if (!res.ok) {
                return alert(data.message); // Fixed result to data
            }

            dispatch({ type: 'REGISTER_SUCCESS' }); // You might want to pass some user data here
            navigate("/login");
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <section>
            <Container>
                <Row>
                    <Col lg="8" className="m-auto">
                        <div className="login__container d-flex justify-content-between">
                            <div className="login__img">
                                <img src={registerImg} alt="Register" />
                            </div>
                            <div className="login__form">
                                <div className="user">
                                    <img src={userIcon} alt="User Icon" />
                                </div>
                                <h2>Register</h2>
                                <Form onSubmit={handleClick}>
                                    <FormGroup>
                                        <input
                                            type="text"
                                            placeholder="Username"
                                            required
                                            id="username"
                                            onChange={handleChange}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            required
                                            id="email"
                                            onChange={handleChange}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            required
                                            id="password"
                                            onChange={handleChange}
                                        />
                                    </FormGroup>
                                    <Button
                                        className="btn secondary__btn auth__btn"
                                        type="submit"
                                    >
                                        Create Account
                                    </Button>
                                </Form>
                                <p>
                                    Already have an account?{' '}
                                    <Link to="/login">Login</Link>
                                </p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default Register;
