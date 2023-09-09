import Link from "next/link";

export default function Index() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="text-center py-10 px-10">
        <div className="mb-5">
          <h3 className="text-2xl font-bold mb-1">Movies alert</h3>
          <p className="italic font-light">not for the kids apparently</p>
        </div>
        <Link href="/subscribe">
          <button className="border-none bg-gray-500 text-white font-bold text-xl px-6 py-3 rounded-lg">
            Start adding movies
          </button>
        </Link>
      </div>
    </div>
  );
}
