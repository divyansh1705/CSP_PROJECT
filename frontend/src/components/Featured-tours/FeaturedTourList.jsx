import React from 'react';
import TourCard from '../../shared/TourCard';
import { Col } from 'reactstrap';
import useFetch from './../../hooks/useFetch';
import { BASE_URL } from '../../utils/config';

const FeaturedTourList = () => {
  // Fetch data using useFetch
  const { data: fetchedData, loading, error } = useFetch(`${BASE_URL}/tours/search/getFeaturedTour`);

  // Extract tours array from the response
  const featuredTours = fetchedData?.data || [];

  return (
    <>
      {loading && <h4>Loading ........</h4>}
      {error && <h4>{error}</h4>}
      {!loading && !error && featuredTours.length > 0 &&
        featuredTours.map((tour) => (
          <Col lg="3" className="mb-4" key={tour._id}>
            <TourCard tour={tour} />
          </Col>
        ))
      }
      {!loading && !error && featuredTours.length === 0 && (
        <h4>No featured tours available.</h4>
      )}
    </>
  );
};

export default FeaturedTourList;
