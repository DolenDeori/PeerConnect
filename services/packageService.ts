import { db } from "@/firebaseConfig";

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { PackageModel } from "@/models/packageModel";

const packageCollection = collection(db, "packages");

// add a new package
export const createPackage = async (pkg: PackageModel): Promise<void> => {
  const pkgRef = doc(packageCollection, pkg.id);
  await setDoc(pkgRef, pkg);
};

// get package by id
export const getPackageById = async (
  id: string
): Promise<PackageModel | null> => {
  const docRef = doc(packageCollection, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as PackageModel;
  } else {
    return null;
  }
};

// update package by id
export const updatePackageById = async (
  id: string,
  updates: Partial<PackageModel>
): Promise<void> => {
  const docRef = doc(packageCollection, id);
  await updateDoc(docRef, updates);
};

// delete package by id
export const deletePackageById = async (id: string): Promise<void> => {
  const docRef = doc(packageCollection, id);
  await deleteDoc(docRef);
};

// get all packages by user id
export const getPackagesByUserId = async (
  userId: string
): Promise<PackageModel[]> => {
  const pkgRef = collection(db, "packages");
  const q = query(pkgRef, where("senderId", "==", userId));
  const querySnapshot = await getDocs(q);
  const packages: PackageModel[] = [];
  querySnapshot.forEach((doc) => {
    packages.push({ id: doc.id, ...doc.data() } as PackageModel);
  });

  return packages;
};

// get all packages by traveler id
export const getPackagesByTravelerId = async (
  travelerId: string
): Promise<PackageModel[]> => {
  const pkgRef = collection(db, "packages");
  const q = query(pkgRef, where("travelerId", "==", travelerId));
  const querySnapshot = await getDocs(q);
  const packages: PackageModel[] = [];
  querySnapshot.forEach((doc) => {
    packages.push({ id: doc.id, ...doc.data() } as PackageModel);
  });
  return packages;
};

// get all available packages (not assigned to any traveler yet)
export const getAllAvailablePackages = async (): Promise<PackageModel[]> => {
  const q = query(packageCollection, where("status", "==", "pending")); // or however you tag them
  const querySnapshot = await getDocs(q);

  const packages: PackageModel[] = [];
  querySnapshot.forEach((doc) => {
    packages.push({ id: doc.id, ...doc.data() } as PackageModel);
  });

  return packages;
};

// fetch paginated available packages
export const getPaginatedAvailablePackages = async (
  lastDoc: any = null,
  limitCount = 5
): Promise<{ packages: PackageModel[]; lastVisible: any }> => {
  let q = query(
    packageCollection,
    where("status", "==", "pending"),
    // ensure you're ordering by a field that exists in all docs
    // 'createdAt' should be a Firestore timestamp
    orderBy("createdAt", "desc"),
    limit(limitCount)
  );

  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }

  const querySnapshot = await getDocs(q);
  const packages: PackageModel[] = [];

  querySnapshot.forEach((doc) => {
    packages.push({ id: doc.id, ...doc.data() } as PackageModel);
  });

  const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

  return { packages, lastVisible };
};

export const confirmPackageDelivery = async (
  packageId: string,
  travelerId: string
) => {
  const packageRef = doc(db, "packages", packageId);
  await updateDoc(packageRef, {
    status: "in_transit",
    travelerId: travelerId,
    confirmedAt: new Date(),
  });
};
