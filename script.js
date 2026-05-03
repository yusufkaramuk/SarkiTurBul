// ===== DOM Elements =====
const loginScreen = document.getElementById('loginScreen');
const loginBtn = document.getElementById('loginBtn');
const appContainer = document.getElementById('appContainer');
const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const logoutBtn = document.getElementById('logoutBtn');

// Genre tab
const userInput = document.getElementById('userInput');
const searchBtn = document.getElementById('searchBtn');
const resultCard = document.getElementById('resultCard');
const resultContent = document.getElementById('resultContent');
const errorCard = document.getElementById('errorCard');
const errorContent = document.getElementById('errorContent');

// Story tab
const storyInput = document.getElementById('storyInput');
const storyBtn = document.getElementById('storyBtn');
const storyResultCard = document.getElementById('storyResultCard');
const storyResultContent = document.getElementById('storyResultContent');
const storyErrorCard = document.getElementById('storyErrorCard');
const storyErrorContent = document.getElementById('storyErrorContent');

// ===== Constants =====
const GEMINI_MODEL = 'gemini-2.5-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const SYSTEM_PROMPT = `Sen bir müzik uzmanısın. Sana verilen şarkı ve/veya sanatçı bilgisine göre müzik türünü (genre) belirle.

ÖNEMLİ KURALLAR:
1. Emin olmadığın veya bilmediğin zamanlarda uydurma yapma (asla varsayılan olarak "Türk Halk Müziği" veya başka bir tür yazma).
2. Kesinlikle Google Arama'yı kullanarak sanatçı veya şarkıyı doğrula.
3. Eğer arama sonucunda şarkı veya sanatçı bulunamazsa veya müzikle ilgili olmadığı anlaşılırsa "Bulunamadı" olarak işaretle.

Gerçek bir şarkıysa cevabını şu formatta ver:
🎵 Tür: [ana tür]
🎸 Alt Tür: [varsa alt tür, yoksa "—"]
📝 Kısa Açıklama: [1-2 cümle ile bu türün/şarkının özelliği]

Eğer bulunamazsa sadece şunu yaz:
❌ Bilinmeyen Kayıt: Girdiğiniz sanatçı veya şarkı güvenilir kaynaklarda bulunamadı. Lütfen yazılışı kontrol edip tekrar deneyin.

Sadece yukarıdaki iki formattan birini kullan, başka bir şey yazma. Türkçe cevap ver.`;

const STORY_PROMPT = `Sen bir müzik tarihçisi ve hikaye anlatıcısısın. Sana verilen şarkı hakkında o şarkının gerçek hikayesini anlat: nasıl yazıldı, ne ilham verdi, hangi koşullarda doğdu, sanatçının hayatında ne ifade eder, piyasaya çıkışında ne yaşandı, dinleyiciler/eleştirmenler nasıl karşıladı gibi bilgileri içer.

ZORUNLU KURALLAR:
1. Kesinlikle Google Arama'yı kullan ve yalnızca doğrulanmış, güvenilir kaynaklara dayanan bilgileri yaz.
2. Uydurma, tahmin veya hayal ürünü hiçbir bilgi yazma.
3. Şarkı gerçekten bulunamazsa veya hakkında yeterli belgelenmiş bilgi yoksa sadece şunu yaz:
   ❌ Hikaye Bulunamadı: Bu şarkı hakkında güvenilir kaynaklarda yeterli bilgi bulunamadı. Lütfen şarkı ve sanatçı adını kontrol edip tekrar deneyin.
4. Eğer hikayeyi anlattıktan sonra bazı detaylar için kaynak yetersizliği veya belirsizlik varsa, hikayenin en sonuna şu bloku ekle (hikayenin ana gövdesine dahil etme):
   ⚠️ Kaynak Notu: [hangi kısımların daha az belgelendiğini kısaca açıkla]

Hikaye varsa şu formatta yaz:
🎵 [Şarkı Adı] — [Sanatçı]

📅 Yayın Yılı: [yıl]

📖 Hikaye:
[Doğrulanmış bilgilerle akıcı, ilgi çekici ve bilgilendirici bir anlatı. Birden fazla paragraf olabilir.]

[Eğer kaynak notu gerekiyorsa buraya ekle, yoksa hiç yazma]

