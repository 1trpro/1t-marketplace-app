import { collection, query, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Listing {
  id: string;
  title: string;
  price: number;
  images: string[];
  link: string;
  timestamp: string;
}

export async function getListings(): Promise<Listing[]> {
  try {
    const listingsRef = collection(db, 'listings');
    const q = query(listingsRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Listing));
  } catch (error) {
    console.error('Error fetching listings:', error);
    return [];
  }
}

export async function getListing(id: string): Promise<Listing | null> {
  try {
    const docRef = doc(db, 'listings', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Listing;
    }
    return null;
  } catch (error) {
    console.error('Error fetching listing:', error);
    return null;
  }
}
