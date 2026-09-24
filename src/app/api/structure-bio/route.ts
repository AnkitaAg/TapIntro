import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { bio, role, organization } = await request.json();

    if (!bio || typeof bio !== "string") {
      return NextResponse.json(
        { error: "Bio is required." },
        { status: 400 }
      );
    }

    const response = await openai.responses.create({
      model: "gpt-5-mini",
      input: `
Create a concise TapIntro profile from the information below.

Current role: ${role || ""}
Current organization: ${organization || ""}

Raw introduction:
${bio}

Rules:
- Headline:
- If both role and organization are provided:
    "[role] at [organization]"
- If only role is provided:
    "[role]"
-If only organization is provided:
    "[organization]"
- If neither is provided:
    Create a concise professional headline from the raw introduction.
- Never use phrases such as "Not provided", "Unknown",
    "N/A", or placeholders.
- Curiosities: maximum 4 things the person is curious about,
  excited by, wants to learn, explore, experiment with, or build.
- Education: include only education explicitly mentioned.
- Do not create an experience section.
- Do not write a generic summary.
- Do not repeat information.
- Do not invent anything.
- Keep every item concise.
- If a category has no information, return an empty array.
- Never display placeholder values.
- Empty information should result in an empty field or array,
  not "Not provided".
`,
      text: {
        format: {
          type: "json_schema",
          name: "tapintro_profile",
          strict: true,
          schema: {
            type: "object",
            properties: {
              headline: {
                type: "string",
              },
              curiosities: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              education: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
            required: [
              "headline",
              "curiosities",
              "education",
            ],
            additionalProperties: false,
          },
        },
      },
    });

    const structuredProfile = JSON.parse(response.output_text);

    return NextResponse.json({
      structuredProfile,
    });
  } catch (error) {
    console.error("Bio structuring error:", error);

    return NextResponse.json(
      { error: "Unable to structure bio." },
      { status: 500 }
    );
  }
}