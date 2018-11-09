import React, {Component} from 'react';

import AudioDropZone from './AudioDropZone';
import AudioWaveform from './AudioWaveform';
import BreadcrumbPanel from './BreadcrumbPanel';
import Transcription from './Transcription';

import Backend from '../../backend';

import './AudioCard.css';


function getNewAudioItem(label, audioBlob) {
    return {
        label: label,
        audioBlob: audioBlob,
        transcription: null,
        info: null
    }
}


class AudioCard extends Component {
    constructor(props) {
        super(props);

        this.addToAudioHistory = this.addToAudioHistory.bind(this);
        this.showAudioItemFromHistory = this.showAudioItemFromHistory.bind(this);
        this.handleAudioFileInput = this.handleAudioFileInput.bind(this);
        this.handleBreadcrumbClick = this.handleBreadcrumbClick.bind(this);
        this.handleAttackIntent = this.handleAttackIntent.bind(this);
        this.handlePreprocessIntent = this.handlePreprocessIntent.bind(this);

        this.state = {
            originalAudioFileName: null,
            audioHistory: [],
            displayedAudioItemIndex: null,
            displayedAudioBlob: null,
            displayedTranscription: null
        };
    }

    addToAudioHistory(audioItem, callback) {
        let promise = new Promise((resolve, reject) => {
            this.setState((prevState, props) => {
                prevState.audioHistory.push(audioItem);
                return {audioHistory: prevState.audioHistory};
            }, () => {
                const newItemIndex = this.state.audioHistory.length - 1;

                if (callback !== undefined)
                    callback(newItemIndex);
                resolve(newItemIndex);
            });
        });

        return promise;
    }

    showAudioItemFromHistory(itemIndex) {
        if (itemIndex === undefined)
            itemIndex = this.state.audioHistory.length - 1;

        const audioItem = this.state.audioHistory[itemIndex];

        this.setState({
            displayedAudioItemIndex: itemIndex,
            displayedAudioBlob: audioItem.audioBlob
        });

        if (audioItem.transcription !== null) {
            this.setState({
                displayedTranscription: audioItem.transcription
            });
        } else {
            Backend.getTranscription(
                audioItem.audioBlob,
                this.props.cardID
            ).then(transcription => {
                this.setState((prevState, props) => {
                    let newState = {audioHistory: prevState.audioHistory};

                    newState.audioHistory[itemIndex].transcription = transcription;

                    if (prevState.displayedAudioItemIndex === itemIndex);
                        newState.displayedTranscription = transcription

                    return newState;
                });
            });
        }
    }

    handleAudioFileInput(audioFile, e) {
        this.setState({originalAudioFileName: audioFile.name});

        let audioItem = getNewAudioItem('original', audioFile);
        this.addToAudioHistory(audioItem)
            .then(this.showAudioItemFromHistory);
    }

    handleBreadcrumbClick(itemIndex, e) {
        e.preventDefault();
        this.showAudioItemFromHistory(itemIndex);
    }

    handlePreprocessIntent(preprocessingOption, e) {
        e.preventDefault();

        this.setState({displayedTranscription: null});

        const audioHistory = this.state.audioHistory;
        const lastAudioItem = audioHistory[audioHistory.length - 1];
        Backend.getPreprocessedBlobWithTranscription(
            lastAudioItem.audioBlob,
            this.props.cardID,
            preprocessingOption
        ).then(([audioBlob, transcription]) => {
            let audioItem = getNewAudioItem('preprocessed', audioBlob);
            audioItem.info = preprocessingOption.toUpperCase();
            audioItem.transcription = transcription;
            this.addToAudioHistory(audioItem)
                .then(this.showAudioItemFromHistory);
        });
    }

