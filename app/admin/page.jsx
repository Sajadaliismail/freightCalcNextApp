"use client";
import { Suspense, useEffect, useState } from "react";
import AdminSignInForm from "./adminSignin";
import Dashboard from "./DashboardContent";
import Loading from "./Loading";
import Image from "next/image";

export default function AdminSignInPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    const storedAuthState = localStorage.getItem("isAuthenticated");
    if (storedAuthState === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/database", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data);

      if (response.ok) setData(data);
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  return (
    <div className="flex items-start justify-center min-h-screen bg-[#21428b] relative">
      <Image
        className="absolute"
        src={"/logixman.svg"}
        width={150}
        height={50}
        alt="logo"
      />
      {isAuthenticated ? (
        data ? (
          <Suspense fallback={<Loading />}>
            <Dashboard data={data} setIsAuthenticated={setIsAuthenticated} />
          </Suspense>
        ) : (
          <Loading />
        )
      ) : (
        <div className="w-full max-w-md my-auto">
          <h1 className="text-2xl font-bold text-center mb-6 text-white">
            Admin Sign In
          </h1>
          <AdminSignInForm setIsAuthenticated={setIsAuthenticated} />
        </div>
      )}
    </div>
  );
}
