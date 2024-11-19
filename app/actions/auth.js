"use server";

import { cookies } from "next/headers";

export async function signIn(email, password) {
  // This is a placeholder for your actual authentication logic
  // You should replace this with a call to your authentication service
  if (email === "admin@gmail.com" && password === "password123") {
    // Set a cookie to indicate the user is logged in
    // cookies().set("adminToken", "your-secure-token-here", {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   maxAge: 3600, // 1 hour
    //   path: "/",
    // });

    return { success: true };
  } else {
    return { success: false, error: "Invalid email or password" };
  }
}

export async function signOut() {
  cookies().delete("adminToken");
}
