// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, getDoc, getFirestore, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { getStorage, uploadString, getDownloadURL, ref } from "firebase/storage";
import { sign } from "crypto";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// ##########################################################
// ############### Funciones de autenticación ###############
// ##########################################################

export const signIn = async(user: {email: string, password: string}) => {
  return await signInWithEmailAndPassword(auth, user.email, user.password);
}

// Crear un nuevo usuario
export const createUser = async(user: {email: string, password: string}) => {
  return await createUserWithEmailAndPassword(auth, user.email, user.password);
}

// Actualizar el nombre de usuario y/o foto de perfil
export const updateUser = async(user: {displayName?: string, photoURL?: string | null | undefined}) => {
  if(auth.currentUser) {
    return await updateProfile(auth.currentUser, user);
  }
}

// Cerrar sesion
export const signOutAccount = () => {
  localStorage.removeItem('user');
  return auth.signOut();
}

// ##########################################################
// ############### Funciones de base de datos ###############
// ##########################################################

// Get un documento en una coleccion
export const getDocument = async (path: string) => {
  return (await (getDoc(doc(db, path)))).data();
}

// Setear un documento en una coleccion
export const setDocument = (path: string, data: any) => {
  data.createdAt = serverTimestamp();
  return setDoc(doc(db, path), data);
}

// Updatear un documento en una coleccion
export const updateDocument = (path: string, data: any) => {
  console.log(`Intentando guardar en ${path}`);
  return updateDoc(doc(db, path), data);
}

// ##########################################################
// ############## Funciones de almacenamiennto ##############
// ##########################################################

// Subir un archivo con formato base4, retorna su URL
export const uploadBase64 = async (path: string, base64: string) => {
  return uploadString(ref(storage, path), base64, 'data_url').then(()=>{
    return getDownloadURL(ref(storage, path));
  })
}