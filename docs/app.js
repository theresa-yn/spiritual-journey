import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const firebaseConfig = {
  // Your Firebase config here (ensure it's correct)
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

window.signUp = async function() {
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await sendEmailVerification(user); // Send verification email
    console.log('Account created and verification email sent:', user.email);
    alert('Account created! Please check your email for the confirmation link.');
  } catch (error) {
    console.error('Sign-up error:', error);
    alert('Error: ' + error.message);
  }
};

window.signIn = async function() {
  const email = document.getElementById('signin-email').value;
  const password = document.getElementById('signin-password').value;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    if (!userCredential.user.emailVerified) {
      alert('Please verify your email before signing in.');
      return;
    }
    console.log('Logged in:', userCredential.user);
  } catch (error) {
    console.error('Sign-in error:', error);
    alert('Error: ' + error.message);
  }
};

onAuthStateChanged(auth, (user) => {
  if (user && user.emailVerified) {
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('signin-form').style.display = 'none';
    document.getElementById('journal-section').style.display = 'block';
  } else {
    document.getElementById('signup-form').style.display = 'block';
    document.getElementById('signin-form').style.display = 'block';
    document.getElementById('journal-section').style.display = 'none';
  }
});

window.saveJournal = async function() {
  const user = auth.currentUser;
  if (user && user.emailVerified) {
    const entry = document.getElementById('journal-entry').value;
    try {
      await setDoc(doc(db, 'users', user.uid, 'journals', new Date().toISOString()), { text: entry });
      alert('Journal saved!');
    } catch (error) {
      console.error('Journal save error:', error);
      alert('Error: ' + error.message);
    }
  } else {
    alert('Please verify your email to save journals.');
  }
};
