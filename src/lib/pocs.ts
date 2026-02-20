import { db } from "./firebase";
import { collection, doc, setDoc, getDoc, getDocs, deleteDoc, query, where, orderBy } from "firebase/firestore";

// Define the shape of a POC object stored in Firestore
export interface POC {
    id: number;
    title: string;
    description: string;
    fullDescription: string;
    repoUrl: string;
    repoName?: string;
    authorId: string;
    authorName: string;
    tags: string[];
    stars: number;
    forks: number;
    updated: string;
    icon: string;
    difficulty: string;
    version: string;
    details?: any; // Contains architecture, logicBreakdown, dependencies
    architecture?: any;
    logicBreakdown?: any;
    dependencies?: any[];
    createdAt: number;
}

/**
 * Saves a new POC to Firestore.
 * Uses the POC ID (timestamp) as the Document ID.
 */
export async function savePOC(poc: POC) {
    try {
        await setDoc(doc(db, "pocs", poc.id.toString()), poc);
    } catch (e) {
        console.error("Error saving POC to Firestore: ", e);
        throw e;
    }
}

/**
 * Fetches all POCs from Firestore, ordered by creation time.
 */
export async function getAllPOCs() {
    try {
        const q = query(collection(db, "pocs"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data() as POC);
    } catch (e) {
        console.error("Error fetching all POCs: ", e);
        return [];
    }
}

/**
 * Fetches POCs created by a specific user.
 */
export async function getUserPOCs(userId: string) {
    try {
        const q = query(collection(db, "pocs"), where("authorId", "==", userId));
        // Note: orderBy requires an index if used with where field (authorId). 
        // We'll sort via client-side or assume default order for MVP to avoid index creation error.
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data() as POC).sort((a, b) => b.createdAt - a.createdAt);
    } catch (e) {
        console.error("Error fetching user POCs: ", e);
        return [];
    }
}

/**
 * Fetches a single POC by ID.
 */
export async function getPOCById(id: string) {
    try {
        const docRef = doc(db, "pocs", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data() as POC;
        } else {
            return null;
        }
    } catch (e) {
        console.error("Error fetching POC by ID: ", e);
        return null;
    }
}

/**
 * Deletes a POC by ID.
 */
export async function deletePOC(id: string) {
    try {
        await deleteDoc(doc(db, "pocs", id));
    } catch (e) {
        console.error("Error deleting POC: ", e);
        throw e;
    }
}
