import React, { useRef, useEffect, useState, useContext } from 'react';
import "../styles/tour-details.css";
import { Container, Row, Col, Form, ListGroup } from 'reactstrap';
import { useParams } from "react-router-dom";
import calculateAvgRating from "../utils/avgRating";
import avatar from "../assets/images/avatar.jpg";
import Booking from "../components/Booking/Booking.jsx";
import Newsletter from "../shared/Newsletter";
import axios from 'axios';
import { BASE_URL } from '../utils/config.js';
import { AuthContext } from './context/authContext.js';

const TourDetails = () => {
    const { id } = useParams();
    const reviewMsgRef = useRef('');
    const [tourData, setTourData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tourRating, setTourRating] = useState(null);
    const { user } = useContext(AuthContext);

    // Scroll to top on component mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Fetch tour data
    useEffect(() => {
        const fetchTourData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${BASE_URL}/tours/${id}`);
                setTourData(response.data.data); // Assuming data is nested under `data`
                setLoading(false);
            } catch (err) {
                setError(err.message || "Something went wrong");
                setLoading(false);
            }
        };

        fetchTourData();
    }, [id]);

    // Handle null or undefined tour data
    if (loading) return <h4 className="text-center pt-5">Loading.......</h4>;
    if (error) return <h4 className="text-center pt-5">{error}</h4>;
    if (!tourData) return <h4>Tour not found</h4>;

    // Extract tour information from the API response
    const { photo, title, desc, price, address, reviews, city, distance, maxGroupSize } = tourData;
    const { totalRating, avgRating } = calculateAvgRating(reviews || []);
    const options = { day: "numeric", month: "long", year: "numeric" };

    // Handle review submission
    const submitHandler = async (e) => {
        e.preventDefault();
        const reviewText = reviewMsgRef.current.value;

        if (!user) {
            alert("Please sign in");
            return;
        }

        try {
            const reviewObj = {
                username: user?.username,
                reviewText,
                rating: tourRating,
            };

            const res = await axios.post(`${BASE_URL}/review/${id}`, reviewObj, { withCredentials: true });

            alert(res.data.message);
            reviewMsgRef.current.value = ""; // Reset the input after submission
        } catch (err) {
            alert(err.response?.data?.message || "Failed to submit review");
        }
    };

    return (
        <>
            <section>
                <Container>
                    <Row>
                        <Col lg="8">
                            <div className="tour_content">
                                <img src={photo} alt={title} width="800px" />
                                <div className="tour_info">
                                    <h2>{title}</h2>
                                    <div className="d-flex align-items-center gap-5">
                                        <span className="tour__rating d-flex align-items-center gap-1">
                                            <i className="ri-star-s-fill" style={{ color: "var(--secondary-color)" }}></i>
                                            {avgRating === 0 ? null : avgRating}
                                            {totalRating === 0
                                                ? "Not rated"
                                                : <span>({reviews?.length} reviews)</span>}
                                        </span>
                                        <span>
                                            <i className="ri-map-pin-user-fill"></i> {address}
                                        </span>
                                    </div>
                                    <div className="tour__extra-details">
                                        <span><i className="ri-map-pin-2-line"></i> {city}</span>
                                        <span><i className="ri-money-dollar-circle-line"></i> ${price} / per person</span>
                                        <span><i className="ri-map-pin-time-line"></i> {distance} km</span>
                                        <span><i className="ri-group-line"></i> {maxGroupSize} people</span>
                                    </div>
                                    <h5>Description</h5>
                                    <p>{desc}</p>
                                </div>
                                <div className="tour__reviews mt-4">
                                    <h4>Reviews ({reviews?.length || 0} reviews)</h4>
                                    <Form onSubmit={submitHandler}>
                                    <div className="d-flex align-items-center gap-3 mb-4 rating__group">
    {[1, 2, 3, 4, 5].map((rating) => (
        <span
            key={rating}
            onClick={() => setTourRating(rating)}
            className={tourRating === rating ? "selected-rating" : ""}
            style={{
                cursor: "pointer",
                color: tourRating >= rating ? "gold" : "gray",
            }}
        >
            {rating}
            <i className="ri-star-s-fill"></i>
        </span>
    ))}
</div>

                                        <div className="review__input">
                                            <input
                                                type="text"
                                                ref={reviewMsgRef}
                                                placeholder="Share your thoughts"
                                                required
                                            />
                                            <button className="btn primary__btn text-white" type="submit">
                                                Submit
                                            </button>
                                        </div>
                                    </Form>
                                    <ListGroup className="user__reviews">
                                        {reviews?.map((review, index) => (
                                            <div className="review__item" key={index}>
                                                <img src={avatar} alt="User Avatar" />
                                                <div className="w-100">
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <div>
                                                            <h5>{review.username}</h5>
                                                            <p>{new Date(review.date).toLocaleDateString("en-US", options)}</p>
                                                        </div>
                                                        <span className="d-flex align-items-center">
                                                            {review.rating}<i className="ri-star-s-fill"></i>
                                                        </span>
                                                    </div>
                                                    <h6>{review.reviewText}</h6>
                                                </div>
                                            </div>
                                        ))}
                                    </ListGroup>
                                </div>
                            </div>
                        </Col>
                        <Col lg="4" className="fixed">
                            <Booking tour={tourData} avgRating={avgRating} />
                        </Col>
                    </Row>
                </Container>
            </section>
            <Newsletter />
        </>
    );
};

export default TourDetails;
