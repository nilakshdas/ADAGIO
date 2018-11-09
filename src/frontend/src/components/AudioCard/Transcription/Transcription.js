import React, {Component} from 'react';

import './Transcription.css';


class Transcription extends Component {
    render() {
        const spinner = (
            <span>
                <i className="fas fa-circle-notch fa-spin"></i>
            </span>
        );

        return (
            <div className={("transcription " + this.props.className)}>
                {this.props.text || spinner}
            </div>
        );
    }
}

export default Transcription;
