// Variabel Game
let gameType = ''; 
let currentOperation = ''; 
let currentLevel = ''; 
let score = 0;
let isProcessing = false;

// Variabel Tracking & Timer
let timerInterval;
let timeLeft = 120;
let gameHistory = []; 
let currentQuestionData = {}; // Object untuk melacak state soal yang sedang aktif

// Sistem Audio (Web Audio API)
let audioCtx;
let isAudioEnabled = true;
const bgm = document.getElementById('bgm');
bgm.volume = 0.3; 

function initAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if(audioCtx.state === 'suspended') audioCtx.resume();
}

function toggleAudio() {
    isAudioEnabled = !isAudioEnabled;
    const btn = document.getElementById('audio-toggle');
    if (isAudioEnabled) {
        btn.innerText = '🔊';
        bgm.play().catch(e => console.log('BGM play error:', e));
    } else {
        btn.innerText = '🔇';
        bgm.pause();
    }
}

function playSfx(type) {
    if (!isAudioEnabled) return;
    initAudioContext();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    if (type === 'correct') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
    } else if (type === 'wrong') {
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
    }
}

// Navigasi UI
function showScreen(screenId) {
    const screens = ['screen-type', 'screen-operation', 'screen-level', 'screen-game', 'screen-result'];
    screens.forEach(id => document.getElementById(id).style.display = 'none');
    document.getElementById(screenId).style.display = 'block';
}

function selectType(type) {
    initAudioContext(); 
    if(isAudioEnabled) bgm.play().catch(e=>console.log(e));
    gameType = type;
    showScreen('screen-operation');
}

function selectOperation(op) {
    currentOperation = op;
    let title = op === 'add' ? 'Penjumlahan' : (op === 'mul' ? 'Perkalian' : 'Campuran');
    document.getElementById('level-title').innerText = `Level ${title}:`;
    showScreen('screen-level');
}

function selectLevel(lvl) {
    currentLevel = lvl;
    score = 0;
    gameHistory = [];
    document.getElementById('score').innerText = score;
    
    let opName = currentOperation === 'add' ? '➕' : (currentOperation === 'mul' ? '✖️' : '🎲');
    let lvlName = lvl === 'easy' ? 'Mudah' : (lvl === 'medium' ? 'Sedang' : 'Sulit');
    document.getElementById('game-info').innerText = `${opName} | ${lvlName}`;

    if (gameType === 'challenge') {
        document.getElementById('timer-badge').style.display = 'inline-block';
        startTimer();
    } else {
        document.getElementById('timer-badge').style.display = 'none';
    }

    showScreen('screen-game');
    generateQuestion();
}

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 120;
    document.getElementById('time-left').innerText = timeLeft;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('time-left').innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            finishGame();
        }
    }, 1000);
}

function endGameEarly() {
    clearInterval(timerInterval);
    // Jika soal saat ini pernah dijawab salah tapi belum terselesaikan sebelum di-stop
    if (!currentQuestionData.solved && currentQuestionData.mistakes > 0) {
        gameHistory.push({ ...currentQuestionData });
    }
    finishGame();
}

function generateQuestion() {
    isProcessing = false;
    document.getElementById('feedback').innerText = '';
    
    let num1, num2;
    let activeOp = currentOperation;
    if (activeOp === 'mix') {
        activeOp = Math.random() > 0.5 ? 'add' : 'mul';
    }

    let symbol = activeOp === 'add' ? '+' : 'x';
    let correctAnswer = 0;

    if (activeOp === 'add') {
        if (currentLevel === 'easy') {
            num1 = Math.floor(Math.random() * 5) + 1;
            num2 = Math.floor(Math.random() * 5) + 1;
        } else if (currentLevel === 'medium') {
            num1 = Math.floor(Math.random() * 10) + 1;
            num2 = Math.floor(Math.random() * 10) + 1;
        } else {
            num1 = Math.floor(Math.random() * 11) + 5;
            num2 = Math.floor(Math.random() * 11) + 5;
        }
        correctAnswer = num1 + num2;
    } 
    else if (activeOp === 'mul') {
        if (currentLevel === 'easy') {
            const easyPool = [1, 2, 10];
            num1 = Math.floor(Math.random() * 10) + 1;
            num2 = easyPool[Math.floor(Math.random() * easyPool.length)];
        } else if (currentLevel === 'medium') {
            num1 = Math.floor(Math.random() * 10) + 1;
            num2 = Math.floor(Math.random() * 5) + 1;
        } else {
            num1 = Math.floor(Math.random() * 10) + 1;
            num2 = Math.floor(Math.random() * 5) + 6;
        }
        if (Math.random() > 0.5) { let temp = num1; num1 = num2; num2 = temp; }
        correctAnswer = num1 * num2;
    }

    // Inisialisasi status soal baru ke dalam object
    currentQuestionData = {
        qText: `${num1} ${symbol} ${num2}`,
        trueAns: correctAnswer,
        mistakes: 0,
        solved: false
    };

    document.getElementById('question').innerText = `${currentQuestionData.qText} = ?`;

    let answers = [correctAnswer];
    while (answers.length < 4) {
        let offset = Math.floor(Math.random() * 9) - 4; 
        if (offset === 0) offset = 2; 
        let wrongAnswer = correctAnswer + offset;
        if (wrongAnswer < 0) wrongAnswer = correctAnswer + 3;
        if (!answers.includes(wrongAnswer)) answers.push(wrongAnswer);
    }
    answers.sort(() => Math.random() - 0.5);

    for (let i = 0; i < 4; i++) {
        let btn = document.getElementById(`opt${i}`);
        btn.innerText = answers[i];
        btn.value = answers[i];
        btn.style.backgroundColor = '#ffd166';
    }
}

