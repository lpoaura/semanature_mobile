// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore"
import unOffuscate from "./unOffuscate";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "<apiKey>",
	authDomain: "<authDomain>",
	projectId: "<projectId>",
	storageBucket: "<storageBucket>",
	messagingSenderId: "<messagingSenderId>",
	appId: "<appId>"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth();

export const autoSignIn = async () => {
	try {
		const email = "<email>";
		const password = "<password>";
		await signInWithEmailAndPassword(auth, email, unOffuscate(password));
		console.log("Utilisateur connecté avec succès !");
		// Vous pouvez exécuter d'autres actions après la connexion réussie ici
	} catch (error) {
		console.log("Erreur lors de la connexion :", error);
	}
};


// Initialize Firebase

export const db = getFirestore(app);
