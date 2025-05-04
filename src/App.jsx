import { useEffect, useState, useRef } from "react";
import Course from "./Course";
import Checkout from "./Checkout";
import Confirmation from "./Confirmation";
import "./App.scss";

export default function App() {
    const [currentPage, setCurrentPage] = useState('/');
    const [data, setData] = useState(null);
    const [checked, setChecked] = useState([]);
    const [enrolled, setEnrolled] = useState([]);
    const [favorites, setFavorites] = useState([]);

    const allCourses = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const request = await fetch("./data.json", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }); // for now data is in root 'public' dir
                if (request.status !== 200 || !request.ok) {
                    // Handle errors messaging
                }
                const response = await request.json();
                setData(response);
            } catch (error) {
                // Handle data retrieval errors
            } finally {
                // Do something final like turn of spinner
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        document.querySelector('#root').classList = '';
        document.querySelector('#root').classList.add(currentPage);
    }, [currentPage])

    const handleObserveChecked = (isChecked, targetCourse) => {
        if (isChecked) {
            setChecked(prev => [...prev, targetCourse]);
        }
        else {
            let checkedList = checked;
            setChecked(checkedList.filter((item) => item != targetCourse));
        }
    }

    // Service worker: Enroll
    const handleCoursesEnrollment = () => {
        // Make sure we have things checked
        if (checked.length > 0) {
            setCurrentPage('checkout'); // react-router but this is more simple for now
            setEnrolled(checked);
        }
        else {
            // Maybe validation here?
        }
        
        // localStorage.setItem('enrolled', JSON.stringify(checked));
    }

    // Service worker: POST to /api/profile/saved/courses/<course_id>
    const handleUpdateFavorites = () => {
        setFavorites(checked);
        
        // localStorage.setItem('favorites', JSON.stringify(checked));
    }

    return (
        <>
            {/* Home Page route */}
            {currentPage == '' || currentPage == '/' && (
                <>
                    <h1 className="app-title">Course Dates</h1>

                    <ul className="courses" ref={allCourses}>
                        {data?.map((course, index) => {
                            return (
                                <li key={index}>
                                    <Course currentPage={currentPage} course={course} enrolled={enrolled} favorites={favorites} handleObserveChecked={handleObserveChecked} />
                                </li>
                            )
                        })}
                    </ul>

                    <button className="course-btn btn" onClick={(event) => {
                        event.preventDefault();
                        handleCoursesEnrollment();
                    }}>Enroll in Course{checked.length > 1 && 's'}</button>

                    <button className="course-link btn" onClick={() => handleUpdateFavorites()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="24"><path d="M0 2.25C0 1.00781 1.00781 0 2.25 0V2.25V20.6906L8.34844 16.3359C8.7375 16.0547 9.26719 16.0547 9.65625 16.3359L15.75 20.6906V2.25H2.25V0H15.75C16.9922 0 18 1.00781 18 2.25V22.875C18 23.2969 17.7656 23.6812 17.3906 23.8734C17.0156 24.0656 16.5656 24.0328 16.2234 23.7891L9 18.6328L1.77656 23.7891C1.43438 24.0328 0.984375 24.0656 0.609375 23.8734C0.234375 23.6812 0 23.2969 0 22.875V2.25Z" fill="#0073DD" /></svg>
                        {" "}
                        Save Course
                    </button>
                </>
            )}

            {/* Checkout page route */}
            {currentPage === 'checkout' && (
                <Checkout setCurrentPage={setCurrentPage} enrolled={enrolled} />
            )}

            {/* Confirmation page route */}
            {currentPage === 'confirmation' && (
                <Confirmation setCurrentPage={setCurrentPage} setEnrolled={setEnrolled} setChecked={setChecked} />
            )}
        </>
    );
}
