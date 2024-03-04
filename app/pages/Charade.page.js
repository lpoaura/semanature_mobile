import React, { Component } from 'react';
import Charade from './components/Charade/Charade.component'

class CharadePage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Charade
                parcours={this.props.route.params.parcours}
                currentGame={this.props.route.params.currentGame}
            />
        );
    }

}

export default CharadePage