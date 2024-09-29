// Footer.jsx
import React from 'react';
// import { FontAwesomeIcon } from  "@fortawesome/fontawesome-free";
 

const Footer = () => {
    return (
        
        <footer className="text-center text-lg-start bg-body-tertiary text-muted">
            <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
                <div className="me-5 d-none d-lg-block">
                    <span>Get connected with us on social networks:</span>
                </div>
                <div>
                    <a href="https://www.linkedin.com/in/insansa-technologies-60153a247/" className="me-4 text-reset">
                       <p className='ltag'>LinkedIn</p>
                    </a>
                    {/* <a href="#" className="me-4 text-reset">
                        <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" className="me-4 text-reset">
                        <i className="fab fa-google"></i>
                    </a>
                    <a href="#" className="me-4 text-reset">
                        <i className="fab fa-instagram"></i>
                    </a>
                    <a href="#" className="me-4 text-reset">
                        <i className="fab fa-linkedin"></i>
                    </a>
                    <a href="#" className="me-4 text-reset">
                        <i className="fab fa-github"></i>
                    </a> */}
                </div>
            </section>

            <section>
                <div className="container text-center text-md-start mt-5">
                    <div className="row mt-3">
                        <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">
                                <i className="fas fa-gem me-3"></i>Insansa Technolgy
                            </h6>
                            <p>
                                We are young, agile & aspire to be your trusted partner to solve business challenges & address technology needs with collective knowledge & deep insights
                            </p>
                        </div>

                        <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">Useful links</h6>
                            <p><a href="https://insansa.com/" className="text-reset">Our Website</a></p>
                           
                        </div>

                        <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">Contact</h6>
                            <p>A/ 221 Monalisa Business Center Manjalpur Vadodara Gujarat INDIA 390011</p>
                            <p>  talent@insansa.com</p>
                            <p>+ 91 9427055227</p>
                        </div>
                    </div>
                </div>
            </section>
        </footer>
    );
};

export default Footer;
