import React, { Component } from 'react';
import CodeCesar from './components/CodeCesar/CodeCesar.component'

class CodeCesarPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <CodeCesar
                parcoursInfo={this.props.route.params.parcoursInfo}
                parcours={this.props.route.params.parcours}
                currentGame={this.props.route.params.currentGame}
            />
        );
    }

}

export default CodeCesarPage
