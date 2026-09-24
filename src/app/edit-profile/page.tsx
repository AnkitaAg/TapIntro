"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EditProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [structuredProfile, setStructuredProfile] = useState<any>(null);
  const [structuring, setStructuring] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error || !profile) {
        setError("We couldn't find your profile.");
        setLoading(false);
        return;
      }

      setUsername(profile.username);
      setName(profile.name);
      setOrganization(profile.organization ?? "");
      setPhotoPreview(profile.photo_url || "");
      setStructuredProfile(profile.structured_profile || null);
      setBio(profile.bio ?? "");
      setRole(profile.role ?? "");
      setLinkedin(profile.linkedin ?? "");
      setGithub(profile.github ?? "");
      setPhone(profile.phone || "");

      setLoading(false);
    }
    loadProfile();
  }, [router]);

  async function handleStructureBio() {
  if (!bio.trim()) {
    setError("Please write an introduction first.");
    return;
  }

  setStructuring(true);
  setError("");

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
    setError(
      error instanceof Error
        ? error.message
        : "Unable to structure bio."
    );
  } finally {
    setStructuring(false);
  }
}

  function handlePhotoChange(
  event: React.ChangeEvent<HTMLInputElement>
) {
  const file = event.target.files?.[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    setError("Please choose an image.");
    return;
  }

  setPhoto(file);
  setPhotoPreview(URL.createObjectURL(file));
  setError("");
}

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  setSaving(true);
  setError("");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    router.push("/login");
    return;
  }

  console.log("Saving structured profile:", structuredProfile);
  let photoUrl = photoPreview;

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
    setError(uploadError.message);
    setSaving(false);
    return;
  }

  const { data: publicUrlData } = supabase.storage
    .from("profile-photos")
    .getPublicUrl(filePath);

  photoUrl = publicUrlData.publicUrl;
}
  const { error } = await supabase
  .from("profiles")
  .update({
    name,
    organization,
    bio,
    role,
    linkedin,
    github,
    phone,
    structured_profile: structuredProfile,
    photo_url: photoUrl || null,
  })
  .eq("user_id", user.id);

if (error) {
  console.error("Error saving profile:", error);
  setError(error.message);
  setSaving(false);
  return;
}

  
console.log("Saved structured profile:", structuredProfile);

  router.push(`/${username}`);
}

  if (loading) {
    return (
      <main className="min-h-screen bg-white text-gray-900">
        <div className="mx-auto max-w-2xl px-6 py-20">
          <p className="text-gray-500">Loading your profile...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-white text-gray-900">
        <div className="mx-auto max-w-2xl px-6 py-20">
          <p className="text-red-600">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <p className="text-sm font-medium uppercase tracking-widest text-gray-500">
          TapIntro
        </p>

        <h1 className="mt-4 text-4xl font-bold">
          Edit your profile
        </h1>

        <p className="mt-3 text-gray-600">
          Update the information people see when they tap your profile.
        </p>

        <form onSubmit={handleSave} className="mt-10 space-y-6">
          <div>
            <label className="block text-sm font-medium">
              Username
            </label>

            <input
              type="text"
              value={username}
              disabled
              className="mt-2 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
            />
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
                <label className="block text-sm font-medium">
                Short introduction
                </label>

                <textarea
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                rows={5}
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
                {structuredProfile && (
                <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-6">
                    <p className="text-xs font-medium uppercase tracking-widest text-gray-500">
                    AI preview
                    </p>

                <h2 className="mt-3 text-2xl font-bold">
                {structuredProfile.headline}
                </h2>

                {structuredProfile.focus?.length > 0 && (
                <div className="mt-6">
                    <h3 className="font-semibold">Focus</h3>
                    <ul className="mt-2 list-disc pl-5 text-gray-700">
                    {structuredProfile.focus.map((item: string) => (
                        <li key={item}>{item}</li>
                    ))}
                    </ul>
                </div>
                )}

                {structuredProfile.curiosities?.length > 0 && (
                <div className="mt-6">
                    <h3 className="font-semibold">
                    What I'm curious about
                    </h3>
                    <ul className="mt-2 list-disc pl-5 text-gray-700">
                    {structuredProfile.curiosities.map((item: string) => (
                        <li key={item}>{item}</li>
                    ))}
                    </ul>
                </div>
                )}

                {structuredProfile.education?.length > 0 && (
                <div className="mt-6">
                    <h3 className="font-semibold">Education</h3>
                    <ul className="mt-2 list-disc pl-5 text-gray-700">
                    {structuredProfile.education.map((item: string) => (
                        <li key={item}>{item}</li>
                    ))}
                    </ul>
                </div>
                )}
            </div>
        )}
        </div>
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
        <label className="block text-sm font-medium">
            Role / profession
        </label>

        <input
            type="text"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
        />
        </div>
        <div>
  <label className="block text-sm font-medium text-gray-700">
    Phone number
  </label>

  <input
    type="tel"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    placeholder="+91 98765 43210"
    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3"
  />
</div>

        <div>
        <label className="block text-sm font-medium">
            LinkedIn
        </label>

        <input
            type="url"
            value={linkedin}
            onChange={(event) => setLinkedin(event.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
        />
        </div>

        <div>
        <label className="block text-sm font-medium">
            GitHub
        </label>

        <input
            type="url"
            value={github}
            onChange={(event) => setGithub(event.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
        />
        </div>

        <button
        type="submit"
        disabled={saving}
        className="w-full rounded-lg bg-gray-900 px-4 py-3 font-medium text-white disabled:opacity-50"
        >
        {saving ? "Saving..." : "Save changes"}
        </button>
        </form>
      </div>
    </main>
  );
}