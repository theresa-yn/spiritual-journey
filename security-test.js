// Firestore Security Rules Test
// Run this in your browser console on your Heartnotes app

async function testSecurityRules() {
    console.log('🔒 Testing Firestore Security Rules...');
    
    // Test 1: Try to list all documents (should fail)
    console.log('Test 1: Trying to list all reflections (should fail)...');
    try {
        const snapshot = await db.collection('reflections').get();
        console.log('❌ SECURITY ISSUE: Able to list all documents!', snapshot.size);
    } catch (error) {
        console.log('✅ GOOD: Cannot list all documents -', error.message);
    }
    
    // Test 2: Try to access another user's data (should fail)
    console.log('Test 2: Trying to access another user\'s data (should fail)...');
    try {
        const snapshot = await db.collection('reflections')
            .where('userId', '==', 'fake-user-id-12345')
            .get();
        console.log('❌ SECURITY ISSUE: Able to access other user\'s data!', snapshot.size);
    } catch (error) {
        console.log('✅ GOOD: Cannot access other user\'s data -', error.message);
    }
    
    // Test 3: Try to access your own data (should work)
    console.log('Test 3: Accessing your own data (should work)...');
    try {
        const snapshot = await db.collection('reflections')
            .where('userId', '==', currentUser.id)
            .get();
        console.log('✅ GOOD: Can access own data - found', snapshot.size, 'documents');
    } catch (error) {
        console.log('❌ ERROR: Cannot access own data -', error.message);
    }
    
    console.log('🔒 Security test complete!');
}

// Run the test
testSecurityRules();
