"use client";
import { useState } from "react";
import type { FormEvent } from "react"; 
import { useRouter } from "next/navigation";  
import { supabase } from "@/lib/supabase";

export default function CreateProfile() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [organization, setOrganization] = useState("");
  const [structuredProfile, setStructuredProfile] = useState<any>(null);
  const [structuring, setStructuring] = useState(false);  
  const [profile, setProfile] = useState<{
    username: string;
    name: string;
    bio: string;
    role: string;
    linkedin: string;
    github: string;
  } | null>(null);

  function handlePhotoChange(
  event: React.ChangeEvent<HTMLInputElement>
) {
  const file = event.target.files?.[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please choose an image.");
    return;
  }

  setPhoto(file);
  setPhotoPreview(URL.createObjectURL(file));
}

  async function handleStructureBio() {
  if (!bio.trim()) {
    alert("Please write an introduction first.");
    return;
  }

  setStructuring(true);

  try {
    const response = await fetch("/api/structure-bio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bio,
        role,
        organization,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to structure bio.");
    }

    setStructuredProfile(data.structuredProfile);
  } catch (error) {
    console.error(error);
    alert(
      error instanceof Error
        ? error.message
        : "Unable to structure bio."
    );
  } finally {
    setStructuring(false);
  }
}

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    let photoUrl = "";

if (photo) {
  const filePath = `${user.id}/profile.jpg`;

  const { error: uploadError } = await supabase.storage
    .from("profile-photos")
    .upload(filePath, photo, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    console.error("Photo upload error:", uploadError);
    alert(uploadError.message);
    return;
  }

  const { data: publicUrlData } = supabase.storage
    .from("profile-photos")
    .getPublicUrl(filePath);

  photoUrl = publicUrlData.publicUrl;
}
    const cleanUsername = username.trim().toLowerCase();
    const {
  data: { user },
} = await supabase.auth.getUser();

  console.log("Authenticated user ID:", user?.id);

    if (!user) {
    alert("You must be logged in to create a profile.");
    return;
  }

   const { data, error } = await supabase
  .from("profiles")
  .insert({
    user_id: user.id,
    username: cleanUsername,
    name,
    organization,
    bio,
    role,
    linkedin,
    github,
    photo_url: photoUrl || null,
    structured_profile: structuredProfile,
  })
  .select()
  .single();

  if (error) {
    console.error("Error creating profile:", error);
    alert(error.message);
    return;
  }

  console.log("Profile created:", data);
    router.push(`/${cleanUsername}`);
  }
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-2xl px-6 py-12">

        <h1 className="text-3xl font-bold">
          Create your TapIntro profile
        </h1>

        <p className="mt-2 text-gray-600">
          Tell people a little about yourself.
        </p>

        <form onSubmit={handleSubmit}
            className="mt-8 space-y-6">
          <div>
  <label
    htmlFor="username"
    className="block text-sm font-medium"
  >
    Username
  </label>

  <div className="mt-2 flex items-center rounded-lg border border-gray-300">
    <span className="pl-4 text-gray-500">
      tapintro.com/
    </span>

    <input
      id="username"
      name="username"
      type="text"
      placeholder="ankita"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      className="w-full rounded-lg px-2 py-3 outline-none"
    />
  </div>
</div>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium"
            >
              Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Ankita Agrawal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
            />

            <p className="mt-2 text-sm text-gray-500">
              React currently knows: {name || "nothing yet"}
            </p>
          </div>

        <div>
  <label className="block text-sm font-medium">
    Profile photo
  </label>

  <div className="mt-3 flex items-center gap-4">
    {photoPreview ? (
      <img
        src={photoPreview}
        alt="Profile preview"
        className="h-24 w-24 rounded-full object-cover"
      />
    ) : (
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 text-sm text-gray-400">
        Photo
      </div>
    )}

    <label className="cursor-pointer rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium">
      {photoPreview ? "Change photo" : "Add photo"}

      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePhotoChange}
      />
    </label>
  </div>

  <p className="mt-2 text-xs text-gray-500">
    Take a photo or choose one from your gallery.
  </p>
</div>



          <div>
           <label
            htmlFor="bio"
            className="block text-sm font-medium"
          >
          Short introduction
          </label>

          <textarea
          id="bio"
          name="bio"
          rows={4}
          placeholder="Tell people who you are..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
          />

          <button type="button"
          onClick={handleStructureBio}
          disabled={structuring || !bio.trim()}
         className="mt-3 rounded-xl border border-gray-300 px-5 py-3 font-medium disabled:opacity-40"
          >
         {structuring
          ? "✨ Structuring..."
          : "✨ Structure my introduction"}
          </button>

          

  <p className="mt-2 text-sm text-gray-500">
    React currently knows: {bio || "nothing yet"}
  </p>
</div>
{/* Role */}
<div>
  <label className="block text-sm font-medium">
    Current organization
  </label>

  <input
    type="text"
    value={organization}
    onChange={(e) => setOrganization(e.target.value)}
    placeholder="e.g. Microsoft"
    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3"
  />
</div>
<div>
  <label
    htmlFor="role"
    className="block text-sm font-medium"
  >
    Role / profession
  </label>

  <input
    id="role"
    name="role"
    type="text"
    placeholder="e.g. Senior Product Manager"
    value={role}
    onChange={(e) => setRole(e.target.value)}
    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
  />
</div>

{/* LinkedIn */}
<div>
  <label
    htmlFor="linkedin"
    className="block text-sm font-medium"
  >
    LinkedIn
  </label>

  <input
    id="linkedin"
    name="linkedin"
    type="url"
    placeholder="https://linkedin.com/in/..."
    value={linkedin}
    onChange={(e) => setLinkedin(e.target.value)}
    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
  />
</div>

{/* GitHub */}
<div>
  <label
    htmlFor="github"
    className="block text-sm font-medium"
  >
    GitHub
  </label>

  <input
    id="github"
    name="github"
    type="url"
    placeholder="https://github.com/..."
    value={github}
    onChange={(e) => setGithub(e.target.value)}
    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
  />
</div>

          <button
            type="submit"
            className="w-full rounded-xl bg-black px-6 py-3 font-medium text-white"
          >
            Create my profile
          </button>

        </form>

        {profile && (
  <section className="mt-12 rounded-2xl border border-gray-200 p-8">
    <p className="text-sm font-medium text-gray-500">
      Your TapIntro profile
    </p>

    <h2 className="mt-2 text-3xl font-bold">
      {profile.name}
    </h2>

    <p className="mt-2 text-lg text-gray-600">
      {profile.role}
    </p>

    <p className="mt-6 text-gray-700">
      {profile.bio}
    </p>

    <div className="mt-6 flex gap-4">
      {profile.linkedin && (
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium underline"
        >
          LinkedIn
        </a>
      )}

      {profile.github && (
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium underline"
        >
          GitHub
        </a>
      )}
    </div>
  </section>
)}
      </div>
    </main>
  );
}