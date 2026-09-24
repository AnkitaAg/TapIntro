"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-8">
        
        {/* Header */}
        <header className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">TapIntro</h2>

          <Link href="/login" 
             className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-100">
            Sign in
          </Link>
          
        </header>

        {/* Hero */}
        <section className="flex flex-1 flex-col items-center justify-center text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-gray-500">
            Your introduction, one tap away
          </p>

          <h1 className="max-w-3xl text-5xl font-bold tracking-tight">
            Introduce yourself with one tap.
          </h1>

          <p className="mt-6 max-w-xl text-lg text-gray-600">
            Create your personal profile and connect it to an NFC tag.
            Anyone can discover your introduction with a simple tap.
          </p>

          <Link href="/create-profile"
            className="mt-8 inline-block rounded-xl bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
          >
            Create my profile
          </Link>
        </section>

        {/* How it works */}
        <section className="border-t border-gray-200 py-10">
          <h2 className="text-center text-2xl font-semibold">
            How it works
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            
            <div className="rounded-xl border border-gray-200 p-6">
              <p className="text-sm font-medium text-gray-500">01</p>
              <h3 className="mt-2 font-semibold">Create your profile</h3>
              <p className="mt-2 text-sm text-gray-600">
                Add your name, bio, work, projects and links.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 p-6">
              <p className="text-sm font-medium text-gray-500">02</p>
              <h3 className="mt-2 font-semibold">Connect your NFC tag</h3>
              <p className="mt-2 text-sm text-gray-600">
                Associate your TapIntro profile with your NFC tag.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 p-6">
              <p className="text-sm font-medium text-gray-500">03</p>
              <h3 className="mt-2 font-semibold">Let people discover you</h3>
              <p className="mt-2 text-sm text-gray-600">
                Someone taps your tag and your introduction opens instantly.
              </p>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}