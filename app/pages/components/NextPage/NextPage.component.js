import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './NextPage.component.style';

import { useNavigation } from '@react-navigation/native';

/** 
 * Classe NextPage permettant d'ajouter un bouton de redirection vers une nouvelle page
 * 
 * Pour créer une page :
 * - Ajoutez une page dans la fonction HomeStack de navigation
 * - Instanciez un composant NextPage comme cela :
 *  \<NextPage
 *        pageName = nomDeLaPageAAjouter
 *        parameters = {varName:varValue}
 *        text = textAEcrireSurLeBouton
 *  />
*/
class NextPage extends Component {
    constructor(props) {
        super(props);
        this.state = { confirmClicked: false };
    }

    // rend le bouton non clickable
    handleConfirmClicked = () => {
        if (!this.state.confirmClicked) {
            this.setState({ confirmClicked: true });
        }
    }

    render() {

        // objet pour changer de page
        const navigation = this.props.navigation;

        // parametres du bouton
        const pageName = this.props.pageName;
        const parameters = this.props.parameters;
        var blockButton = this.props.blockButton;
        let text = this.props.text;

        // valeur par défaut
        if (text == undefined) {
            text = 'Page suivante';
        }

        // affichage
        return (
            <View style={styles.bottomAlign}>
                <TouchableOpacity
                    disabled={this.state.confirmClicked}
                    onPress={() => {
                        if (blockButton != undefined) {
                            this.handleConfirmClicked();
                        }
                        navigation.navigate(pageName, parameters);
                    }} style={styles.bouton}>
                    <Text style={styles.boutonText}>{text}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

/** 
 * Pour créer une page :
 * - Ajoutez une page dans la fonction HomeStack de navigation
 * - Instanciez un composant NextPage comme cela :
 *  \<NextPage
 *        pageName = nomDeLaPageAAjouter
 *        parameters = {varName:varValue}
 *        text = textAEcrireSurLeBouton
 *  />
*/
export default function (props) {
    const navigation = useNavigation();
    return <NextPage {...props} navigation={navigation} />;
}