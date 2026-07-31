import { NextResponse } from 'next/server';
import { auth } from '../../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from "firebase/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, isRegistering } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    if (isRegistering) {
      // Handle Registration
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      return NextResponse.json({ message: 'Registration successful!', token }, { status: 201 });
    } else {
      // Handle Login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      return NextResponse.json({ message: 'Login successful!', token }, { status: 200 });
    }
  } catch (err) {
    console.error("Firebase Auth Error:", err);
    
    // Convert Firebase errors to user-friendly messages
    let errorMessage = 'Authentication failed';
    if (err.code === 'auth/email-already-in-use') {
      errorMessage = 'Email is already registered.';
    } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
      errorMessage = 'Invalid email or password.';
    } else if (err.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address format.';
    } else if (err.code === 'auth/weak-password') {
      errorMessage = 'Password should be at least 6 characters.';
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}