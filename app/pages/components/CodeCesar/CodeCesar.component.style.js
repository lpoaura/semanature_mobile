import { StyleSheet } from 'react-native';
import common from '../../../styles/common.style.js'

export default StyleSheet.create({
    card: {
        ...common.card
    },
    title: {
        ...common.title
    },
    globalContainer: {
        ...common.globalContainer,
        backgroundColor: "white",
    },
    areaImage: {
        ...common.areaImage,
    },
    inputTextField: {
        ...common.inputTextField,
    },
    bouton: {
        ...common.bouton,
    },
    boutonText: {
        ...common.boutonText,
    },
    description: {
        ...common.description,
    },
    encodedText: {
        ...common.bouton,
        ...common.boutonText,
        margin: 20,
        borderRadius: 20,
        backgroundColor: '#3f870c',
    },
    scrollViewContainer: {
        ...common.scrollViewContainer,
    },
    scrollView: {
        ...common.scrollView,
    },
    rightAlign: {
        ...common.rightAlign,
    },
    outsideSafeArea: {
        ...common.outsideSafeArea,
    },
});