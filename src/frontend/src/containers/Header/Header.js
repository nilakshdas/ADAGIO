import React, {Component} from 'react';

import './Header.css';


class Header extends Component {
    render() {
        return (
            <nav className="header navbar navbar-expand-lg navbar-dark bg-primary justify-content-between">
                <a className="navbar-brand" href="#">
                    <b>ADAGIO</b>
                    <span
                        style={{
                            marginLeft: '20px',
                            fontSize: '18px',
                            color: 'white',
                            opacity: 0.6
                        }} >
                        Adversarial Defense for Audio in a Gadget with Interactive Operations
                    </span>
                </a>
                <div className="btn-add-audio-card" style={{display: 'none'}}
                        onClick={(e) => {
                                e.preventDefault();
                                document.dispatchEvent(
                                    new Event('add-audio-card-click')
                                );
                            }}>
                    <i className="fas fa-plus-circle"></i>
                </div>
            </nav>
        );
    }
}

export default Header;
