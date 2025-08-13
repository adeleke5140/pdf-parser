import PDFParser from "pdf2json";

export const customPrompt = `
You are a multilingual document parser specialized in extracting structured data from resumes.
Focus on identifying name, education, experience, skills, and other information.

Return the data in the following format: 
{
  "name": "John Doe",
  "education": [
    "Bachelor of Science in Computer Science",
    "Master of Business Administration"
  ],
  "experience": [{
    "company": "Google",
    "position": "Software Engineer",
    "duration": "2020-2022",
    "description": "Developed and maintained web applications using React and Node.js"
  }],
  "skills": ["JavaScript", "React", "Node.js"],
  "other": [{
    "name": "Languages",
    "description": "English, Spanish"
  }]
}
`;

export async function extractTextFromPDF(
  pdfBuffer: Buffer,
): Promise<{ extractedText: string; pagesCount: number }> {
  if (!pdfBuffer || pdfBuffer.length === 0) {
    throw new Error("Invalid PDF file: empty buffer");
  }

  console.log("🔍 Extracting text from PDF...");

  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      try {
        let extractedText = "";
        let pageCount = 0;

        if (pdfData && pdfData.Pages) {
          pageCount = pdfData.Pages.length;

          for (const page of pdfData.Pages) {
            if (page.Texts) {
              for (const textItem of page.Texts) {
                if (textItem.R) {
                  for (const textRun of textItem.R) {
                    if (textRun.T) {
                      // Decode URI component to get readable text
                      const decodedText = decodeURIComponent(textRun.T);
                      extractedText += decodedText + " ";
                    }
                  }
                }
              }
            }
            extractedText += "\n\n"; // Add page break
          }
        }

        extractedText = extractedText.trim();

        if (!extractedText) {
          reject(new Error("No text could be extracted from the PDF"));
          return;
        }

        console.log(
          `✅ Extracted ${extractedText.length} characters from ${pageCount} pages`,
        );

        resolve({
          extractedText,
          pagesCount: pageCount,
        });
      } catch (error) {
        reject(
          new Error(
            `Text extraction failed: ${error instanceof Error ? error.message : "Unknown error"}`,
          ),
        );
      }
    });

    pdfParser.on("pdfParser_dataError", (error: any) => {
      reject(
        new Error(
          `PDF parsing failed: ${error.parserError || error.message || "Unknown error"}`,
        ),
      );
    });

    // Parse the PDF buffer
    pdfParser.parseBuffer(pdfBuffer);
  });
}
