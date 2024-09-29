import React from 'react';
import Card from './Card'; // Adjust the path as necessary
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const JobCard = ({ jobTitle, jobLocation, jobDescription, onApply }) => {
    return (
        <Card className="m-2">
            <h5 className="card-title">{jobTitle}</h5>
            <h6 className="card-subtitle mb-2 text-muted">
                {jobLocation.join(' | ')}
            </h6>
            <p className="card-text">{jobDescription}</p>
            <Button variant="primary" onClick={onApply}>Apply</Button>
        </Card>
    );
};

JobCard.propTypes = {
    jobTitle: PropTypes.string.isRequired,
    jobLocation: PropTypes.arrayOf(PropTypes.string).isRequired,
    jobDescription: PropTypes.string.isRequired,
    onApply: PropTypes.func.isRequired,
};

export default JobCard;
