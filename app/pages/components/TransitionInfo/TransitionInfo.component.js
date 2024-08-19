import React, { Component } from 'react';
import { View, Text, Image, BackHandler, ScrollView, TouchableOpacity } from 'react-native';
import styles from './TransitionInfo.component.style';
import TopBarre from './../../../components/TopBarre/TopBarre.component'
import { SafeAreaView } from 'react-native-safe-area-context';
import NextPage from './../../components/NextPage/NextPage.component'
import { useNavigation } from '@react-navigation/native';
import { parseText } from '../../../utils/parseText';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

class TransitionInfo extends Component {
    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
            audio: null
        };
    }

    componentDidMount() {
        const { parcours } = this.props;
        const size = parcours.length;
        console.log(parcours[size-1].parcoursId)
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

    handleBackButtonClick() {
        return true;
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

    render() {
        const paragraph = parseText(this.props.currentGame.texte);
        const title = this.props.currentGame.nom;
        const illustration = this.props.currentGame.image_url;
        const etapeMax = this.props.parcoursInfo.etape_max;
        let topBarreName = etapeMax === undefined ? "" : `Étape : ${this.props.currentGame.n_etape}/${etapeMax}`;
        
        return (
            <SafeAreaView style={styles.outsideSafeArea}>
                <TopBarre name={topBarreName} />
                <View style={styles.globalContainer}>
                    <ScrollView contentContainerStyle={styles.scrollViewContainer} style={styles.scrollView}>
                        <View style={styles.card}>
                            <Text style={styles.title}>{title}</Text>
                            {illustration !== '' && <Image source={{ uri: illustration }} style={styles.areaImage} />}
                            <Text style={styles.description}>{paragraph}</Text>
                            {this.props.currentGame.audio_url && (
                                <TouchableOpacity style={styles.audioButton} onPress={() => this.playSound()}>
                                    <Text style={styles.audioButtonText}>🔊</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        <NextPage
                            pageName="GamePage"
                            parameters={{ parcoursInfo: this.props.parcoursInfo, parcours: this.props.parcours }}
                        />
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }
}

export default function (props) {
    const navigation = useNavigation();
    return <TransitionInfo {...props} navigation={navigation} />
}
