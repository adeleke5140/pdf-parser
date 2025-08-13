import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { customPrompt, extractTextFromPDF } from "./lib/utils";

const schema = z.object({
  name: z.string(),
  education: z.array(z.string()).or(z.string()),
  experience: z.array(
    z.object({
      company: z.string().optional(),
      position: z.string().optional(),
      duration: z.string().optional(),
      description: z.string().optional(),
    }),
  ),
  skills: z.array(z.string()),
  other: z.array(z.object({
    name: z.string(),
    description: z.string(),
  })),
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 },
      );
    }

    const dataBuffer = Buffer.from(await file.arrayBuffer());
    const pdfText = await extractTextFromPDF(dataBuffer);

    console.log({ pdfText });
    const result = await generateObject({
      model: openai("gpt-4o"),
      schema,
      messages: [
        {
          role: "system",
          content: customPrompt,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: pdfText.extractedText,
            },
          ],
        },
      ],
    });
    console.log({ object: result.object });
    return NextResponse.json({
      success: true,
      data: result.object,
    });
  } catch (error) {
    console.error("PDF parsing error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
