import React, {Component} from 'react';

import './AudioDropZone.css'


class AudioDropZone extends Component {
    constructor(props) {
        super(props);

        this.handleDrop = this.handleDrop.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleHover = this.handleHover.bind(this);

        this.state = {
            hover:false,
            audio_input_path: null
        };
    }

    handleDrop(e) {
        e.stopPropagation();
        e.preventDefault();

        let audioFile = e.dataTransfer.files[0];
        this.props.onAudioFileInput(audioFile, e);
    }

    handleClick(e) {
        e.stopPropagation();
        e.preventDefault();

        let audioFile = e.target.files[0];
        this.props.onAudioFileInput(audioFile, e);
    }

    handleHover(hover, e) {
        e.stopPropagation();
        e.preventDefault();

        if (this.state.hove !== hover)
            this.setState({hover});
    }

    render() {
        const style = {
            opacity: this.state.hover ? 1.0 : 0.5
        }

        return (
            <div className="dropzone" style={style}
                    onDrop={this.handleDrop}
                    onMouseOver={e => this.handleHover(true, e)}
                    onMouseOut={e => this.handleHover(false, e)}
                    onDragOver={e => this.handleHover(true, e)}
                    onDragLeave={e => this.handleHover(false, e)} >

                <input type="file"
                    accept="audio/x-wav"
                    onChange={this.handleClick} />

                Drop an audio sample here or click to upload...

            </div>
        );
    }
}

export default AudioDropZone;
