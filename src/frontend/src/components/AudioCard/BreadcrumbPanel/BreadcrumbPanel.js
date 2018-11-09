import React, {Component} from 'react';

import Breadcrumb from './Breadcrumb';

import './BreadcrumbPanel.css';


class BreadcrumbPanel extends Component {
    render() {
        const audioHistory = this.props.audioHistory;

        let breadcrumbs = audioHistory.map((audioItem, i) => (
            <Breadcrumb key={i}
                onClick={e => {this.props.onBreadcrumbClick(i, e)}}
                audioItem={audioItem}
                isCurrentItem={i === this.props.currentAudioItemIndex}
                isLastItem={i === audioHistory.length - 1} />
        ));

        let addBreadcrumbPanelItemDiv = (
            <div className="breadcrumb-panel-item">
                <div className="icon-container separator">
                    <i className="fas fa-arrow-right"></i>
                </div>

                <div className="icon-container plus">
                    <div className="btn-group dropright">
                        <a href="#" className="dropdown-toggle"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false">
                            <i className="fas fa-plus-square fa-lg"></i>
                        </a>

                        <div className="dropdown-menu">
                            <div className="dropdown-header">
                                <i className="fas fa-exclamation-triangle"></i> Perform Adversarial Attack
                            </div>
                            <a className="dropdown-item" href="#"
                                    onClick={this.props.onAttackIntent}>
                                <i className="fas fa-circle" style={{color: 'red'}}></i> CW Audio Attack
                            </a>

                            <div className="dropdown-divider"></div>

                            <div className="dropdown-header">
                                <i className="fas fa-shield-alt"></i> Apply Preprocessing Defense
                            </div>
                            <a className="dropdown-item" href="#"
                                    onClick={e => {this.props.onPreprocessIntent('amr', e)}}>
                                <i className="fas fa-circle" style={{color: 'green'}}></i> AMR Preprocessing
                            </a>
                            <a className="dropdown-item" href="#"
                                    onClick={e => {this.props.onPreprocessIntent('mp3', e)}}>
                                <i className="fas fa-circle" style={{color: 'blue'}}></i> MP3 Preprocessing
                            </a>
                          </div>
                    </div>
                </div>
            </div>
        );

        return  (
            <div className="breadcrumb-panel">
                {breadcrumbs}
                {addBreadcrumbPanelItemDiv}
            </div>
        );
    }
}

export default BreadcrumbPanel;
