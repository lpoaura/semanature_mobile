import { StyleSheet } from 'react-native';
import theme from '../../../styles/theme.style'
import common from '../../../styles/common.style.js'

export default StyleSheet.create({
    title: {
        ...common.title
    },
    globalContainer: {
        ...common.globalContainer,
    },
    description: {
        ...common.description
    },
    bouton: {
        ...common.bouton,
        backgroundColor: theme.LIGHT_GRAY_COLOR
    },
    card: {
        ...common.card,
    },
    imageContainer: {
        ...common.imageArea,
        minWidth: '50%',
        height: '40%',
    },
    rowFlex: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    gameZone: {
        minHeight: '55%',
        alignSelf: 'center',
    },
    image: {
        resizeMode: 'contain',
        height: '100%',
        width: '100%'
    },
    outsideSafeArea: {
        ...common.outsideSafeArea,
    },
    scrollViewContainer: {
        ...common.scrollViewContainer
    },
    scrollView: {
        ...common.scrollView
    },
    audioButton: {
        ...common.audioButton,
    },
    audioButtonText: {
        ...common.audioButtonText,
    }

})
