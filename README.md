<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/a3c54198-23f1-431a-8fe0-d14f977fb5bb

## Run Locally

**Prerequisites:**  Node.js (v18+)

### 1. Dapatkan Google Gemini API Key
Untuk mengaktifkan fitur **Aster AI Assistant**, Anda memerlukan API Key dari Google Gemini.
1. Kunjungi [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Login menggunakan akun Google Anda dan buat API Key baru.
3. Salin API Key yang telah dibuat.

### 2. Konfigurasi Environment Variables
1. Duplikat file `.env.example` dan ubah namanya menjadi `.env`.
   (Pastikan `.env` tidak pernah di-commit ke public repository untuk alasan keamanan).
2. Buka `.env` dan ganti nilai `GEMINI_API_KEY` dengan API Key milik Anda:
```env
GEMINI_API_KEY=AIzaSy...
```

### 3. Install dan Jalankan Project
1. Install dependencies:
   ```bash
   npm install
   ```
2. Jalankan aplikasi (menjalankan Frontend Vite dan Backend Express secara bersamaan):
   ```bash
   npm run dev
   ```
   > **Note:** Jika `GEMINI_API_KEY` belum diisi, terminal akan menampilkan peringatan: 
   > `WARNING: Gemini API Key is missing. Chatbot will not function correctly.`
   > Namun fitur portofolio lainnya akan tetap berjalan normal.
