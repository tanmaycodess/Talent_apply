import React from 'react';
import PropTypes from 'prop-types';
import './Card.css'; // Assuming you have some custom styles

const Card = ({ children, className }) => {
    return (
        <div className={`card ${className}`} style={{ width: '18rem' }}>
            <div className="card-body">
                {children}
            </div>
        </div>
    );
};

Card.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

Card.defaultProps = {
    className: '',
};

export default Card;
