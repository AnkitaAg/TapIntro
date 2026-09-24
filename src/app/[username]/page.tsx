import { supabase } from "@/lib/supabase";
import { FaGithub, FaLinkedin, FaPhone } from "react-icons/fa";
import { getCompanyLogoUrl } from "@/lib/companyLogo";

type Profile = {
  username: string;
  name: string;
  organization: string | null;
  role: string | null;
  bio: string | null;
  linkedin: string | null;
  github: string | null;
  phone: string | null;
  photo_url: string | null;
  structured_profile: {
    headline?: string;
    curiosities?: string[];
    education?: string[];
  } | null;
};

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (error || !profile) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Profile not found</h1>
          <p className="mt-2 text-gray-500">
            This TapIntro profile does not exist.
          </p>
        </div>
      </main>
    );
  }

  const p = profile as Profile;
  const structured = p.structured_profile;

  const independentOrganizations = [
  "self",
  "self-employed",
  "freelance",
  "freelancer",
  "independent",
  "independent consultant",
];

const organizationKey = p.organization?.trim().toLowerCase() || "";

const isIndependent =
  independentOrganizations.includes(organizationKey);

const companyLogo = isIndependent
  ? null
  : getCompanyLogoUrl(p.organization);

const companyInitials = p.organization
  ? p.organization
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0].toUpperCase())
      .join("")
  : "";

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-10">
      <div className="mx-auto max-w-md">
        {/* Card */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          
          {/* Header */}
          <div className="px-6 pt-8 text-center">
            {p.photo_url ? (
              <img
                src={p.photo_url}
                alt={p.name}
                className="mx-auto h-28 w-28 rounded-full object-cover ring-4 ring-white shadow-md"
              />
            ) : (
              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gray-100 text-3xl font-semibold text-gray-500">
                {p.name?.charAt(0).toUpperCase()}
              </div>
            )}

            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-gray-900">
              {p.name}
            </h1>

           {p.role && (
            <p className="mt-2 text-sm text-gray-500">
                {p.role}
                {p.organization && !isIndependent
                ? ` at ${p.organization}`
                : ""}
            </p>
            )}

            {/* Company */}
           {p.organization && !isIndependent && (
  <div className="mt-5 flex items-center justify-center gap-2">
    {companyLogo ? (
      <img
        src={companyLogo}
        alt=""
        className="h-6 w-6 rounded object-contain"
      />
    ) : (
      <div className="flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-[9px] font-semibold text-gray-600">
        {companyInitials}
      </div>
    )}

    <span className="text-sm font-medium text-gray-700">
      {p.organization}
    </span>
  </div>
)}
          </div>

          {/* Curiosities */}
          {structured?.curiosities &&
            structured.curiosities.length > 0 && (
              <section className="px-6 pt-8">
                <h2 className="text-sm font-semibold text-gray-900">
                  What I'm curious about
                </h2>

                <div className="mt-3 space-y-3">
                  {structured.curiosities.map(
                    (item: string, index: number) => (
                      <div
                        key={index}
                        className="rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-700"
                      >
                        {item}
                      </div>
                    )
                  )}
                </div>
              </section>
            )}

          {/* Education */}
          {structured?.education &&
            structured.education.length > 0 && (
              <section className="px-6 pt-8">
                <h2 className="text-sm font-semibold text-gray-900">
                  Education
                </h2>

                <div className="mt-3 space-y-2">
                  {structured.education.map(
                    (item: string, index: number) => (
                      <p
                        key={index}
                        className="text-sm text-gray-600"
                      >
                        {item}
                      </p>
                    )
                  )}
                </div>
              </section>
            )}

          {/* Social links */}
          <div className="flex items-center justify-center gap-5 px-6 py-8">
            {p.linkedin && (
              <a
                href={p.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-gray-500 transition hover:text-gray-900"
              >
                <FaLinkedin size={25} />
              </a>
            )}

            {p.github && (
              <a
                href={p.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-gray-500 transition hover:text-gray-900"
              >
                <FaGithub size={25} />
              </a>
            )}

            {p.phone && (
              <a
                href={`tel:${p.phone}`}
                aria-label="Phone"
                className="text-gray-500 transition hover:text-gray-900"
              >
                <FaPhone size={21} />
              </a>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          TapIntro
        </p>
      </div>
    </main>
  );
}