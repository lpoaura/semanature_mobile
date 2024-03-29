import { db } from '../config/firebaseConfig';
import { collection, getDocs, getDoc, doc, query, where } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

//Return commune names in an array that match with 'cityName'
export async function searchAndGetCommunes(cityName) {
	const communes = [];

	// Get collection reference
	const communeCollectionRef = collection(db, 'commune');

	// Create query (filter)
	const q = query(communeCollectionRef, where("nom", "==", cityName));

	const querySnapshot = await getDocs(q);
	querySnapshot.forEach((doc) => {
		co = {
			nom: doc.data().nom,
			code_postal: doc.data().code_postal
		}
		communes.push(co);
	});
	return communes;
}

// Return all communes which exist in database
export async function getAllCommunes() {
	const communes = [];
	const res = await getDocs(collection(db, "commune"));
	res.forEach((doc) => {
		const nomplucode = doc.data().nom + " (" + doc.data().code_postal + ")";
		communes.push(nomplucode);
	})
	return communes;
}

// Return all parcours from the commune given in argument
// Input : Commune name (string)
// Output : Parcours { titre, description, commune } (object)
export async function getParcoursFromCommune(cityName) {

	let blocked = false;
	if (await checkQueryQuota(40, 50) == "block") {
		blocked = true;
	}
	const parcours = [];

	// Get collection reference
	const parcoursCollectionRef = collection(db, 'parcours');

	// Create query (filter)
	const q = query(parcoursCollectionRef, where("commune", "==", cityName), where("brouillon", "==", false));

	const querySnapshot = await getDocs(q);
	await Promise.all(querySnapshot.docs.map(async (doc) => {
		let image_url = ""
		if (!blocked) {
			image_url = (doc.data().image_url) == "" ? doc.data().image_url : await getDataURLFromURL(doc.data().image_url);
		}
		const pa = {
			identifiant: doc.id,
			titre: doc.data().titre,
			description: doc.data().description,
			commune: doc.data().commune,
			duree: doc.data().duree,
			difficulte: doc.data().difficulte,
			image_url: image_url,
			etape_max: doc.data().etape_max
		}
		parcours.push(pa);
	}));
	return parcours;
}

// Return parcours content from id (identifiant)
// Input : parcours id (identifiant exp : V4gp7A6yWUAxcaPWnqc6)
// Output : 
// {
//   general: {
//     commune: 'Saint-Etienne',
//     description: 'Petite balade en forêt en compagnie des oiseaux',
//     titre: 'Balade en forêt'
//   },
//   etapes: [ 
//      { id_etape: '0uXCxTBra7nBKQzc6jfB', etape : [Object (variable)] }, { id_etape: "Vv87ssNMTcsel1ytMUVU", etape : [Object (variable)] }, ...
//   ]
// }
// If the parcours doesnt exist : Output : {}
export async function getParcoursContents(id) {

	if (await checkQueryQuota(40, 50) == "block") {
		return {};
	}

	const docRefParcours = doc(db, "parcours", id);
	const docSnap = await getDoc(docRefParcours);
	const pathSubColEtape = "/parcours/" + docSnap.id + "/etape";
	const res = {};

	if (docSnap.exists()) {

		// Get general parcours info
		const generalInfo = {
			commune: docSnap.data().commune,
			titre: docSnap.data().titre,
			description: docSnap.data().description,
			max_etape: docSnap.data().etape_max
		}

		res.general = generalInfo;

		// Get all docs at pathSubColEtape
		const querySnapshot = await getDocs(collection(db, pathSubColEtape));
		const subColRes = [];

		// Iterate through the documents fetched
		await Promise.all(querySnapshot.docs.map(async (queryDocumentSnapshot) => {

			var etapeInfo =
			{
				id_etape: queryDocumentSnapshot.id,
				etape: queryDocumentSnapshot.data()
			}
			if (etapeInfo.etape.image_url != null && etapeInfo.etape.image_url != "") {
				etapeInfo.etape.image_url = await getDataURLFromURL(etapeInfo.etape.image_url);
			}
			if (etapeInfo.etape.images_tab != null) {
				for (var i = 0; i < etapeInfo.etape.images_tab.length; i++) {
					etapeInfo.etape.images_tab[i] = await getDataURLFromURL(etapeInfo.etape.images_tab[i]);
				}
			}

			subColRes.push(etapeInfo);
		}))

		res.etapes = subColRes;

		return res;
	} else {
		// docSnap.data() will be undefined in this case
		console.log("No such document!");
	}

	return res;
}

async function getDataURLFromURL(url) {
	return new Promise(function (resolve, reject) {
		const xhr = new XMLHttpRequest();
		xhr.responseType = 'blob';
		xhr.onload = (event) => {
			const blob = xhr.response;
			var reader = new FileReader();
			reader.readAsDataURL(blob);
			reader.onloadend = function () {
				let res = reader.result;
				resolve(res);
			}
		};
		xhr.open('GET', url);
		xhr.send();
	})
}

/**
 * Vérifie si le quota de requête du jour a été dépassé, et incrémente le nombre enregistré
 * @param {number} warningLimit 
 * @param {number} blockLimit 
 * @returns string
 */
async function checkQueryQuota(warningLimit, blockLimit) {
	let date = new Date();
	let currentDate = date.getUTCDate() + '-' + date.getUTCMonth() + '-' + date.getUTCFullYear();
	let nb_calls = await AsyncStorage.getItem("queries_calls");

	// première utilisation de l'app
	if (nb_calls == null) {
		let init = currentDate + '.' + 1;
		await AsyncStorage.setItem("queries_calls", init);
		console.log("query " + 1);
		return "ok";
	}
	let [previousDate, nbCalls] = nb_calls.split('.');

	// nouveau jour, reset du compteur
	if (currentDate != previousDate) {
		let init = currentDate + '.' + 1;
		await AsyncStorage.setItem("queries_calls", init);
		console.log("query " + 1);
		return "ok";
	}

	// dépassage de la limite du jour, blockage des requêtes
	// if (parseInt(nbCalls) >= blockLimit) {
	//   Alert.alert("Vous avez utilisé vos " + blockLimit + " téléchargements d'aujourd'hui.");
	//   console.log("query " + 10);
	//   return "block"
	// }

	// cas normal, on incrémente le nombre de requêtes du jour
	let increment = currentDate + '.' + (parseInt(nbCalls) + 1);
	await AsyncStorage.setItem("queries_calls", increment);

	// On approche de la limite, on envoie un message pour prévenir l'utilisateur
	// if (parseInt(nbCalls) >= warningLimit) {
	//   Alert.alert("Attention, vous avez utilisé " + nbCalls + " téléchargements sur " + blockLimit + " aujourd'hui.");
	//   return "warning";
	// }
	return "ok";
}