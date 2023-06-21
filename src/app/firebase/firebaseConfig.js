import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { collection } from "firebase/firestore";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import database from "../utils/db.json";

const firebaseConfig = {
  apiKey: "AIzaSyAozIgnlrpuCJPxwaPv48bkvnN7Sm8m2u8",
  authDomain: "petventure-2f665.firebaseapp.com",
  projectId: "petventure-2f665",
  storageBucket: "petventure-2f665.appspot.com",
  messagingSenderId: "1012719367395",
  appId: "1:1012719367395:web:87d717f9f44e8fbd3a01d6",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);

export const getAllProducts = async () => {
  const querySnapshot = await getDocs(collection(db, "productos"));
  const products = [];
  querySnapshot.forEach((doc) => {
    products.push({ id: doc.id, ...doc.data() });
  });
  return products;
};
export const getAllPurchases = async () => {
  const querySnapshot = await getDocs(collection(db, "compras"));
  const purchases = [];
  querySnapshot.forEach((doc) => {
    purchases.push({ id: doc.id, ...doc.data() });
  });
  return purchases;
};

export const getAllUsers = async () => {
  const querySnapshot = await getDocs(collection(db, "users"));
  const users = [];
  querySnapshot.forEach((doc) => {
    users.push({ id: doc.id, ...doc.data() });
  });
  return users;
};

export const addProduct = async (product) => {
  const docRef = await addDoc(collection(db, "productos"), product);
  return docRef;
};

export async function userExist(uid) {
  const docRef = doc(db, "users", uid);
  const res = await getDoc(docRef);
  console.log(res);
  return res.exists();
}

export async function existsUserName(username) {
  const users = [];
  const docsRef = collection(db, "users");
  const q = query(docsRef, where("username", "==", username));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    users.push(doc.data());
  });
  return users.length > 0 ? users[0].uid : null;
}

export async function registerNewUser(user) {
  try {
    const collectionRef = collection(db, "users");
    const docRef = doc(collectionRef, user.uid);
    await setDoc(docRef, user);
  } catch (error) {}
}

export async function updateUser(user, onSuccess) {
  try {
    const collectionRef = collection(db, "users");
    const docRef = doc(collectionRef, user.uid);
    await setDoc(docRef, user);
    onSuccess();
  } catch (error) {
    console.error(error);
  }
}

export async function updateProduct(product, onSuccess) {
  try {
    onSuccess();
    const collectionRef = collection(db, "productos");
    const docRef = doc(collectionRef, product.id);
    console.log(product);
    await setDoc(docRef, product);
  } catch (error) {
    console.error(error);
  }
}

export async function getUserInfo(uid) {
  const docRef = doc(db, "users", uid);
  const document = await getDoc(docRef);
  return document.data();
}
export async function logout() {
  await auth.signOut();
}
export default async function addDocuments() {
  for (const producto of database) {
    const ref = await addDoc(collection(db, "productos"), producto);
    console.log(ref);
  }
}

export async function registerNewPurchase(carrito, id, user) {
  console.log("carrito firebase", carrito, user);
  try {
    let fecha = new Date();
    let opciones = { day: "2-digit", month: "2-digit", year: "2-digit" };
    let fechaFormateada = fecha.toLocaleDateString("es-ES", opciones);

    for (const producto of carrito) {
      const ref = await addDoc(collection(db, "compras"), {
        ...producto,
        fecha: fechaFormateada,
        orderId: id,
        user: user,
      });
      console.log(ref);
    }
  } catch (error) {
    console.error("Error al agregar la compra:", error);
  }
}
