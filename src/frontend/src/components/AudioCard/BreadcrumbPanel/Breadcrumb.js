import React, {Component} from 'react';


class Breadcrumb extends Component {
    render() {
        const badgeLabel = {
            original: 'Original',
            preprocessed: this.props.audioItem.info,
            attacked: (
                this.props.audioItem.info !== 'done' ?
                    `Attacking ${this.props.audioItem.info}` : 'Attacked'
            )
        }[this.props.audioItem.label];

        const badgeIcon = {
            original: null,
            preprocessed: (<i className="fas fa-shield-alt"></i>),
            attacked: (<i className="fas fa-exclamation-triangle"></i>)
        }[this.props.audioItem.label];

        const badgeClassName = {
            original: 'badge-secondary audio-item-original',
            preprocessed: (
                this.props.audioItem.info === 'AMR' ?
                    'badge-success audio-item-amr' : 'badge-primary audio-item-mp3'
            ),
            attacked: 'badge-danger audio-item-attacked'
        }[this.props.audioItem.label];

        let breadcrumbBadgeContainerDiv = (
            <div className="badge-container">
                <a href="#"
                        className={"badge"
                            + " " + badgeClassName
                            + (this.props.isCurrentItem ? " current":"")
                        }
                        onClick={this.props.onClick}>
                    {badgeIcon} {badgeLabel}
                </a>
            </div>
        );

        let separatorDiv = null;
        if (!this.props.isLastItem) {
            separatorDiv = (
                <div className="icon-container separator">
                    <i className="fas fa-arrow-right"></i>
                </div>
            );
        }

        return  (
            <div className="breadcrumb-panel-item">
                {breadcrumbBadgeContainerDiv}
                {separatorDiv}
            </div>
        );
    }
}

export default Breadcrumb;
