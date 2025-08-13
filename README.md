# PDF Whisperer

A Next.js application that uses AI to parse and extract structured data from PDF documents, specifically designed for resume/CV analysis.

## Features

- Drag and drop PDF upload interface
- AI-powered text extraction and structured data parsing
- Real-time parsing with loading states
- JSON output display for extracted information
- Extracts: name, education, experience, skills, and other relevant information

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file and add your OpenAI API key:
```
OPENAI_API_KEY=your_openai_api_key_here
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **AI**: OpenAI GPT-4o via Vercel AI SDK
- **PDF Processing**: pdf2json
- **Styling**: Tailwind CSS
- **Type Safety**: TypeScript with Zod schema validation

## Usage

1. Upload a PDF document (resume/CV) using the drag and drop interface
2. Click "Parse PDF" to extract and structure the information
3. View the parsed data in JSON format on the right panel

## API Endpoints

- `POST /api/parse-pdf` - Accepts a PDF file and returns structured data

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## License

This project is private and not licensed for public use.
