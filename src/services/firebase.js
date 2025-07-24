import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  onSnapshot,
  deleteDoc,
  doc,
  where
} from 'firebase/firestore';
import { db } from '../config';

// Check if user has already pledged
export const checkUserHasPledged = async (username) => {
  try {
    console.log('Checking if user has already pledged:', username);
    
    const q = query(
      collection(db, 'pledges'),
      where('username', '==', username)
    );
    
    const querySnapshot = await getDocs(q);
    const hasPledged = !querySnapshot.empty;
    
    console.log(`User ${username} has ${hasPledged ? 'already' : 'not'} pledged`);
    return hasPledged;
  } catch (error) {
    console.error('Error checking user pledge status:', error);
    return false; // Allow pledge on error to avoid blocking users
  }
};

// Save pledge to Firestore
export const savePledge = async (pledgeData) => {
  try {
    console.log('Saving pledge to Firebase:', pledgeData);
    
    // First check if user has already pledged
    const hasPledged = await checkUserHasPledged(pledgeData.username);
    if (hasPledged) {
      throw new Error(`User ${pledgeData.username} has already made a pledge. Only one pledge per user is allowed.`);
    }
    
    // Ensure timestamp is a proper Date object
    const timestamp = pledgeData.timestamp instanceof Date 
      ? pledgeData.timestamp 
      : new Date(pledgeData.timestamp || Date.now());
    
    // Prepare pledge data for Firestore - use original profile URL
    const pledgeToSave = {
      username: pledgeData.username,
      message: pledgeData.message,
      timestamp: timestamp,
      profileUrl: pledgeData.profileUrl, // Use direct URL (unavatar.io, etc.)
      createdAt: new Date(),
      likes: 0,
      isVerified: false
    };
    
    // Save to Firestore
    const docRef = await addDoc(collection(db, 'pledges'), pledgeToSave);
    console.log('✅ Pledge saved with ID:', docRef.id);
    
    return {
      id: docRef.id,
      ...pledgeToSave
    };
  } catch (error) {
    console.error('❌ Error saving pledge:', error);
    throw error;
  }
};

// Get all pledges from Firestore
export const getAllPledges = async (limitCount = 50) => {
  try {
    console.log('Fetching pledges from Firebase...');
    
    const q = query(
      collection(db, 'pledges'), 
      orderBy('createdAt', 'desc'), 
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const pledges = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Convert Firestore timestamps to proper Date objects
      const pledge = {
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date(data.timestamp || data.createdAt),
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
      };
      
      pledges.push(pledge);
    });
    
    console.log(`✅ Fetched ${pledges.length} pledges from Firebase`);
    return pledges;
  } catch (error) {
    console.error('❌ Error getting pledges:', error);
    throw error;
  }
};

// Real-time listener for pledges
export const subscribeToPledges = (callback, limitCount = 50) => {
  console.log('Setting up real-time pledge listener...');
  
  const q = query(
    collection(db, 'pledges'), 
    orderBy('createdAt', 'desc'), 
    limit(limitCount)
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const pledges = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Convert Firestore timestamps to proper Date objects
      const pledge = {
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date(data.timestamp || data.createdAt),
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
      };
      
      pledges.push(pledge);
    });
    
    console.log(`✅ Real-time update: ${pledges.length} pledges received`);
    callback(pledges);
  }, (error) => {
    console.error('❌ Error in pledge listener:', error);
  });
};

// Get pledges count
export const getPledgesCount = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'pledges'));
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting pledges count:', error);
    return 0;
  }
};

// Delete a pledge (admin function)
export const deletePledge = async (pledgeId) => {
  try {
    await deleteDoc(doc(db, 'pledges', pledgeId));
    console.log('✅ Pledge deleted successfully');
  } catch (error) {
    console.error('❌ Error deleting pledge:', error);
    throw error;
  }
};

// Test Firebase connection
export const testFirebaseConnection = async () => {
  try {
    console.log('🔄 Testing Firebase connection...');
    const testDoc = await addDoc(collection(db, 'test'), {
      message: 'Connection test',
      timestamp: new Date()
    });
    console.log('✅ Firebase connection successful! Test doc ID:', testDoc.id);
    
    // Clean up test document
    await deleteDoc(doc(db, 'test', testDoc.id));
    console.log('✅ Test document cleaned up');
    
    return true;
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    return false;
  }
};