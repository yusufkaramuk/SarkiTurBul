# MuzikTurOgren

Şarkı veya sanatçı adından müzik türünü öğrenebileceğiniz, Google Gemini ve Google Search Grounding teknolojilerini kullanan açık kaynak bir web uygulaması.

## Özellikler
- Sadece Google hesabınızla giriş yaparak hemen kullanmaya başlayabilirsiniz.
- Şarkı/sanatçıları Google Arama altyapısı ile teyit eder ve sallamasyon (halüsinasyon) yanıtlar vermez.
- İleri seviye dark mode ve modern glassmorphism arayüz.
- Bilinmeyen sanatçı veya uydurma metinlerde "Bulunamadı" hatası verir.

## Geliştirici Kurulumu

Eğer bu projeyi kendi ortamınızda çalıştırmak veya GitHub Pages'te yayınlamak isterseniz:

1. Bu depoyu klonlayın (`git clone ...`)
2. Proje dizinindeki `config.example.js` dosyasının adını `config.js` olarak değiştirin.
3. Google Cloud Console üzerinden:
   - OAuth "Client ID" oluşturun.
   - [Google AI Studio](https://aistudio.google.com)'dan "Gemini API Key" alın.
4. Bu bilgileri `config.js` içerisine yapıştırın:

\`\`\`javascript
const CONFIG = {
    GOOGLE_CLIENT_ID: 'BURAYA_OAUTH_CLIENT_ID',
    GEMINI_API_KEY: 'BURAYA_GEMINI_API_KEY'
};
\`\`\`

> **ÖNEMLİ:** `config.js` dosyası Git tarafından yoksayılacak şekilde (.gitignore'da) tanımlanmıştır. API anahtarlarınızı asla GitHub'a yüklemeyin!

## Kullanılan Teknolojiler
- HTML5, CSS3, Vanilla JavaScript
- Google Identity Services (GSI)
- Gemini REST API (gemini-2.5-flash modeli) + Google Search Grounding

## Lisans
MIT License - Dilediğiniz gibi kullanabilir ve geliştirebilirsiniz.
