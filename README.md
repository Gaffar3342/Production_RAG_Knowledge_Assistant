# Production RAG Knowledge Assistant

A production-oriented Retrieval-Augmented Generation knowledge assistant for uploading PDF documents and asking grounded questions over their contents. The backend handles ingestion, embeddings, semantic search, and answer generation, while the React frontend provides a polished chat and document-upload experience.

## Features

- PDF Upload
- Duplicate Detection
- Text Extraction
- Chunking
- OpenAI Embeddings
- ChromaDB Vector Search
- Retrieval-Augmented Generation
- Semantic Search
- FastAPI Backend
- Modern React Frontend
- Dark and light mode
- Markdown-rendered AI responses
- Responsive portfolio-quality interface

## Tech Stack

**Backend**

- Python
- FastAPI
- OpenAI
- ChromaDB
- SQLite
- pypdf

**Frontend**

- React
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui-style components
- Lucide React

## Architecture

The application follows a complete RAG pipeline:

```text
User uploads PDF
        ↓
Extract text
        ↓
Chunk text
        ↓
Generate embeddings
        ↓
Store in ChromaDB
        ↓
User asks question
        ↓
Generate query embedding
        ↓
Semantic search
        ↓
Retrieve relevant chunks
        ↓
Generate grounded answer
        ↓
Return response
```

The backend exposes document upload and chat endpoints. Uploaded PDF content is extracted, chunked, embedded with OpenAI embeddings, and persisted in ChromaDB. When a user asks a question, the system embeds the query, retrieves semantically relevant chunks, and sends only that retrieved context to the answer-generation step.

## API Endpoints

### Upload PDF

```http
POST /upload
Content-Type: multipart/form-data
```

Field name:

```text
file
```

Successful response:

```json
{
  "message": "Document uploaded successfully",
  "filename": "example.pdf"
}
```

### Chat

```http
POST /chat
Content-Type: application/json
```

Request:

```json
{
  "question": "What is machine learning?"
}
```

Response:

```json
{
  "answer": "..."
}
```

## Installation

### Backend

Create and activate a Python virtual environment, then install the backend dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

By default, FastAPI runs at:

```text
http://127.0.0.1:8000
```

### Frontend

Install frontend dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Environment Variables

Create a local environment file from the example:

```bash
cp .env.example .env
```

Example:

```env
OPENAI_API_KEY=your_key
VITE_API_URL=http://127.0.0.1:8000
FRONTEND_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

`VITE_API_URL` is required by the frontend and should point to the deployed FastAPI backend URL.
`FRONTEND_ORIGINS` controls which browser origins are allowed to call the FastAPI API.

## Screenshots

Add screenshots of the application here:

- `docs/screenshots/light-mode.png`
- `docs/screenshots/dark-mode.png`
- `docs/screenshots/mobile-chat.png`

## Project Structure

```text
.
├── main.py
├── routers/
├── schemas/
├── services/
├── vector_store/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   └── types/
├── package.json
├── tailwind.config.ts
└── vite.config.ts
```

## Deployment Notes

- Deploy the FastAPI backend with `OPENAI_API_KEY` configured in the backend environment.
- Deploy the frontend as a static Vite app.
- Set `VITE_API_URL` during the frontend build to the public backend URL.
- If frontend and backend are hosted on different origins, enable CORS in the FastAPI application for the frontend domain.

## Future Improvements

- Authentication
- Multi-user support
- Streaming responses
- Conversation history
- Source citations
- Docker deployment
- Kubernetes support
- Monitoring
- Evaluation metrics

## License

MIT
