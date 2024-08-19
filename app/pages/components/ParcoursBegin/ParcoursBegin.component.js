import React, { Component, useEffect, useState } from 'react';
import { View, Image, Dimensions, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import databaseService from '../../../utils/localStorage';
import TopBarre from '../../../components/TopBarre/TopBarre.component'
import styles from './ParcoursBegin.component.style'
import NextPage from '../NextPage/NextPage.component'
import { SafeAreaView } from 'react-native-safe-area-context';
import MainTitle from '../../../components/MainTitle/MainTitle.component';

const windowWidth = Dimensions.get('window').width;

class ParcoursBegin extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const imageWidth = windowWidth * 0.8; // 80% of the window width
        const identifiant = this.props.identifiant;
        const parcoursInfo = this.props.parcoursInfo;
        const etapesData = this.props.etapesData;
        const parcoursEtapes = [];
        etapesData.forEach((element) => {
            parcoursEtapes.push(element.etape);
        });
        parcoursEtapes.sort((a, b) => a.ordre - b.ordre);
        const icone = require('./../../../assets/parcours_begin_icone.png');

        return (
            <SafeAreaView style={styles.outsideSafeArea}>
                <TopBarre name="Début du parcours" />
                <View style={styles.globalContainer}>
                    <View style={styles.card}>
                        <MainTitle title="C'est parti !!!" />
                        <Image
                            source={icone}
                            style={[styles.image, { width: imageWidth }]}
                        />
                    </View>

                    {!this.props.isInit ? ( // Affiche le loader si l'état 'loading' est vrai
                        <ActivityIndicator size="large" color={styles.activityIndicator.color} />
                    ) : (
                        <NextPage pageName="GamePage" parameters={{ parcoursInfo: parcoursInfo, parcours: parcoursEtapes, parcoursId: identifiant }} blockButton={true} text="Commencer" />
                    )}
                </View>
            </SafeAreaView>
        );
    };
}

export default function (props) {
    const navigation = useNavigation();
    const identifiant = props.identifiant;
    const [parcoursInfo, setParcoursInfo] = useState([]);
    const [etapesData, setEtapesData] = useState([]);
    const [isInit, setIsInit] = useState(false);
    useEffect(() => {
        async function loadParcours() {
            databaseService.getParcours(
                identifiant,
                (parcours) => {
                    if (parcours == undefined) {
                        console.error("Circuit not found in storage");
                    } else {
                        setIsInit(true);
                        setParcoursInfo(parcours.general);
                        setEtapesData(parcours.etapes);
                    }
                },
                (error) => {
                    console.error("Error while loading local circuit content :", error.message);
                }
            );
        }
        loadParcours();
    }, [])
    return <ParcoursBegin {...props} parcoursInfo={parcoursInfo} etapesData={etapesData} navigation={navigation} isInit={isInit} />;
}
