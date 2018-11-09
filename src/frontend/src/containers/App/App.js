import React, {Component} from 'react';

import Header from '../Header';
import CardList from '../CardList';

// eslint-disable-next-line
import Backend from '../../backend';

import './App.css';


class App extends Component {
    render() {
        return (
            <div className="app">
                <Header />
                <CardList />
            </div>
        );
    }
}

export default App;
