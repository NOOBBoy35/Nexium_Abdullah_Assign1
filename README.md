## Getting Started

First, run the development server:
```bash
npm run dev
# or
pnpm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# 📚 Quote Generator Web App
A sleek and dynamic quote generator built as part of my internship at **Nexium**. Users can input any topic and receive three inspiring quotes fetched from a MongoDB Atlas backend.

---

## 🛠️ Features
- 🔍 Dynamic quote search via MongoDB Atlas
- 🎨 Interactive UI with Next.js 15, Tailwind CSS, daisyUI, and ShadCN UI
- 🚀 Deployed on Vercel
- 🔁 Refresh quotes button for cycling through quotes

---

## 🚧 Tech Stack
| Tech           | Purpose                          |
|----------------|----------------------------------|
| Next.js 15     | Fullstack React framework        |
| Tailwind CSS   | Utility-first CSS framework      |
| daisyUI        | Tailwind-based component library |
| ShadCN UI      | Modern accessible components     |
| MongoDB Atlas  | Cloud NoSQL database             |
| Prisma         | Database ORM                     |
| Vercel         | Deployment & Hosting             |

---

## 📁 Folder Structure
/internship
├── src/
│ ├── app/
│ │ ├── page.tsx – Main quote page
│ │ ├── about/page.tsx – About page
│ │ └── api/quotes/route.ts – API to fetch quotes
│ ├── components/
│ │ ├── NavBar.tsx – Navigation bar
│ │ └── QuoteForm.tsx – Input form and quote display
│ └── data/
│ └── quotes.json – Local quote backup
/scripts/
└── insertQuotes.ts – Bulk upload script to MongoDB


---

## ⚙️ Getting Started
### 1️⃣ Clone the Repo
```bash
git clone https://github.com/NOOBBoy35/Nexium_Abdullah_Assign1.git
cd Nexium_Abdullah_Assign1/internship
pnpm install


💡 Usage Guide
Visit homepage to enter a topic (e.g., "ambition")
Click Generate to show quotes from the database
Click the refresh 🔄 button to cycle through the 3 quotes
Click About Us to view personal info and social links

🌐 Live Demo
Hosted on Vercel:
👉https://nexium-abdullah-assign1.vercel.app

📄 License
This project is for educational & internship purposes. Please do not reuse without permission.
