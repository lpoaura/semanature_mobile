import { db } from '../config/firebaseConfig';
import { collection, getDocs, getDoc, doc, query, where } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

//Return commune names in an array that match with 'cityName'
export async function searchAndGetCommunes(cityName) {
  const communes = [];

  try {
    // Get collection reference
    const communeCollectionRef = collection(db, 'commune');

    // Create query (filter)
    const q = query(communeCollectionRef, where("nom", "==", cityName));

    // Execute query
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const commune = {
        nom: doc.data().nom,
        code_postal: doc.data().code_postal
      };
      communes.push(commune);
    });
  } catch (error) {
    console.error("Error fetching communes:", error);
  }

  return communes;
}

// Return all communes that exist in database
export async function getAllCommunes() {
	const communes = [];
	const res = await getDocs(collection(db, "commune"));
	res.forEach((doc) => {
		const nomplucode = doc.data().nom + " (" + doc.data().code_postal + ")";
		communes.push(nomplucode);
	})
	return communes;
}

// Return all circuits from the given city
// Input : City name (string)
// Output : Circuits { titre, description, commune } (object)
export async function getParcoursFromCommune(cityName, id = "") {

	let blocked = false;
	if (await checkQueryQuota(40, 50) == "block") {
		blocked = true;
	}
	const parcours = [];

	let q;
	if (id === "") {
		// Get collection reference
		const parcoursCollectionRef = collection(db, 'parcours');

		// Create query (filter)
		q = query(parcoursCollectionRef, where("commune", "==", cityName), where("brouillon", "==", false));

		const querySnapshot = await getDocs(q);
		await Promise.all(querySnapshot.docs.map(async (doc) => {
			let image_url = ""
			if (!blocked) {
				image_url = (doc.data().image_url) == "" ? doc.data().image_url : await getDataURLFromURL(doc.data().image_url);
			}
			const temp = {
				identifiant: doc.id,
				titre: doc.data().titre,
				description: doc.data().description,
				commune: doc.data().commune,
				duree: doc.data().duree,
				difficulte: doc.data().difficulte,
				image_url: image_url,
				etape_max: doc.data().etape_max
			}
			parcours.push(temp);
		}));
	} else {
		const snapShotDoc = await getDoc(doc(db, "parcours", id));
		let image_url = ""
		if (!blocked) {
			image_url = (snapShotDoc.data().image_url) == "" ? snapShotDoc.data().image_url : await getDataURLFromURL(snapShotDoc.data().image_url);
		}
		const temp = {
			identifiant: snapShotDoc.id,
			titre: snapShotDoc.data().titre,
			description: snapShotDoc.data().description,
			commune: snapShotDoc.data().commune,
			duree: snapShotDoc.data().duree,
			difficulte: snapShotDoc.data().difficulte,
			image_url: image_url,
			etape_max: snapShotDoc.data().etape_max
		}
		parcours.push(temp);
	}
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
// If the parcours does not exist : Output : {}
export async function getParcoursContents(id) {
	try {
		if (await checkQueryQuota(40, 50) == "block") {
			return {};
		}

		const docRefParcours = doc(db, "parcours", id);
		const docSnap = await getDoc(docRefParcours);
		const pathSubColEtape = "/parcours/" + id + "/etape";
		const docRefCommune = doc(db, "commune", docSnap.data().commune.toLowerCase());
		const communeDocSnap = await getDoc(docRefCommune);
		const res = {};

		if (docSnap.exists() && communeDocSnap.exists()) {

			// Get postal code
			res.code_postal = communeDocSnap.data().code_postal;

			// Get all docs at pathSubColEtape
			const querySnapshot = await getDocs(collection(db, pathSubColEtape));
			const subColRes = [];

			// Iterate through the documents fetched
			await Promise.all(querySnapshot.docs.map(async (queryDocumentSnapshot) => {

				var etapeInfo = {
					id_etape: queryDocumentSnapshot.id,
					etape: queryDocumentSnapshot.data()
				}
				if (etapeInfo.etape.image_url && etapeInfo.etape.image_url != "") {
					etapeInfo.etape.image_url = await getDataURLFromURL(etapeInfo.etape.image_url);
				}
				if (etapeInfo.etape.audio_url && etapeInfo.etape.audio_url != "") {
					etapeInfo.etape.audio_url = await getAudioDataURLFromURL(etapeInfo.etape.audio_url);
				}
				if (etapeInfo.etape.images_tab) {
					for (var i = 0; i < etapeInfo.etape.images_tab.length; i++) {
						etapeInfo.etape.images_tab[i] = await getDataURLFromURL(etapeInfo.etape.images_tab[i]);
					}
				}

				subColRes.push(etapeInfo);
			}))

			res.etapes = subColRes;
			
		} else {
			// docSnap.data() will be undefined in this case
			console.log("No such document !");
		}

		return res;

	} catch (error) {
		console.error("Error getting parcours contents: ", error);
		return { error: "An error occurred while fetching parcours contents." };
	}
}

async function getAudioDataURLFromURL(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch resource: ${response.status} ${response.statusText}`);
        }

        const blob = await response.blob();
        return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
				const dataUrl = reader.result;
                const base64Data = dataUrl.split(',')[1]; // Remove prefix to keep the data only
				resolve(base64Data);
			}
            reader.onerror = () => reject(new Error("Failed to read Blob as Data URL"));
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error("Error in getDataURLFromURL:", error);
        throw error;
    }
}

async function getDataURLFromURL(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch resource: ${response.status} ${response.statusText}`);
        }

        const blob = await response.blob();
        return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = () => reject(new Error("Failed to read Blob as Data URL"));
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error("Error in getDataURLFromURL:", error);
        throw error;
    }
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

	// dépassement de la limite du jour, blockage des requêtes
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

//Fonction pour la carte

export async function getParcoursDonne() {
	const parcoursCollectionRef = collection(db, 'parcours');
	const q = query(parcoursCollectionRef, where('brouillon', '==', false)); // Add condition to filter 'brouillon' as false
	const querySnapshot = await getDocs(q);
  
	const parcoursDonne = [];
	querySnapshot.forEach(doc => {
	  const data = doc.data();
	  if (data.gps) { // Check if gps exists
		const { latitude, longitude } = data.gps;
		parcoursDonne.push({
		  identifiant: doc.id,
		  commune: data.commune,
		  latitude: latitude,
		  longitude: longitude,
		  titre: data.titre,
		  difficulte: data.difficulte,
		  duree: data.duree
		});
	  } else {
		console.warn(`No GPS data for document ${doc.id}`);
	  }
	});
  
	return parcoursDonne;
  }
