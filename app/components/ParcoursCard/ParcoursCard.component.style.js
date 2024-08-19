import { StyleSheet } from 'react-native';
import theme from '../../styles/theme.style.js'
import common from '../../styles/common.style.js'

export default StyleSheet.create({
	title: {
		...common.title
	},

	card: {
		...common.card,
	},

	texte: {
		color: theme.DARK_GRAY_COLOR,
		marginBottom: 10,
	},

	texte_imp: {
		color: theme.DARK_GRAY_COLOR,
		fontWeight: theme.FONT_WEIGHT_BOLD,
	},

	imagecontainer: {
		width: 200,
		height: 200,
		marginBottom: 15,
		resizeMode: 'contain',
		alignSelf: 'center',
	},

	bouton: {
		...common.bouton,
		paddingHorizontal: 0,
		flex: 1,
		marginHorizontal: 5,
	},

	bouton2: {
		...common.bouton,
		paddingHorizontal: 0,
		flex: 1,
		marginHorizontal: 5,
		alignSelf: 'center',
	},

	boutonText: {
		...common.boutonText,
		flexGrow: 1,
		textAlignVertical: 'center',
	},

	rowFlex: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		textAlign: 'center',
		alignSelf: 'center',
	},

	infoRowFlex: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		alignSelf: 'center',
		marginBottom: 10, 
	},

    activityIndicator: {
        ...common.activityIndicator,
		alignSelf: 'center',
		marginVertical: 20,
    }
})