    handleAttackIntent(e) {
        e.preventDefault();

        console.log(e);

        const audioHistory = this.state.audioHistory;
        const lastAudioItem = audioHistory[audioHistory.length - 1];

        const targetTranscription = prompt(
            'Enter target transcription.',
            lastAudioItem.transcription);

        if (targetTranscription !== null) {
            let attackInfo = (i) => `[${i} / 100]`;

            let attackedAudioBlob = lastAudioItem.audioBlob;
            let audioItem = getNewAudioItem('attacked', attackedAudioBlob);
            audioItem.info = attackInfo(0);
            this.addToAudioHistory(audioItem)
                .then((itemIndex) => {
                    Backend.startAttackJob(
                        attackedAudioBlob,
                        this.props.cardID,
                        targetTranscription
                    ).then(attackJobID => {
                        console.log(attackJobID);

                        const getAndProcessStatus = () => {
                            Backend.getAttackJobStatus(this.props.cardID, attackJobID)
                               .then(attackJobStatus => {
                                   console.log(attackJobStatus);

                                   if (attackJobStatus === null) return;

                                   this.setState((prevState, props) => {
                                       let newState = {audioHistory: prevState.audioHistory};

                                       newState.audioHistory[itemIndex].info = attackInfo(attackJobStatus.numIters);

                                       let transcription = attackJobStatus.currentTranscription;
                                       newState.audioHistory[itemIndex].transcription = transcription
                                       if (prevState.displayedAudioItemIndex === itemIndex);
                                           newState.displayedTranscription = transcription

                                       return newState;
                                   }, () => {
                                       if (attackJobStatus.attackTerminated) {
                                           Backend.fetchAudioBlob(this.props.cardID)
                                               .then(audioBlob => {
                                                   this.setState((prevState, props) => {
                                                       let newState = {audioHistory: prevState.audioHistory};

                                                       newState.audioHistory[itemIndex].info = 'done';
                                                       newState.audioHistory[itemIndex].audioBlob = audioBlob

                                                       if (prevState.displayedAudioItemIndex === itemIndex);
                                                           newState.displayedTranscription = newState.audioHistory[itemIndex].transcription;

                                                       return newState;
                                                   });
                                               });
                                       } else setTimeout(getAndProcessStatus, 1000);
                                   });
                               });
                        }; getAndProcessStatus();
                    });

                    this.showAudioItemFromHistory(itemIndex);
                });
        }
    }

    render() {
        let card_body_container;
        if (this.state.displayedAudioBlob === null) {
            card_body_container = (
                <div className="card-body-container">
                    <div className="card-body text-dark">
                        <AudioDropZone
                            onAudioFileInput={this.handleAudioFileInput} />
                    </div>
                </div>
            );
        } else {
            const audioItem = this.state.audioHistory[this.state.displayedAudioItemIndex];

            card_body_container = (
                <div className="card-body-container">
                    <div className="audio-file-name">
                        {this.state.originalAudioFileName}
                    </div>

                    <AudioWaveform
                        cardID={this.props.cardID}
                        audioBlob={audioItem.audioBlob}
                        className={(
                            audioItem.label === 'preprocessed' ?
                            audioItem.info.toLowerCase() : audioItem.label
                        )} />

                    <BreadcrumbPanel
                        audioHistory={this.state.audioHistory}
                        currentAudioItemIndex={this.state.displayedAudioItemIndex}
                        onBreadcrumbClick={this.handleBreadcrumbClick}
                        onAttackIntent={this.handleAttackIntent}
                        onPreprocessIntent={this.handlePreprocessIntent} />

                    <div className="card-body text-dark" >
                        <Transcription
                            cardID={this.props.cardID}
                            className={audioItem.label === 'preprocessed' ?
                                audioItem.info.toLowerCase() : audioItem.label}
                            text={this.state.displayedTranscription} />
                    </div>
                </div>
            );
        }

        let close_button = (
            <div className="btn-close-audio-card" onClick={this.props.onClose}>
                <i className="fas fa-times-circle"></i>
            </div>
        );

        return (
            <div className="card mb-3">
                {close_button}
                {card_body_container}
            </div>
        );
    }
}

export default AudioCard;
