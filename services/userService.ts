// this service is for the user model

import { db } from "@/firebaseConfig";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { User } from "@/models/userModel";

const userCollection = collection(db, "users");

// add a new user
export const createUser = async (user: User): Promise<void> => {
  const userRef = doc(userCollection, user.id);
  await setDoc(userRef, user);
};

// get user by id
export const getUserById = async (id: string): Promise<User | null> => {
  const docRef = doc(userCollection, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as User;
  } else {
    return null;
  }
};

// update user by id
export const updateUserById = async (
  id: string,
  updates: Partial<User>
): Promise<void> => {
  const docRef = doc(userCollection, id);
  await updateDoc(docRef, updates);
};

// delete user by id
export const deleteUserById = async (id: string): Promise<void> => {
  const docRef = doc(userCollection, id);
  await deleteDoc(docRef);
};