Türkçe cevap ver.`;

// ===== State =====
let isSignedIn = localStorage.getItem('muziktur_session') === 'true';

// ===== Google Sign-In (ID token — only for auth UX) =====
function initGoogleSignIn() {
    if (typeof google === 'undefined' || !google.accounts) {
        setTimeout(initGoogleSignIn, 200);
        return;
    }

    if (typeof CONFIG === 'undefined') {
        loginBtn.textContent = '⚠️ config.js dosyası eksik';
        loginBtn.disabled = true;
        return;
    }

    if (!CONFIG.GOOGLE_CLIENT_ID || CONFIG.GOOGLE_CLIENT_ID.startsWith('YOUR_')) {
        loginBtn.textContent = '⚠️ config.js: Client ID ayarlanmamış';
        loginBtn.disabled = true;
        return;
    }

    if (!CONFIG.GEMINI_API_KEY || CONFIG.GEMINI_API_KEY.startsWith('YOUR_')) {
        loginBtn.textContent = '⚠️ config.js: API Key ayarlanmamış';
        loginBtn.disabled = true;
        return;
    }

    google.accounts.id.initialize({
        client_id: CONFIG.GOOGLE_CLIENT_ID,
        callback: handleSignIn,
        auto_select: true
    });

    loginBtn.disabled = false;

    // Check if user was already signed in from a previous session
    if (isSignedIn) {
        // Try to restore user info from localStorage
        const savedName = localStorage.getItem('muziktur_user_name');
        const savedAvatar = localStorage.getItem('muziktur_user_avatar');
        if (savedName) userName.textContent = savedName;
        if (savedAvatar) userAvatar.src = savedAvatar;

        showApp();
    }
}

function handleSignIn(response) {
    // Decode the JWT ID token to get user info
    const payload = JSON.parse(atob(response.credential.split('.')[1]));

    const avatarUrl = payload.picture || '';
    const name = payload.name || payload.email || 'Kullanıcı';

    userAvatar.src = avatarUrl;
    userName.textContent = name;

    // Save session
    isSignedIn = true;
    localStorage.setItem('muziktur_session', 'true');
    localStorage.setItem('muziktur_user_name', name);
    localStorage.setItem('muziktur_user_avatar', avatarUrl);

    showApp();
}

// ===== Screen Transitions =====
function showApp() {
    loginScreen.classList.add('hidden');
    appContainer.classList.remove('hidden');
    userInput.focus();
}

function showLogin() {
    isSignedIn = false;
    localStorage.removeItem('muziktur_session');
    localStorage.removeItem('muziktur_user_name');
    localStorage.removeItem('muziktur_user_avatar');

    appContainer.classList.add('hidden');
    loginScreen.classList.remove('hidden');
    hideCards();
}

// ===== Tab Navigation =====
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.dataset.tab;
        document.getElementById('tabGenre').classList.toggle('hidden', tab !== 'genre');
        document.getElementById('tabStory').classList.toggle('hidden', tab !== 'story');
    });
});

// ===== UI Helpers — Genre =====
function showResult(text) {
    const formatted = text
        .replace(/(🎵\s*Tür:)/g, '<strong>$1</strong>')
        .replace(/(🎸\s*Alt Tür:)/g, '<strong>$1</strong>')
        .replace(/(📝\s*Kısa Açıklama:)/g, '<strong>$1</strong>')
        .replace(/(❌\s*Bilinmeyen.*?:)/g, '<strong style="color:var(--error)">$1</strong>');
    resultContent.innerHTML = formatted;
    resultCard.classList.remove('hidden');
    errorCard.classList.add('hidden');
}

function showError(message) {
    errorContent.textContent = message;
    errorCard.classList.remove('hidden');
    resultCard.classList.add('hidden');
}

function hideCards() {
    resultCard.classList.add('hidden');
    errorCard.classList.add('hidden');
}

function setLoading(on) {
    if (on) {
        searchBtn.classList.add('loading');
        searchBtn.disabled = true;
        userInput.disabled = true;
    } else {
        searchBtn.classList.remove('loading');
        searchBtn.disabled = !userInput.value.trim();
        userInput.disabled = false;
    }
}

// ===== UI Helpers — Story =====
function showStoryResult(text) {
    // Split warning note from main story
    const warnMatch = text.match(/(⚠️\s*Kaynak Notu:[\s\S]*)$/);
    let mainText = warnMatch ? text.slice(0, warnMatch.index).trim() : text.trim();
    const warnText = warnMatch ? warnMatch[1].trim() : null;

    const formatted = mainText
        .replace(/(🎵\s*.+?—.+)/g, '<strong style="font-size:1.15em">$1</strong>')
        .replace(/(📅\s*Yayın Yılı:)/g, '<strong>$1</strong>')
        .replace(/(📖\s*Hikaye:)/g, '<strong>$1</strong>')
        .replace(/(❌\s*Hikaye Bulunamadı:)/g, '<strong style="color:var(--error)">$1</strong>');

    let html = formatted;
    if (warnText) {
        const warnFormatted = warnText.replace(/(⚠️\s*Kaynak Notu:)/g, '<strong>$1</strong>');
        html += `<div class="story-warning">${warnFormatted}</div>`;
    }

    storyResultContent.innerHTML = html;
    storyResultCard.classList.remove('hidden');
    storyErrorCard.classList.add('hidden');
}

function showStoryError(message) {
    storyErrorContent.textContent = message;
    storyErrorCard.classList.remove('hidden');
    storyResultCard.classList.add('hidden');
}

function hideStoryCards() {
    storyResultCard.classList.add('hidden');
    storyErrorCard.classList.add('hidden');
}

function setStoryLoading(on) {
    if (on) {
        storyBtn.classList.add('loading');
        storyBtn.disabled = true;
        storyInput.disabled = true;
    } else {
        storyBtn.classList.remove('loading');
        storyBtn.disabled = !storyInput.value.trim();
        storyInput.disabled = false;
    }
}

// ===== Gemini API =====
async function callGemini(systemPrompt, userQuery, maxTokens) {
    const body = {
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: userQuery }] }],
        tools: [{ google_search: {} }],
        generationConfig: { temperature: 0.1, maxOutputTokens: maxTokens }
    };

    const res = await fetch(`${API_URL}?key=${CONFIG.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        const d = await res.json().catch(() => null);
        const apiMsg = d?.error?.message || '';
        const status = res.status;
        if (status === 429) throw new Error(`Rate limit: ${apiMsg || 'Çok fazla istek. Biraz bekleyip tekrar deneyin.'}`);
        throw new Error(`Hata ${status}: ${apiMsg || 'Bilinmeyen hata'}`);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Boş cevap döndü, tekrar deneyin.');
    return text.trim();
}

