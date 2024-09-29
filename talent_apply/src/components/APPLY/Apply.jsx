import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ApplyModal = ({ show, handleClose, jobId }) => {
    const [contactNumber, setContactNumber] = useState('');
    const [technology, setTechnology] = useState('');
    const [linkedinProfile, setLinkedinProfile] = useState('');
    const [resume, setResume] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('contactNumber', contactNumber);
        formData.append('technology', technology);
        formData.append('linkedinProfile', linkedinProfile);
        formData.append('resume', resume);

        try {
            const token = localStorage.getItem('token'); // Get token from localStorage
            if (!token) {
                throw new Error('Authentication token not found. Please log in again.');
            }

            const applicantId = localStorage.getItem('applicantId'); // Fetch applicantId directly
            console.log("Applicant ID:", applicantId); // Check if applicantId is fetched correctly

            if (!applicantId) {
                alert('Applicant ID is missing. Please log in again.');
                return;
            }

            formData.append('applicantId', applicantId); // Add applicantId to form data

            const response = await fetch(`http://localhost:5000/api/apply/${jobId}`, {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`, // Pass token for authorization
                },
            });

            if (response.ok) {
                alert('Application submitted successfully!');
                handleClose();
                resetForm();
            } else {
                const errorText = await response.text();
                throw new Error(errorText || 'Application failed');
            }
        } catch (error) {
            console.error('Error submitting application:', error);
            alert('Error submitting application: ' + error.message);
        }
    };

    const resetForm = () => {
        setContactNumber('');
        setTechnology('');
        setLinkedinProfile('');
        setResume(null);
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Apply for Job</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formContactNumber">
                        <Form.Label>Contact Number</Form.Label>
                        <Form.Control
                            type="text"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formTechnology">
                        <Form.Label>Technology</Form.Label>
                        <Form.Control
                            type="text"
                            value={technology}
                            onChange={(e) => setTechnology(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formLinkedinProfile">
                        <Form.Label>LinkedIn Profile (Optional)</Form.Label>
                        <Form.Control
                            type="url"
                            value={linkedinProfile}
                            onChange={(e) => setLinkedinProfile(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formResume">
                        <Form.Label>Resume (PDF)</Form.Label>
                        <Form.Control
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => setResume(e.target.files[0])}
                            required
                        />
                    </Form.Group>
                    <Button  variant="primary" type="submit">Submit Application</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ApplyModal;
