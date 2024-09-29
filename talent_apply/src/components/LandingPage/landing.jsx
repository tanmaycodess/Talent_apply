// UserProfileNavbar.jsx
import React, { useEffect, useState } from 'react';
import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './landing.css';
import Logo from '/Images/logo1.png';
import JobCard from '../CARD/Jobcard';
import ApplyModal from '../APPLY/Apply';
import Profile from '../Profile/Profile';
import Footer from '../Footer/Footer'; // Import the Footer component

const logoutbtn = () => {
    localStorage.clear();
    window.location.href = '/auth';
};

const name = localStorage.name || "User";

const UserProfileNavbar = () => {
    const [jobData, setJobData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [viewProfile, setViewProfile] = useState(false);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch('https://talentapply-1s9izbs7.b4a.run/api/jobs');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setJobData(data);
            } catch (error) {
                console.error('Error fetching job data:', error);
            }
        };

        fetchJobs();
    }, []);

    const handleApplyClick = (jobId) => {
        setSelectedJobId(jobId);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedJobId(null);
    };

    const handleProfileClick = () => {
        setViewProfile(true);
    };

    const handleBackToJobs = () => {
        setViewProfile(false);
    };

    return (
        <>
            <Navbar expand="lg" className="custom-navbar">
                <div className="container-fluid">
                    <Navbar.Brand href="#" className="brand">
                        <img src={Logo} alt="MyApp Logo" className="logo" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <NavDropdown title={`Hello, ${name}`} id="profileDropdown" className="profile-dropdown">
                                <NavDropdown.Item as="button" onClick={handleProfileClick}>Your Applications</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item as="button" onClick={logoutbtn}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </div>
            </Navbar>

            {viewProfile ? (
                <div>
                    <Button onClick={handleBackToJobs} className="mb-3">Back to Job Listings</Button>
                    <Profile />
                </div>
            ) : (
                <div>
                    <h1 className="welcome-message">Hello, {name}! Welcome to your career adventure with Insansa Technologies.</h1>
                    <div className="d-flex flex-wrap justify-content-center mt-4">
                        {jobData.length > 0 ? (
                            jobData.map((job) => (
                                <JobCard
                                    key={job.jobId}
                                    jobTitle={job.jobTitle}
                                    jobLocation={job.jobLocation}
                                    jobDescription={job.jobDescription}
                                    onApply={() => handleApplyClick(job.jobId)}
                                />
                            ))
                        ) : (
                            <p className="no-jobs-message">No job listings available at the moment.</p>
                        )}
                    </div>

                    <ApplyModal
                        show={showModal}
                        handleClose={handleCloseModal}
                        jobId={selectedJobId}
                    />
                </div>
            )}

            <div className='space'></div>

            <Footer /> {/* Add the Footer component here */}
        </>
    );
};

export default UserProfileNavbar;
