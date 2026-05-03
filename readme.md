# 🎵 MüzikTürÖğren (Music Genre Finder)

<p align="left">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white" alt="Gemini AI" />
</p>

**Google Gemini 2.5 Flash API** ve **Google Search Grounding** altyapısını kullanarak, girdiğiniz şarkı veya sanatçı adından saniyeler içinde müzik türünü analiz eden açık kaynaklı, şık ve modern bir web uygulamasıdır.

Kendi API sınırlarınızı yönetmeden, sadece profilinizle giriş yaparak sistemi kullanabilirsiniz. Sistem, uydurma veri üretmemek üzere yapılandırılmıştır ve tüm sonuçlar aktif olarak internet aracılığıyla doğrulanır.

---

## 🌐 Canlı Demo

Uygulamayı hemen test etmek için aşağıdaki linke tıklayabilirsiniz:
👉 **[https://sarkiturbul-live.netlify.app](https://sarkiturbul-live.netlify.app)**

---

## ✨ Öne Çıkan Özellikler

- **🔒 Güvenli ve Kolay Giriş (Google OAuth 2.0):** Sadece Google hesabınızla giriş yaparak uygulamayı kullanmaya başlayın.
- **🛡️ Halüsinasyon Önleyici (Google Search Grounding):** LLM'lerin rastgele uydurmalarını (halüsinasyonlarını) engeller. Gerçekte var olmayan bir sanatçı veya şarkı arandığında anında **Bilinmeyen Kayıt** hatası verir.
- **⚡ Yüksek Performans:** En güncel Gemini 2.5 Flash modeli sayesinde saniyeler içinde analiz ve geri bildirim.
- **🎨 Premium Arayüz:** İleri seviye dark mode, CSS glassmorphism efektleri ve tamamen responsive modern bir tasarım.
- **📂 Sunucusuz (Serverless) Yapı:** Hiçbir arka plan (backend) sunucusuna ihtiyaç duymadan, saf (vanilla) JS ile tarayıcı üzerinden çalışır.

---

## 🚀 Geliştirici Kurulumu (Kendi Ortamında Çalıştırma)

Uygulamanın şablonunu kendi deponuzda geliştirmek veya GitHub Pages üzerinden yayınlamak isterseniz aşağıdaki adımları izleyebilirsiniz.

### 1️⃣ Projeyi İndirin
Projeyi kendi yerel makinenize klonlayın:
```bash
git clone https://github.com/yusufkaramuk/SarkiTurBul.git
cd SarkiTurBul
```

### 2️⃣ Ortam Değişkenlerini (Config) Ayarlayın
Projenin kök dizinindeki config.example.js dosyasının adını config.js olarak değiştirin.

```bash
mv config.example.js config.js
```

> **Not:** config.js dosyası .gitignore kurallarına dahil edilmiştir ve asla GitHub'a veya herhangi bir uzak depoya aktarılmaz. Yüklemeyeceğiniz için verileriniz %100 güvendedir.

### 3️⃣ API Anahtarlarını Alın
**Google Cloud kimlik doğrulaması:**
1. [Google Cloud Console](https://console.cloud.google.com/)'a gidin ve yeni bir proje oluşturun.
2. APIs & Services > OAuth consent screen kısmından uygulamanızı ayarlayın.
3. Credentials sekmesinden bir OAuth Client ID (Web Application) oluşturun ve Authorized JavaScript Origins kısmına yayıncı URL'nizi (veya localhost) ekleyin.

**Gemini Yapay Zeka Anahtarı:**
1. [Google AI Studio](https://aistudio.google.com/apikey) adresinden ücretsiz bir Gemini API Anahtarı kopyalayın.

### 4️⃣ Ayarları Uygulayın
config.js dosyasını açıp elde ettiğiniz iki değeri yerlerine yapıştırın:
```javascript
const CONFIG = {
    GOOGLE_CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
    GEMINI_API_KEY: 'YOUR_GEMINI_API_KEY_HERE'
};
```

Yerel bilgisayarınızda bir lokal sunucu başlatıp index.html üzerinden hemen test edebilirsiniz!

---

## 🛠️ Kullanılan Teknolojiler

| Bileşen | Teknoloji | Not |
|---------|-----------|-----|
| **Frontend** | Vanilla JS, HTML5, CSS3 | Framework kullanılmadan, ultra hafif inşa edilmiştir. |
| **Authentication** | Google Identity Services | One Tap ve güvenli JWT altyapısı. |
| **Yapay Zeka** | Google Gemini 2.5 Flash | Sektörün en hızlı LLM modeli. |
| **Veri Doğrulama**| Google Search Grounding | Yanılsama (Halüsinasyon) önleyici aktif doğrulama. |

---

## 📄 Lisans
Bu proje geliştiricilere açık olarak konumlandırılmış olup, dilediğiniz gibi kullanabilmeniz ve düzenleyebilmeniz için **MIT License** ile lisanslanmıştır.
