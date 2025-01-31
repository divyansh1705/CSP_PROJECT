import React, { useState, useEffect } from 'react';
import CommonSection from './../shared/commonsection';
import { Container, Row, Col } from 'reactstrap';
import { useLocation } from 'react-router-dom';
import TourCard from '../shared/TourCard';
import Newsletter from '../shared/Newsletter';

const SearchResultList = () => {
  const location = useLocation();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (location.state) {
      setData(location.state);
    }
  }, [location.state]);

  return (
    <>
      <CommonSection title="Tour Search Result" />
      <section>
        <Container>
          <Row>
            {data.length === 0 ? (
              <h4 className="text-center">No tours found</h4>
            ) : (
              data.map((tour) => (
                <Col lg="3" md="6" sm="12" className="mb-4" key={tour._id}>
                  <TourCard tour={tour} />
                </Col>
              ))
            )}
          </Row>
        </Container>
      </section>
      <Newsletter />
    </>
  );
};

export default SearchResultList;
