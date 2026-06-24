//==============================
// プリンセス通信
//==============================

const princess = document.getElementById("princess");
const jewel = document.getElementById("jewel");
const playButton = document.getElementById("playButton");
const voice = document.getElementById("voice");
const message = document.getElementById("message");

let talking = false;
let mouthAnimation;

// 最初の状態
princess.style.opacity = "0";
jewel.style.opacity = "1";


//==============================
// まばたき
//==============================

function blink() {

    if (talking) return;

    princess.src = "blink.png";

    setTimeout(() => {

        if (!talking) {
            princess.src = "normal.png";
        }

    }, 180);

}

function randomBlink() {

    const next = Math.random() * 3000 + 2000;

    setTimeout(() => {

        blink();
        randomBlink();

    }, next);

}

randomBlink();


//==============================
// 口パク
//==============================

function startTalking() {

    talking = true;

    let open = false;

    mouthAnimation = setInterval(() => {

        open = !open;

        princess.src = open ? "mouth_open.png" : "mouth_close.png";

    }, 180);

}

function stopTalking() {

    talking = false;

    clearInterval(mouthAnimation);

    princess.src = "normal.png";

}


//==============================
// 音声再生
//==============================

function playAudio(file) {

    return new Promise((resolve) => {

        voice.src = file;
        voice.load();

        voice.onended = () => {
            stopTalking();
            resolve();
        };

        voice.onplay = () => {
            startTalking();
        };

        voice.play();

    });

}


//==============================
// 曜日別音声
//==============================

function getVoiceByDay() {

    switch (new Date().getDay()) {

        case 1: return "monday.mp3";
        case 2: return "tuesday.mp3";
        case 3: return "wednesday.mp3";
        case 4: return "thursday.mp3";
        case 5: return "friday.mp3";

        default:
            return "voice.mp3";

    }

}


//==============================
// プリンセス登場
//==============================

function showPrincess() {

    jewel.style.opacity = "0";
    princess.style.opacity = "1";

}


//==============================
// メインシーケンス
//==============================

async function startPrincessSequence() {

    playButton.disabled = true;
    playButton.textContent = "通信中…";

    message.textContent = "📡 通信を受信しています…";

    princess.style.opacity = "0";
    jewel.style.opacity = "1";

    // 従者
    await playAudio("servant.wav");

    // 登場
    showPrincess();

    await new Promise(resolve => setTimeout(resolve, 800));

    // あいさつ
    await playAudio("goodmorning.wav");

    // 曜日
    await playAudio(getVoiceByDay());

    // プリンセスモード
    await playAudio("princess_mode_on.wav");

    message.textContent = "✨ 通信が終了しました";

    playButton.disabled = false;
    playButton.textContent = "▶ プリンセス通信を受信する";

}


//==============================
// ボタン
//==============================

playButton.addEventListener("click", () => {

    if (!voice.paused) return;

    startPrincessSequence();

});


//==============================
// エラー
//==============================

voice.addEventListener("error", () => {

    alert("音声ファイルが見つかりません。");

});
