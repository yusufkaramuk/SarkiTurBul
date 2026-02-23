// ===== DOM Elements =====
const loginScreen = document.getElementById('loginScreen');
const loginBtn = document.getElementById('loginBtn');
const appContainer = document.getElementById('appContainer');
const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const logoutBtn = document.getElementById('logoutBtn');
const userInput = document.getElementById('userInput');
const searchBtn = document.getElementById('searchBtn');
const resultCard = document.getElementById('resultCard');
const resultContent = document.getElementById('resultContent');
const errorCard = document.getElementById('errorCard');
const errorContent = document.getElementById('errorContent');

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

// ===== State =====
let isSignedIn = false;

// ===== Google Sign-In (ID token — only for auth UX) =====
function initGoogleSignIn() {
    if (typeof google === 'undefined' || !google.accounts) {
        setTimeout(initGoogleSignIn, 200);
        return;
    }

    if (!CONFIG || CONFIG.GOOGLE_CLIENT_ID.startsWith('YOUR_')) {
        loginBtn.textContent = '⚠️ config.js: Client ID ayarlanmamış';
        loginBtn.disabled = true;
        return;
    }

    if (CONFIG.GEMINI_API_KEY.startsWith('YOUR_')) {
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
}

function handleSignIn(response) {
    // Decode the JWT ID token to get user info
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    userAvatar.src = payload.picture || '';
    userName.textContent = payload.name || payload.email || 'Kullanıcı';
    isSignedIn = true;
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
    appContainer.classList.add('hidden');
    loginScreen.classList.remove('hidden');
    hideCards();
}

// ===== UI Helpers =====
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

// ===== Gemini API (uses deployer's API key) =====
async function queryGemini(userQuery) {
    const body = {
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: userQuery }] }],
        tools: [{ google_search: {} }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 300 }
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
        if (status === 429) {
            throw new Error(`Rate limit: ${apiMsg || 'Çok fazla istek. Biraz bekleyip tekrar deneyin.'}`);
        }
        throw new Error(`Hata ${status}: ${apiMsg || 'Bilinmeyen hata'}`);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Boş cevap döndü, tekrar deneyin.');
    return text.trim();
}

// ===== Events =====
loginBtn.addEventListener('click', () => {
    google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // One Tap not available, use popup
            google.accounts.id.renderButton(
                document.createElement('div'),
                { type: 'standard' }
            );
            // Fallback: trigger sign-in with popup
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

// ===== Init =====
searchBtn.disabled = true;
initGoogleSignIn();
