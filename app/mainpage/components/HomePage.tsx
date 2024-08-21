"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    router.push("/signin");
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://akil-backend.onrender.com/opportunities/search"
        );
        const { data } = await response.json();
        if (!response.ok) {
          console.log("yes");
        }
      } catch (error) {
        console.error("Error fetching job data:", error);
      }
    }

    fetchData();
  }, []);

  return null; // No UI rendering since the return part is removed
}
