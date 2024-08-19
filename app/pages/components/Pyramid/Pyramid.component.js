import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, BackHandler } from 'react-native';
import styles from './Pyramid.component.style';
import TopBarre from './../../../components/TopBarre/TopBarre.component';
import { useNavigation } from '@react-navigation/native';
import generateValues from './generateValues';
import CircleLine from './CircleLine'
import { SafeAreaView } from 'react-native-safe-area-context';
import MainTitle from './../../../components/MainTitle/MainTitle.component';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';


/**
 * Classe du component pour le jeu calcul pyramidale
 */
class Pyramid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lastCircleValue: '',
            audio: null,
            confirmClicked: false,
            s: generateValues(this.props.currentGame.nombre) // initialise les valeurs des premiers cercles avec la fonction generateValues
        };
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        this.loadAudio();
    }
    
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
        const { audio } = this.state;
        if (audio) {
            audio.unloadAsync();
            const fileUri = FileSystem.documentDirectory + 'temp_audio.mp3';
            FileSystem.deleteAsync(fileUri).catch(error => console.warn('Error deleting temporary audio file :', error.message));
        }
    }

    async loadAudio() {
        const audioURL = this.props.currentGame.audio_url;
        if (audioURL && audioURL !== '') {
            const { audio } = this.state;
            if (audio) {
                await audio.unloadAsync();
            }

            // Write the base64 string to a temporary file
            const fileUri = FileSystem.documentDirectory + 'temp_audio.mp3';
            await FileSystem.writeAsStringAsync(fileUri, audioURL, {
                encoding: FileSystem.EncodingType.Base64,
            });

           // Load the audio
            const newAudio = await Audio.Sound.createAsync(
                { uri: fileUri },
                { shouldPlay: false }
            );
            this.setState({ audio: newAudio.sound });
        }
    }

    async playSound() {
        const { audio } = this.state;
        if (audio) {
            console.log("playing audio");
            await audio.playAsync();
        }
    }
    
    handleBackButtonClick() {
        return true;
    }

    handleConfirmClicked = () => {
        if (!this.state.confirmClicked) {
            this.setState({ confirmClicked: true });
        }
    }

    handleInputTextChange = (input) => this.setState({ lastCircleValue: input })

    render() {
        const question = this.props.currentGame.question;
        const title = this.props.currentGame.nom;
        const result = this.props.currentGame.nombre;
        const illustration = this.props.currentGame.image_url;
        const etapeMax = this.props.parcoursInfo.etape_max;
        if (etapeMax === undefined) {
            var topBarreName = "";
        } else {
            var topBarreName = "Étape : " + this.props.currentGame.n_etape + "/" + etapeMax;
        }
        const textRegles = "Remplir la pyramide jusqu'en bas selon le principe suivant : chaque case vide doit contenir la somme des deux cases qui se trouvent au-dessus"
        const icone = require('./../../../assets/calcul_pyramidal_icone.png');

        return (
            <SafeAreaView style={styles.outsideSafeArea}>
                <TopBarre name={topBarreName} />
                <View style={styles.globalContainer}>
                    <ScrollView contentContainerStyle={styles.scrollViewContainer} style={styles.scrollView}>
                        <View style={styles.card}>

                            <MainTitle title={title} icone={icone} />
                            {(illustration !== '') && (<Image source={{ uri: illustration }} style={styles.areaImage} />)}
                            <Text style={styles.description}>{textRegles}</Text>
                            <Text style={styles.description}>{question}</Text>

                            {this.props.currentGame.audio_url && (
                                <TouchableOpacity style={styles.audioButton} onPress={() => this.playSound()}>
                                    <Text style={styles.audioButtonText}>🔊</Text>
                                </TouchableOpacity>
                            )}

                            <View style={styles.gameArea}>

                                <CircleLine count={4} edit={false} preFill={true} s={this.state.s} />
                                <CircleLine count={3} edit={true} preFill={false} />
                                <CircleLine count={2} edit={true} preFill={false} />
                                <CircleLine count={1} edit={true} onChangeText={this.handleInputTextChange} value={this.state.lastCircleValue} preFill={false} />
                            
			                </View>
                        </View>
                        <View style={styles.rightAlign}>
                            <TouchableOpacity style={styles.bouton}
                                disabled={this.state.confirmClicked}
                                onPress={() => {
                                    this.handleConfirmClicked();

                                    // dans la fonction generateValues, on récupère seulement les deux premières unités du résultat
                                    // pour que le résultat soit cohérent, il faut appliquer la même transformation ici
                                    var win = 0;
                                    var newResult = parseInt(String(result).substring(0, 2), 10);
                                    // de la même manière que dans generateValues, si le résultat est un chiffre, 
                                    // il deviendra un nombre décimal qu'il faut donc multiplier par 10 pour retrouver la bonne valeure
                                    if (Math.trunc(newResult) == 0) {
                                        newResult = newResult * 10;
                                    }
                                    if (parseInt(this.state.lastCircleValue) === newResult) {
                                        win = 1;
                                    }

                                    // Navigate to the outcome page
                                    this.props.navigation.navigate("GameOutcomePage", { parcoursInfo: this.props.parcoursInfo, parcours: this.props.parcours, currentGame: this.props.currentGame, win: win });
                                }}>
                                <Text style={styles.boutonText}>Valider</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }
}

export default function (props) {
    const navigation = useNavigation();
    return <Pyramid {...props} navigation={navigation} />
}
