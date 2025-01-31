import React, { useState, useContext } from 'react'; 
import "./booking.css";
import { Form, FormGroup, ListGroup, ListGroupItem, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../pages/context/authContext';
import { BASE_URL } from '../../utils/config';

const Booking = ({ tour, avgRating }) => {
    const { user } = useContext(AuthContext);

    const [booking, setBooking] = useState({
        UserId: user ? user._id : '',
        userEmail: user ? user.email : '',
        tourName: tour.title,
        fullName: '',
        phone: '',
        guestSize: 1,
        bookAt: ''
    });

    const { price, reviews } = tour;
    const navigate = useNavigate();

    const handleChange = ({ target: { id, value } }) => {
        setBooking(prev => ({ ...prev, [id]: value }));
    };

    const serviceFee = 10;
    const totalAmount = Number(price) * Number(booking.guestSize) + Number(serviceFee);

    const handleClick = async (e) => {
        e.preventDefault();
        if (!user) {
            return alert('Please sign in');
        }
        try {
            const res = await fetch(`${BASE_URL}/booking`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(booking) // Correctly stringify the booking object
            });
            const result = await res.json();
            if (!res.ok) {
                return alert(result.message);
            }
            navigate("/thank-you");
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className='booking'>
            <div className='booking__header d-flex align-items-center justify-content-between'>
                <h3>${price} <span>/per person</span></h3>
                <span className='tour__rating d-flex align-items-center gap-1'>
                    <i className="ri-star-s-fill"></i> 
                    {avgRating === 0 ? null : avgRating} ({reviews?.length})
                </span>            
            </div>
            <div className="booking__form">
                <h5>Information</h5>
                <Form className="booking__info-form" onSubmit={handleClick}>
                    <FormGroup>
                        <input 
                            type='text' 
                            placeholder='Full Name' 
                            id='fullName' 
                            required 
                            onChange={handleChange} 
                        />
                    </FormGroup>
                    <FormGroup>
                        <input 
                            type='number' 
                            placeholder='Phone' 
                            id='phone' 
                            required 
                            onChange={handleChange} 
                        />
                    </FormGroup>
                    <FormGroup className="d-flex align-items-center gap-3">
                        <input 
                            type='date' 
                            id='bookAt' 
                            required 
                            onChange={handleChange} 
                        />
                        <input 
                            type='number' 
                            placeholder='Guest' 
                            id='guestSize' 
                            min="1"
                            required 
                            onChange={handleChange} 
                        />
                    </FormGroup>
                </Form>
            </div>
            <div className='booking__bottom'>
                <ListGroup>
                    <ListGroupItem className="border-0 px-0">
                        <h5>${price} <i className='ri-close-line'></i> {booking.guestSize} person(s)</h5>
                        <span> ${Number(price) * Number(booking.guestSize)}</span>
                    </ListGroupItem>
                    <ListGroupItem className="border-0 px-0">
                        <h5>Service Charge</h5>
                        <span> ${serviceFee}</span>
                    </ListGroupItem>
                    <ListGroupItem className="border-0 px-0">
                        <h5>Total</h5>
                        <span> ${totalAmount}</span>
                    </ListGroupItem>
                </ListGroup>
                <Button className="btn primary__btn w-100 mt-4" onClick={handleClick}>Book Now</Button>
            </div>
        </div>
    );
};

export default Booking;
