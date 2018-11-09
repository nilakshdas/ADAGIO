import React, {Component} from 'react';

import './AudioWaveform.css';


class AudioWaveform extends Component {
    componentDidMount() {
        if (this.wavesurfer !== undefined)
            this.componentWillUnmount()

        let waveColor = {
            original: '#6c757d',
            amr: '#28a745',
            mp3: '#007bff',
            attacked: '#dc3545'
        }[this.props.className];

        let progressColor = {
            original: '#545b62',
            amr: '#1e7e34',
            mp3: '#0062cc',
            attacked: '#bd2130'
        }[this.props.className];

        this.wavesurfer = window.WaveSurfer.create({
            container: '#'+this.props.cardID+'-waveform',
            waveColor: waveColor,
            progressColor: progressColor,
            barWidth: null,
            cursorWidth: 0,
            hideScrollbar: true
        });
        this.wavesurfer.loadBlob(this.props.audioBlob);

        this.wavesurfer.on('ready', () => {
            this.wavesurfer.play();
        });

        this.wavesurfer.on('seek', (pos) => {
            this.wavesurfer.play(pos * this.wavesurfer.getDuration());
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.audioBlob.name !== prevProps.audioBlob.name)
            this.componentDidMount();
    }

    componentWillUnmount() {
        this.wavesurfer.destroy();
        delete this.wavesurfer;
    }

    render = () => (
        <div id={this.props.cardID+'-waveform'} className="waveform"></div>
    )
}

export default AudioWaveform;
