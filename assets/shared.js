// assets/shared.js — komponen bersama untuk seluruh halaman edu (top-bar, audio, speech id-ID, util).
// Classic script (bukan module) supaya tetap jalan dibuka langsung via file://.

// ── Top-bar (Back / Home / Sound toggle) ────────────────────────────────────
function initTopBar(opts) {
    const { title, backHref, homeHref, audio } = opts;
    const parts = [];
    if (backHref) parts.push(`<a class="btn-back" href="${backHref}">⬅ Back</a>`);
    parts.push(`<h1>${title}</h1>`);
    if (homeHref) parts.push(`<a class="btn-home" href="${homeHref}">Home</a>`);
    if (audio) parts.push(`<button class="btn-audio" id="audioToggle" onclick="toggleAudio()">${window.isAudioEnabled ? '🔊' : '🔇'}</button>`);

    const el = document.getElementById('topbar');
    if (el) {
        el.className = 'top-bar';
        el.innerHTML = parts.join('\n');
    }
}

// ── Audio: SFX oscillator + mute toggle (persisten via localStorage) ───────
(function () {
    const KEY = 'edu.audioEnabled';
    let audioCtx = null;
    let _enabled = localStorage.getItem(KEY) !== '0'; // default: nyala

    function ensureCtx() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') audioCtx.resume();
        return audioCtx;
    }

    window.playSfx = function (type) {
        if (!_enabled) return;
        const ctx = ensureCtx();

        if (type === 'finish') {
            [0, 0.2, 0.4].forEach((delay, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600 + i * 150, ctx.currentTime + delay);
                gain.gain.setValueAtTime(0.3, ctx.currentTime + delay);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.3);
                osc.start(ctx.currentTime + delay);
                osc.stop(ctx.currentTime + delay + 0.3);
            });
            return;
        }

        if (type === 'tick') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'square';
            osc.frequency.setValueAtTime(700, ctx.currentTime);
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
            osc.start();
            osc.stop(ctx.currentTime + 0.08);
            return;
        }

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        if (type === 'correct') {
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(600, ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
            oscillator.start();
            oscillator.stop(ctx.currentTime + 0.3);
        } else if (type === 'wrong') {
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(300, ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
            gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
            oscillator.start();
            oscillator.stop(ctx.currentTime + 0.3);
        }
    };

    window.toggleAudio = function () {
        _enabled = !_enabled;
        localStorage.setItem(KEY, _enabled ? '1' : '0');
        document.querySelectorAll('#audioToggle').forEach(b => {
            b.textContent = _enabled ? '🔊' : '🔇';
        });
        if (!_enabled && window.speechSynthesis) window.speechSynthesis.cancel();
        return _enabled;
    };

    Object.defineProperty(window, 'isAudioEnabled', {
        get: () => _enabled,
        set: v => { _enabled = !!v; }
    });
})();

// ── Speech (Bahasa Indonesia, id-ID) ────────────────────────────────────────
let _idVoice = null;
function _loadIdVoice() {
    const voices = window.speechSynthesis.getVoices();
    _idVoice = voices.find(v => v.lang === 'id-ID') ||
               voices.find(v => v.lang.startsWith('id')) ||
               null;
}
if (window.speechSynthesis) {
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = _loadIdVoice;
    }
    _loadIdVoice();
}

// Ucapkan satu teks dalam Bahasa Indonesia.
function speak(text) {
    if (!window.isAudioEnabled) return;
    function doSpeak() {
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'id-ID';
        utter.rate = 0.85;
        utter.pitch = 1.1;
        if (_idVoice) utter.voice = _idVoice;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utter);
    }
    if (!_idVoice && window.speechSynthesis.getVoices().length === 0) {
        const prev = window.speechSynthesis.onvoiceschanged;
        window.speechSynthesis.onvoiceschanged = () => {
            _loadIdVoice();
            window.speechSynthesis.onvoiceschanged = prev || null;
            doSpeak();
        };
    } else {
        doSpeak();
    }
}

// Ucapkan beberapa teks berurutan (mis. huruf lalu contoh kata), dirangkai
// via utterance.onend agar tidak saling membatalkan satu sama lain.
function speakSequence(texts, card) {
    if (!window.isAudioEnabled) {
        if (card) card.classList.remove('playing');
        return;
    }
    window.speechSynthesis.cancel();
    let i = 0;
    if (card) card.classList.add('playing');

    function speakNext() {
        if (i >= texts.length) {
            if (card) card.classList.remove('playing');
            return;
        }
        const utter = new SpeechSynthesisUtterance(texts[i]);
        utter.lang = 'id-ID';
        utter.rate = 0.85;
        utter.pitch = 1.1;
        if (_idVoice) utter.voice = _idVoice;
        utter.onend = () => { i++; speakNext(); };
        utter.onerror = () => { i++; speakNext(); };
        window.speechSynthesis.speak(utter);
    }

    if (!_idVoice && window.speechSynthesis.getVoices().length === 0) {
        const prev = window.speechSynthesis.onvoiceschanged;
        window.speechSynthesis.onvoiceschanged = () => {
            _loadIdVoice();
            window.speechSynthesis.onvoiceschanged = prev || null;
            speakNext();
        };
    } else {
        speakNext();
    }
}

// ── Util ─────────────────────────────────────────────────────────────────
function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
