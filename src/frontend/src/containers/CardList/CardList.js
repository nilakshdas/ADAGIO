import React, {Component} from 'react';
import {CSSTransition, TransitionGroup} from 'react-transition-group';

import AudioCard from '../../components/AudioCard';
import DummyCard from './DummyCard';

import './CardList.css';


class CardList extends Component {
    constructor(props) {
        super(props);

        this.addDummyCard = this.addDummyCard.bind(this);
        this.addNewAudioCard = this.addNewAudioCard.bind(this);

        this.state = {
            cards: []
        };
    }

    addDummyCard() {

    }

    addNewAudioCard(e) {
        if (e !== undefined)
            e.preventDefault();

        const timestamp = (new Date()).getTime();
        const randomNumber = Math.floor(Math.random() * 10000);
        const cardID = 'audiocard-'+timestamp+'-'+randomNumber;
        let card = (
            <CSSTransition
                    key={cardID}
                    cardID={cardID}
                    in={true}
                    timeout={300}
                    classNames="card">
                <AudioCard
                    cardID={cardID}
                    onClose={(e) => {
                        this.removeAudioCard(cardID)
                    }} />
            </CSSTransition>
        );

        this.setState((prevState, props) => {
            let cards = prevState.cards;
            cards.push(card);

            return {cards: cards};
        });
    }

    removeAudioCard(cardID) {
        this.setState((prevState, props) => {
            return {
                cards: prevState.cards
                       .filter((card) => card.props.cardID !== cardID)
            };
        });
    }

    componentDidMount() {
        setTimeout(e => this.addNewAudioCard(), 200);


        document.addEventListener(
            'add-audio-card-click', this.addNewAudioCard
        );
    }

    componentWillUnmount() {
        document.removeEventListener(
            'add-audio-card-click',
            this.addNewAudioCard
        );
    }

    render() {
        return (
            <div className="card-list-container">
                <TransitionGroup className="card-list">
                    {this.state.cards}

                    <DummyCard
                        onClick={this.addNewAudioCard} />
                </TransitionGroup>
            </div>
        );
    }
}

export default CardList;
