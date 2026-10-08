"use client";
import { useGetCurrentUserQuery } from "@/redux/features/auth/authApi";
import React from "react";

export default function HomePage() {
  const { data: currentUser } = useGetCurrentUserQuery();
  console.log(currentUser);
  return <div>THis is home page of user</div>;
}
