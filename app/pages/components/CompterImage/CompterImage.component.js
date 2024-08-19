import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, BackHandler, TextInput, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av'; // Import Audio from expo-av for sound handling
import styles from './CompterImage.component.style';
import TopBarre from './../../../components/TopBarre/TopBarre.component';
import { SafeAreaView } from 'react-native-safe-area-context';
import MainTitle from './../../../components/MainTitle/MainTitle.component';
import NextPage from './../../components/NextPage/NextPage.component';
import * as FileSystem from 'expo-file-system';

class CompterImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            reponse: this.props.currentGame.reponse,
            audio: null
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

    handleInputTextChange = (input) => this.setState({ value: input });

    render() {
        const { texte, nom, image_url } = this.props.currentGame;
        const etapeMax = this.props.parcoursInfo.etape_max;
        const topBarreName = etapeMax ? `Étape : ${this.props.currentGame.n_etape}/${etapeMax}` : '';
        const icone = require('./../../../assets/compter_image_icone.png');

        return (
            <SafeAreaView style={styles.outsideSafeArea}>
                <TopBarre name={topBarreName} />
                <View style={styles.globalContainer}>
                    <ScrollView contentContainerStyle={styles.scrollViewContainer} style={styles.scrollView}>
                        <View style={styles.card}>
                            <MainTitle title={nom} icone={icone} />
                            {image_url !== '' && <Image source={{ uri: image_url }} style={styles.areaImage} />}
                            <Text style={styles.description}>{texte}</Text>
                            {this.props.currentGame.audio_url && (
                                <TouchableOpacity style={styles.audioButton} onPress={() => this.playSound()}>
                                    <Text style={styles.audioButtonText}>🔊</Text>
                                </TouchableOpacity>
                            )}
                            <TextInput style={styles.inputTextField} onChangeText={this.handleInputTextChange} value={this.state.value} keyboardType='numeric' placeholder="NOMBRE" />
                        </View>
                        <View style={styles.rightAlign}>
                            <NextPage
                                pageName={"GameOutcomePage"}
                                parameters={{
                                    parcoursInfo: this.props.parcoursInfo,
                                    parcours: this.props.parcours,
                                    currentGame: this.props.currentGame,
                                    win: parseInt(this.state.value) === parseInt(this.state.reponse),
                                }}
                                text="Valider"
                                blockButton={true}
                            />
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }
}

export default function (props) {
    const navigation = useNavigation();
    return <CompterImage {...props} navigation={navigation} />;
}
