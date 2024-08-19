import React, { Component } from 'react';
import TransitionGPS from './components/TransitionGPS/TransitionGPS.component.js'

class TransitonGPSPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TransitionGPS
                parcoursInfo={this.props.route.params.parcoursInfo}
                parcours={this.props.route.params.parcours}
                currentGame={this.props.route.params.currentGame}
            />
        );
    }
}

export default TransitonGPSPage