async function queryGemini(userQuery) {
    return callGemini(SYSTEM_PROMPT, userQuery, 300);
}

async function queryGeminiStory(userQuery) {
    return callGemini(STORY_PROMPT, userQuery, 800);
}

// ===== Events =====
loginBtn.addEventListener('click', () => {
    google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            google.accounts.id.renderButton(document.createElement('div'), { type: 'standard' });
            google.accounts.id.prompt();
        }
    });
});

logoutBtn.addEventListener('click', () => {
    google.accounts.id.disableAutoSelect();
    showLogin();
});

userInput.addEventListener('input', () => {
    searchBtn.disabled = !userInput.value.trim();
});

userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (userInput.value.trim()) searchBtn.click();
    }
});

searchBtn.addEventListener('click', async () => {
    const q = userInput.value.trim();
    if (!q || !isSignedIn) return;
    hideCards();
    setLoading(true);
    try {
        const result = await queryGemini(q);
        showResult(result);
    } catch (err) {
        showError(err.message);
    } finally {
        setLoading(false);
    }
});

storyInput.addEventListener('input', () => {
    storyBtn.disabled = !storyInput.value.trim();
});

storyInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (storyInput.value.trim()) storyBtn.click();
    }
});

storyBtn.addEventListener('click', async () => {
    const q = storyInput.value.trim();
    if (!q || !isSignedIn) return;
    hideStoryCards();
    setStoryLoading(true);
    try {
        const result = await queryGeminiStory(q);
        showStoryResult(result);
    } catch (err) {
        showStoryError(err.message);
    } finally {
        setStoryLoading(false);
    }
});

// ===== Init =====
searchBtn.disabled = true;
storyBtn.disabled = true;
initGoogleSignIn();
