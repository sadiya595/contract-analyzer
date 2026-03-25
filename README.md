<img width="1369" height="774" alt="image" src="https://github.com/user-attachments/assets/57e670ff-e10c-4cdb-9967-238be448e5f4" /># ContractScan AI — Contract Risk Analyzer

> Upload any legal document. Get an instant AI-powered risk breakdown in plain English.

🔗 **Live Demo**: https://contractscan-ai-three.vercel.app

---

## What it does

Most people sign contracts they don't fully understand. ContractScan fixes that.

Upload any PDF contract — NDA, offer letter, lease, employment agreement, terms of service — and get:

- **Risk score** (0–100) weighted by clause severity
- **Every clause identified** and categorized (IP, Liability, Termination, Payment, etc.)
- **Plain English explanation** of what each clause actually means
- **Recommended action** for each flagged clause
- **Visual dashboard** with risk distribution and category breakdown charts

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite |
| AI / LLM | Groq API — LLaMA 3.3 70B |
| PDF Parsing | pdf.js (Mozilla) |
| Charts | Recharts |
| Deployment | Vercel |

**Architecture**: 100% serverless — no backend, no database. PDF parsing and AI inference run entirely client-side and via direct API call.

---



## Features

- Drag-and-drop PDF upload
- Real-time AI clause extraction and risk classification
- Interactive dashboard — filter by category and risk level
- Expandable clause cards with original text + recommendations
- Works on any legal document type

---


## Run locally
```bash
git clone https://github.com/sadiya595/contract-analyzer.git
cd contract-analyzer
npm install
```

Create a `.env` file:
```
VITE_GROQ_API_KEY=your_groq_api_key_here
```

Get your free Groq API key at https://console.groq.com
```bash
npm run dev
```

---

## How it works

1. User uploads a PDF → extracted client-side using **pdf.js**
2. Raw text sent to **Groq API** with a structured prompt
3. **LLaMA 3.3 70B** returns JSON array of analyzed clauses
4. React renders the risk dashboard and clause breakdown

---

Built by [Sadiya Noor](https://github.com/sadiya595)
