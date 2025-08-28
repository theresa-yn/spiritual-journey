import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Paste your Firebase config here
const firebaseConfig = {
  // ... (from Step 1)
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Sign-Up Function
window.signUp = async function() {
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Account created:', userCredential.user);
    alert('Account created! Please sign in.');
    // Optionally hide signup form
  } catch (error) {
    alert('Error: ' + error.message);
  }
};

// Sign-In Function
window.signIn = async function() {
  const email = document.getElementById('signin-email').value;
  const password = document.getElementById('signin-password').value;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Logged in:', userCredential.user);
  } catch (error) {
    alert('Error: ' + error.message);
  }
};

// Listen for Auth State Changes (show/hide content)
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('signin-form').style.display = 'none';
    document.getElementById('journal-section').style.display = 'block';
  } else {
    document.getElementById('signup-form').style.display = 'block';
    document.getElementById('signin-form').style.display = 'block';
    document.getElementById('journal-section').style.display = 'none';
  }
});

// Example: Save Journal to Database
window.saveJournal = async function() {
  const user = auth.currentUser;
  if (user) {
    const entry = document.getElementById('journal-entry').value;
    try {
      await setDoc(doc(db, 'users', user.uid, 'journals', new Date().toISOString()), { text: entry });
      alert('Journal saved!');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  }
};
