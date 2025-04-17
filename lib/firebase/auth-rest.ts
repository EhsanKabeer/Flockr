// Firebase Auth REST API helpers for server-side password verification
const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

export async function verifyPassword(email: string, password: string): Promise<{ idToken: string; localId: string }> {
  if (!FIREBASE_API_KEY) {
    throw new Error("Firebase API key not configured");
  }

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Authentication failed");
  }

  return {
    idToken: data.idToken,
    localId: data.localId,
  };
}

export async function createUserWithEmailPassword(
  email: string,
  password: string
): Promise<{ idToken: string; localId: string }> {
  if (!FIREBASE_API_KEY) {
    throw new Error("Firebase API key not configured");
  }

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to create user");
  }

  return {
    idToken: data.idToken,
    localId: data.localId,
  };
}

