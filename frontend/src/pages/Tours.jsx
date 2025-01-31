import React, { useState, useEffect } from 'react';
import CommonSection from "../shared/commonsection";
import { Container, Row, Col } from 'reactstrap';
import "../styles/tours.css";
import SearchBar from "../shared/SearchBar";
import TourCard from "../shared/TourCard";
import Newsletter from "../shared/Newsletter";
import useFetch from '../hooks/useFetch';
import { BASE_URL } from '../utils/config';

const Tours =  () => {
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(0);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState("")
    //http://localhost:4000/api/v1/tours/:id
    // Fetch tours based on the current page
    // const { data: tours, loading, error } = useFetch(`${BASE_URL}/tours`);
    const response = useFetch(`${BASE_URL}/tours`);
    const tours = response.data.data;
    console.log(tours)
    
    const { data: tourCountData } = useFetch(`${BASE_URL}/tours/search/getTourCount`);

    useEffect(() => {
        if (tourCountData && tourCountData.count) {
            const pages = Math.ceil(tourCountData.count / 8); // Assuming 8 items per page
            setPageCount(pages);
        }
        window.scrollTo(0, 0); // Scroll to the top whenever page changes
    }, [tourCountData, page]);

    return (
        <>
            <CommonSection title="All Tours" />

            <section className="pt-0">
                <Container>
                    {loading && <h4 className="text-center pt-5">Loading ......</h4>}
                    {/* {error && <h4 className="text-center pt-5">{error.message || 'Something went wrong!'}</h4>} */}

                    {!loading && !error && tours?.length > 0 && (
                        <Row>
                            {tours.map((tour,index) => (
                                <Col lg="3" className="mb-4" key={tour._id}>
                                    <TourCard tour={tour} key={index} />
                                </Col>
                            ))}
                            <Col lg="12">
                                <div className="pagination d-flex align-items-center justify-content-center mt-4 gap-3">
                                    {[...Array(pageCount).keys()].map((number) => (
                                        <span
                                            key={number}
                                            onClick={() => setPage(number)}
                                            className={page === number ? "active__page" : ""}
                                            style={{ cursor: loading || number >= pageCount ? 'not-allowed' : 'pointer' }}
                                        >
                                            {number + 1}
                                        </span>
                                    ))}
                                </div>
                            </Col>
                        </Row>
                    )}

                    {!loading && !error && tours?.length === 0 && (
                        <h4 className="text-center pt-5">No tours available</h4>
                    )}
                </Container>
            </section>
            <Newsletter />
        </>
    );
};

export default Tours;
