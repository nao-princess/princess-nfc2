//======================================
// プリンセス通信 Ver.2
//======================================

const jewel = document.getElementById("jewel");
const princess = document.getElementById("princess");
const voice = document.getElementById("voice");
const message = document.getElementById("message");

let isSequencing = false;
let talking = false;
let mouthTimer = null;
let princessMode = false;

//======================================
// 初期状態
//======================================

princess.classList.remove("showPrincess");
message.textContent = "💎をタップして通信開始";

//======================================
// キラキラ
//======================================

function sparkle(count = 20){
    for(let i=0;i<count;i++){
        const star = document.createElement("div");
        star.className = "sparkle";
        star.textContent = Math.random() > 0.5 ? "✨" : "⭐";

        star.style.left = (window.innerWidth/2 + (Math.random()*200 - 100)) + "px";
        star.style.top = (window.innerHeight/2 - 80 + Math.random()*60) + "px";

        document.body.appendChild(star);

        setTimeout(() => star.remove(), 1200);
    }
}

//======================================
// 口パク
//======================================

function startTalking(){
    talking = true;
    let open = false;

    mouthTimer = setInterval(() => {
        open = !open;
        princess.src = open ? "mouth_open.png" : "mouth_close.png";
    }, 180);
}

function stopTalking(){
    talking = false;
    clearInterval(mouthTimer);
    princess.src = "normal.png";
}

//======================================
// 音声再生
//======================================

function playAudio(file){
    return new Promise((resolve) => {
        voice.src = file;
        voice.load();

        voice.onplay = () => {
            startTalking();
        };

        voice.onended = () => {
            stopTalking();
            resolve();
        };

        voice.play();
    });
}

//======================================
// 変身（💎 → 👸）
//======================================

function transformToPrincess(){
    jewel.style.opacity = "0";

    setTimeout(() => {
        princess.classList.add("showPrincess");
        princessMode = true;
    }, 600);
}

//======================================
// 通信シーケンス
//======================================

async function startSequence(){

    if(isSequencing) return;

    isSequencing = true;

    document.body.classList.add("dark");

    message.textContent = "📡 通信を接続しています…";

    sparkle();

    //--- 従者の声（💎のまま）
    await playAudio("servant.wav");

    //--- 変身
    transformToPrincess();

    await new Promise(r => setTimeout(r, 800));

    //--- プリンセス登場後の会話
    message.textContent = "✨ プリンセス通信開始";

    await playAudio("goodmorning.wav");

    await playAudio(getVoiceByDay());

    sparkle();

    await playAudio("princess_mode_on.wav");

    message.textContent = "✨ 通信終了（プリンセスモードON）";

    princessMode = true;

    isSequencing = false;

    document.body.classList.remove("dark");
}

//======================================
// 曜日ボイス
//======================================

function getVoiceByDay(){
    switch(new Date().getDay()){
        case 1: return "monday.wav";
        case 2: return "tuesday.wav";
        case 3: return "wednesday.wav";
        case 4: return "thursday.wav";
        case 5: return "friday.wav";
        default: return "goodmorning.wav";
    }
}

//======================================
// クリック操作
//======================================

// 💎タップ → 通信開始
jewel.addEventListener("click", startSequence);

// 👸タップ → もう一度通信
princess.addEventListener("click", () => {
    if(princessMode && !isSequencing){
        startSequence();
    }
});

//======================================
// エラー
//======================================

voice.addEventListener("error", () => {
    alert("音声ファイルが見つかりません");
});
