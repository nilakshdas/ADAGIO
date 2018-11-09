import React, {Component} from 'react';
import {CSSTransition} from 'react-transition-group';

import './DummyCard.css';


class DummyCard extends Component {
    render() {
        return (
            <CSSTransition
                    in={true}
                    timeout={300}
                    classNames="card">
                <div className="card dummy-card" onClick={this.props.onClick}>
                        <div className="btn-add-audio-card" >
                            <i className="fas fa-plus-circle"></i>
                    </div>
                </div>
            </CSSTransition>
        );
    }
}

export default DummyCard;