function checkAnswer(index) {
    if (isProcessing) return;
    isProcessing = true;

    const selectedBtn = document.getElementById(`opt${index}`);
    const selectedAnswer = parseInt(selectedBtn.value);
    const feedbackEl = document.getElementById('feedback');
    
    const isCorrect = (selectedAnswer === currentQuestionData.trueAns);

    if (isCorrect) {
        currentQuestionData.solved = true;
        gameHistory.push({ ...currentQuestionData }); // Simpan state akhir soal

        playSfx('correct');
        feedbackEl.innerText = 'Benar! 🎉';
        feedbackEl.className = 'correct';
        selectedBtn.style.backgroundColor = '#2ecc71'; 
        score += 10;
        
        confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 } });
        document.getElementById('score').innerText = score;

        let delay = gameType === 'challenge' ? 600 : 1200;
        setTimeout(() => {
            if(gameType === 'challenge' && timeLeft <= 0) return; 
            generateQuestion(); // Soal diganti hanya saat jawaban benar
        }, delay);

    } else {
        currentQuestionData.mistakes++; // Catat jumlah kesalahan
        
        playSfx('wrong');
        feedbackEl.innerText = 'Salah! 🤔';
        feedbackEl.className = 'wrong';
        selectedBtn.style.backgroundColor = '#e74c3c'; 
        
        if (score > 0) score -= 5;
        document.getElementById('score').innerText = score;

        // Soal tidak diganti. Tombol di-reset agar anak bisa mencoba lagi
        setTimeout(() => {
            selectedBtn.style.backgroundColor = '#ffd166';
            feedbackEl.innerText = '';
            isProcessing = false;
        }, 1000);
    }
}

function finishGame() {
    document.getElementById('final-score').innerText = score;
    const reviewContainer = document.getElementById('review-list');
    reviewContainer.innerHTML = ''; 

    if(gameHistory.length === 0) {
        reviewContainer.innerHTML = '<div class="review-item">Belum ada soal yang diselesaikan.</div>';
    } else {
        gameHistory.forEach(item => {
            const div = document.createElement('div');
            
            if (item.solved && item.mistakes === 0) {
                // Langsung Benar
                div.className = 'review-item correct';
                div.innerHTML = `<b>${item.qText} = ${item.trueAns}</b><br><small style="color: #2ecc71;">✅ Sempurna</small>`;
            } else if (item.solved && item.mistakes > 0) {
                // Akhirnya benar, tapi sempat salah
                div.className = 'review-item warning';
                div.innerHTML = `<b>${item.qText} = ${item.trueAns}</b><br><small style="color: #d35400;">⚠️ Benar setelah salah ${item.mistakes} kali</small>`;
            } else if (!item.solved) {
                // Berhenti sebelum menemukan jawaban yang benar
                div.className = 'review-item wrong';
                div.innerHTML = `<b>${item.qText} = ${item.trueAns}</b><br><small style="color: #c0392b;">❌ Dihentikan (Sempat salah ${item.mistakes} kali)</small>`;
            }
            
            reviewContainer.appendChild(div);
        });
    }
    showScreen('screen-result');
}