import { db } from "@/firebaseConfig";
import { TravelModel } from "@/models/travelModel";
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

export type TravelModelInput = Omit<
  TravelModel,
  | "travelId"
  | "locationUpdates"
  | "isTrackingActive"
  | "startedAt"
  | "completedAt"
>;

/// Create a new travel document in Firestore
export const createTravel = async (travelData: TravelModelInput) => {
  const travelRef = await addDoc(collection(db, "travels"), {
    ...travelData,
    locationUpdates: [],
    isTrackingActive: false,
    travelStatus: "pending",
    startedAt: null,
    completedAt: null,
    createdAt: serverTimestamp(),
  });

  return travelRef.id;
};

/// Update the travel status and timestamps in Firestore
export const updateTravelStatus = async (
  travelId: string,
  status: TravelModel["travelStatus"]
) => {
  await updateDoc(doc(db, "travels", travelId), {
    travelStatus: status,
    ...(status === "in-progress" && {
      startedAt: new Date().toISOString(),
      isTrackingActive: true,
    }),
    ...(status === "completed" && {
      completedAt: new Date().toISOString(),
      isTrackingActive: false,
    }),
  });
};

/// Add a location update to the travel document in Firestore
export const addLocationUpdate = async (
  travelId: string,
  coords: { latitude: number; longitude: number }
) => {
  const travelRef = doc(db, "travels", travelId);

  await updateDoc(travelRef, {
    locationUpdates: arrayUnion({
      latitude: coords.latitude,
      longitude: coords.longitude,
      timestamp: new Date().toISOString(),
    }),
  });
};

/// Get a travel document by its ID from Firestore
export const getTravelById = async (travelId: string) => {
  const docSnap = await getDoc(doc(db, "travels", travelId));
  if (!docSnap.exists()) return null;
  return { travelId, ...docSnap.data() } as TravelModel;
};

/// Get all travels for a specific user from Firestore
export const getTravelsByUser = async (userId: string) => {
  const q = query(collection(db, "travels"), where("travelerId", "==", userId));
  const querySnap = await getDocs(q);
  return querySnap.docs.map((doc) => ({
    travelId: doc.id,
    ...doc.data(),
  })) as TravelModel[];
};

/// Get all travels for a specific package from Firestore
export const deleteTravel = async (travelId: string) => {
  await deleteDoc(doc(db, "travels", travelId));
};
