"use client";
import Link from "next/link";
import { Button } from "@mantine/core";

export default function Index() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="text-center py-10 px-10">
        <div className="mb-5">
          <h3 className="text-2xl font-bold mb-1">Movies alert</h3>
          <p>Create movie subscriptions, easy as pie!</p>
        </div>
        <div className="flex items-center justify-center">
          <Link href="/subscribe">
            <Button color="primary">Jump in</Button>
          </Link>
          <div className="mx-4">or</div>
          <Link href="/recent-movies">
            <Button color="violet">Check recent movies</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
