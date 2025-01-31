import React, { useRef } from 'react';
import './search-bar.css';
import { Col, Form, FormGroup } from 'reactstrap';
import { BASE_URL } from '../utils/config';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const locationRef = useRef(null);
  const distanceRef = useRef(null);
  const maxGroupSizeRef = useRef(null);
  const navigate = useNavigate();

  const searchHandler = async () => {
    const location = locationRef.current.value;
    const distance = distanceRef.current.value;
    const maxGroupSize = maxGroupSizeRef.current.value;

    // Validation
    if (!location || !distance || !maxGroupSize) {
      return alert('All fields are required');
    }

    try {
      // Fetch API Call
      const res = await fetch(
        `${BASE_URL}/tours/search/getTourBySearch?city=${location}&distance=${distance}&maxGroupSize=${maxGroupSize}`
      );
      console.log(res);

      if (!res.ok) {
        return alert('Something went wrong. Please try again.');
      }

      const result = await res.json();

      // Redirect to search results with state
      navigate(
        `/tours/search?city=${location}&distance=${distance}&maxGroupSize=${maxGroupSize}`,
        { state: result.data }
      );
      console.log(result);
    } catch (error) {
      console.error('Error fetching search results:', error);
      alert('Error fetching search results. Please check your network connection.');
    }
  };

  return (
    <Col lg="12">
      <div className="search__bar">
        <Form className="d-flex align-items-center gap-4">
          <FormGroup className="d-flex gap-3 form_group form_group-fast">
            <span>
              <i className="ri-map-pin-line"></i>
            </span>
            <div>
              <h6>Location</h6>
              <input
                type="text"
                placeholder="Where are you going?"
                ref={locationRef}
              />
            </div>
          </FormGroup>

          <FormGroup className="d-flex gap-3 form_group form_group-fast">
            <span>
              <i className="ri-map-pin-time-line"></i>
            </span>
            <div>
              <h6>Distance</h6>
              <input
                type="number"
                placeholder="Distance (km)"
                ref={distanceRef}
              />
            </div>
          </FormGroup>

          <FormGroup className="d-flex gap-3 form_group form_group-last">
            <span>
              <i className="ri-group-line"></i>
            </span>
            <div>
              <h6>Max People</h6>
              <input
                type="number"
                placeholder="0"
                ref={maxGroupSizeRef}
              />
            </div>
          </FormGroup>

          {/* Button for Search */}
          <button
            className="btn search__icon"
            type="button" // Prevent default form submission
            onClick={searchHandler}
          >
            <i className="ri-search-line"></i>
          </button>
        </Form>
      </div>
    </Col>
  );
};

export default SearchBar;
