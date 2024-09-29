import React, { useEffect, useState } from 'react';
import './Profile.css'; // Importing the CSS file

const ProfilePage = () => {
    const [applications, setApplications] = useState([]);
    const [jobs, setJobs] = useState({}); // State to hold job titles
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            const applicantId = localStorage.getItem('applicantId');

            try {
                const response = await fetch(`http://localhost:5000/api/applications?applicantId=${applicantId}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch applications');
                }

                const data = await response.json();
                setApplications(data);

                // Fetch job titles based on jobId
                await fetchJobTitles(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchJobTitles = async (applications) => {
            const jobIds = applications.map(app => app.jobId);
            const uniqueJobIds = [...new Set(jobIds)]; // Get unique job IDs

            try {
                const jobResponses = await Promise.all(
                    uniqueJobIds.map(jobId =>
                        fetch(`http://localhost:5000/api/jobs/${jobId}`)
                    )
                );

                const jobData = await Promise.all(jobResponses.map(res => res.json()));
                const jobMap = jobData.reduce((acc, job) => {
                    acc[job.jobId] = job.jobTitle; // Map jobId to jobTitle
                    return acc;
                }, {});

                setJobs(jobMap);
            } catch (error) {
                console.error('Error fetching job titles:', error);
            }
        };

        fetchApplications();
    }, []);

    if (loading) return <p className="loading">Loading applications...</p>;
    if (error) return <p className="error">Error: {error}</p>;

    return (
        <div className="profile-page">
            <h2>Your Applications</h2>
            {applications.length === 0 ? (
                <p className="no-applications">No applications found.</p>
            ) : (
                <ul className="applications-list">
                    {applications.map(application => (
                        <li className="application-item" key={application.applicationId}>
                            <div className="application-info">
                                <strong>Job Title:</strong> {jobs[application.jobId] || 'Job title not found'}
                            </div>
                            <div className="application-info">
                                <strong>Applied on:</strong> {new Date(application.createdAt).toLocaleDateString()}
                            </div>
                            <div className="application-info">
                                <strong>Status:</strong> {application.status}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProfilePage;
