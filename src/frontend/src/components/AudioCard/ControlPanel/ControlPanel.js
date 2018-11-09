import React, {Component} from 'react';

import './ControlPanel.css';


class ControlPanel extends Component {
    render() {
        let notAttacked = this.props.attackStatus === null;
        let isAttacking = (this.props.attackStatus !== null
                           && this.props.attackStatus !== 'attacked');
        let isAttacked = (this.props.attackStatus !== null
                          && this.props.attackStatus === 'attacked');
        let isPreprocessed = this.props.preprocessingOption !== 'none';

        console.log(isAttacking);

        const staticMarginTop = '18px';
        const staticOpacity = 1.0;

        let attackBtnSpanStyle = {float: 'left'};
        if (isAttacking || isAttacked) {
            attackBtnSpanStyle.marginTop = staticMarginTop;
            attackBtnSpanStyle.opacity = staticOpacity;
        }

        let preprocessingOptionBtnSpanStyle = {float: 'right'};
        if (isPreprocessed) {
            preprocessingOptionBtnSpanStyle.marginTop = staticMarginTop;
            preprocessingOptionBtnSpanStyle.opacity = staticOpacity;
        }

        const preprocessingOptionElements = {
            none: (<span>No Preprocessing</span>),
            amr: (<span><span><i className="fas fa-shield-alt"></i></span> AMR</span>),
            mp3: (<span><span><i className="fas fa-shield-alt"></i></span> MP3</span>)
        };

        let attackBtnText, attackBtnStyle = {};
        if (notAttacked)
            attackBtnText = 'Attack!';
        else if (isAttacking) {
            attackBtnStyle.opacity = 1.0;
            attackBtnStyle.color = '#ffffff';
            attackBtnStyle.borderColor = '#bd2130';
            attackBtnStyle.backgroundColor = '#c82333';
            attackBtnText = `Attacking [${this.props.attackStatus} / 100]`;
        } else if (isAttacked){
            attackBtnStyle.opacity = 1.0;
            attackBtnStyle.color = '#ffffff';
            attackBtnStyle.borderColor = '#bd2130';
            attackBtnStyle.backgroundColor = '#c82333';
            attackBtnText = 'Attacked';
        }

        let preprocessingOptionBtnClass = 'btn-outline-info';
        if (this.props.preprocessingOption === 'amr')
            preprocessingOptionBtnClass = 'btn-primary';
        else if (this.props.preprocessingOption === 'mp3')
                preprocessingOptionBtnClass = 'btn-success';

        if (notAttacked && isPreprocessed)
            attackBtnSpanStyle.opacity = 0.0;

        if (isAttacking)
            preprocessingOptionBtnSpanStyle.opacity = 0.0;

        return (
            <div className="audio-control-panel">
                <span className="panel-btn" style={attackBtnSpanStyle}>
                    <button type="button" className="btn btn-outline-danger btn-sm"
                            onClick={this.props.onAttackButtonClick}
                            style={attackBtnStyle}
                            disabled={(isAttacking || isAttacked || isPreprocessed)} >
                        {attackBtnText}
                    </button>
                </span>

                <span className="panel-btn" style={preprocessingOptionBtnSpanStyle} >
                    <div className="btn-group">
                        <button className={`btn ${preprocessingOptionBtnClass} btn-sm dropdown-toggle`}
                                type="button"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                                disabled={isAttacking} >
                            {preprocessingOptionElements[this.props.preprocessingOption]}
                        </button>

                        <div className="dropdown-menu">
                            <button className="dropdown-item" type="button"
                                    onClick={e => this.props.onPreprocessingOptionChange('none', e)} >
                                {preprocessingOptionElements.none}
                            </button>
                            <button className="dropdown-item" type="button"
                                    onClick={e => this.props.onPreprocessingOptionChange('amr', e)} >
                                {preprocessingOptionElements.amr}
                            </button>
                            <button className="dropdown-item" type="button"
                                    onClick={e => this.props.onPreprocessingOptionChange('mp3', e)} >
                                {preprocessingOptionElements.mp3}
                            </button>
                        </div>
                    </div>
                </span>
            </div>
        );
    }
}

export default ControlPanel;
