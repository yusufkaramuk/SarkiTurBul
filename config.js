// ===========================================
// MüzikTürÖğren — Yapılandırma Dosyası
// ===========================================
//
// Bu projeyi deploy etmek için aşağıdaki iki değeri doldurun.
//
// ── GOOGLE OAUTH CLIENT ID ──
// 1. https://console.cloud.google.com → Proje seçin / oluşturun
// 2. APIs & Services → OAuth consent screen → External → Kaydet
// 3. APIs & Services → Credentials → Create → OAuth client ID
//    - Application type: Web application
//    - Authorized JavaScript origins: http://localhost:8080 (+ deploy URL)
// 4. Client ID'yi aşağıya yapıştırın
//
// ── GEMİNİ API KEY ──
// 1. https://aistudio.google.com/apikey adresine gidin
// 2. "Create API Key" → key'i kopyalayın
// 3. Aşağıya yapıştırın
//
// NOT: Bu dosyayı ASLA commit etmeyin! .gitignore'a eklenmiştir.
//

const CONFIG = {
    GOOGLE_CLIENT_ID: '387779135131-iqov9q7pl3tfqeu07tr4iucuraumhetg.apps.googleusercontent.com',
    GEMINI_API_KEY: 'AIzaSyDoJbe3NmKYUElKyABHx1ne7L3FSrPj6zo'
};
