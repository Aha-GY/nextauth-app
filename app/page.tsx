import { redirect } from "next/navigation";

export default function Home() {
  redirect("/signup");

  return <p>Redirecting...</p>;
}