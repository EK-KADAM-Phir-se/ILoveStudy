import { NextResponse } from 'next/server';

// Mock database for illustration purposes
const users = [];

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, isRegistering } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    if (isRegistering) {
      // Handle Registration
      const userExists = users.find(u => u.email === email);
      if (userExists) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 });
      }
      
      users.push({ email, password });
      return NextResponse.json({ message: 'Registration successful!', token: 'mock-jwt-token-xyz123' }, { status: 201 });
    } else {
      // Handle Login
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }

      return NextResponse.json({ message: 'Login successful!', token: 'mock-jwt-token-xyz123' }, { status: 200 });
    }
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}