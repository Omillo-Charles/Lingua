🌐 LinguaFlow
LinguaFlow is a multilingual Progressive Web App (PWA) built with Next.js that allows users to translate text and speech between any two languages. Powered by Gemini 2.5 Flash and Google Translate API, it offers real-time communication that breaks language barriers — all in a clean, installable, responsive interface.

✨ Features
🌍 Text-to-Text Translation
Translate text between any two languages using Google Translate API.

🎙️ Voice-to-Text Translation
Speak in your native language and get real-time translated text.

🔊 Text-to-Speech
Hear the translated text spoken aloud in your target language.

💡 AI-powered Enhancements
Optional conversational context via Gemini 2.5 Flash API.

📲 Installable PWA
Use it offline like a native app on mobile or desktop.

🎨 Clean & Responsive UI
Built with Tailwind CSS for modern design and speed.

🛠 Tech Stack
Layer	Technology
Frontend	Next.js 14, Tailwind CSS
Translation	Google Translate API
AI Engine	Gemini 2.5 Flash API
Voice Input	Web Speech API
Voice Output	SpeechSynthesis API
Hosting	Vercel
Auth (opt.)	Firebase or Clerk

🚀 Getting Started
1. Clone the Repo
bash
Copy
Edit
git clone https://github.com/yourusername/linguaflow.git
cd linguaflow
2. Install Dependencies
bash
Copy
Edit
npm install
3. Configure API Keys
Create a .env.local file and add:

ini
Copy
Edit
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_GOOGLE_API_KEY=your_google_translate_api_key
4. Run the App
bash
Copy
Edit
npm run dev
Visit http://localhost:3000 to view the app.

🧪 Demo
👉 Live Demo (Vercel): https://linguaflow.vercel.app

📂 Folder Structure
bash
Copy
Edit
/pages
  index.tsx         # Home / translator UI
  api/
    translate.ts    # Text translation endpoint
    voice.ts        # Voice processing (optional)
  ...
/components
  Translator.tsx    # Main logic
  LanguagePicker.tsx
  Recorder.tsx
/public
  icons/
  flags/
/styles
  globals.css
.env.local
🧠 Future Features
📘 Phrasebook / Saved Translations

🧭 Auto Language Detection

📥 Export transcripts

🗂️ Multi-language chat mode

📜 License
This project is open-source under the MIT License.

🤝 Contributing
Pull requests are welcome! For major changes, open an issue first to discuss what you’d like to change.

👤 Author
Built with ❤️ by Omillo Charles
🌍 omytech.vercel.app
📧 omytechkenya@gmail.com
