//======================================
// プリンセス通信
//======================================
const princess = document.getElementById("princess");
const jewel = document.getElementById("jewel");
const playButton = document.getElementById("playButton");
const voice = document.getElementById("voice");
const message = document.getElementById("message");

let talking = false;
let mouthTimer = null;
let isSequencing = false;

// 💡 拡張子の自動判別機能（エラーが出たら小文字/大文字を切り替える）
princess.addEventListener("error", () => {
  const currentSrc = princess.src;
  if (currentSrc.endsWith(".PNG")) {
    princess.src = currentSrc.replace(".PNG", ".png");
  } else if (currentSrc.endsWith(".png")) {
    princess.src = currentSrc.replace(".png", ".PNG");
  }
});

//======================================
// 初期状態
//======================================
princess.src = "normal.PNG"; 
princess.classList.remove("showPrincess");
jewel.style.opacity = "1";

//======================================
// 待機中まばたき
//======================================
function blink() {
  if (talking || isSequencing) return;
  princess.src = "blink.PNG"; 
  setTimeout(() => {
    if (!talking) {
      princess.src = "normal.PNG"; 
    }
  }, 180);
}

function randomBlink() {
  const next = Math.random() * 3000 + 2500;
  setTimeout(() => {
    blink();
    randomBlink();
  }, next);
}
randomBlink();

//======================================
// 口パク
//======================================
function startTalking() {
  talking = true;
  let open = false;
  mouthTimer = setInterval(() => {
    open = !open;
    princess.src = open ? "mouth_open.PNG" : "mouth_close.PNG"; 
  }, 180);
}

function stopTalking() {
  talking = false;
  clearInterval(mouthTimer);
  princess.src = "normal.PNG"; 
}

//======================================
// キラキラ生成
//======================================
function sparkle() {
  for(let i=0; i<20; i++){
    const star = document.createElement("div");
    star.className = "sparkle";
    star.textContent = Math.random() > 0.5 ? "✨" : "⭐";
    star.style.left = (window.innerWidth / 2 + (Math.random() * 220 - 110)) + "px";
    star.style.top = (140 + Math.random() * 80) + "px";
    document.body.appendChild(star);
    setTimeout(() => {
      star.remove();
    }, 1200);
  }
}

//======================================
// 音声再生
//======================================
function playAudio(file){
  return new Promise((resolve) => {
    voice.src = file;
    voice.load();
    voice.onplay = () => { startTalking(); };
    voice.onended = () => { stopTalking(); resolve(); };
    voice.play();
  });
}

//======================================
// 曜日別音声
//======================================
function getVoiceByDay(){
  switch(new Date().getDay()){
    case 1: return "monday.wav";
    case 2: return "tuesday.wav";
    case 3: return "wednesday.wav";
    case 4: return "thursday.wav";
    case 5: return "friday.wav";
  }
}

//======================================
// メイン演出
//======================================
async function startSequence(){
  isSequencing = true; 
  playButton.disabled = true;
  message.textContent = "📡 通信を接続しています…";
  document.body.classList.add("dark");
  
  sparkle();
  await wait(1000); 
  
  princess.src = "normal.PNG"; 
  
  jewel.style.opacity = "0";
  princess.classList.add("showPrincess");
  sparkle();
  
  await wait(1500); 
  
  message.textContent = "👑 プリンセス通信を受信しています";
  await playAudio("servant.wav");
  await playAudio("goodmorning.wav");
  await playAudio(getVoiceByDay());
  await playAudio("princess_mode_on.wav");
  
  message.textContent = "✨ 通信終了";
  playButton.disabled = false;
  playButton.textContent = "▶ プリンセス通信を受信する";
  document.body.classList.remove("dark");
  isSequencing = false; 
}

//======================================
// 待機
//======================================
function wait(ms){
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

//======================================
// ボタン
//======================================
playButton.addEventListener("click", () => {
  startSequence();
});

//======================================
// エラー
//======================================
voice.addEventListener("error", () => {
  alert("音声ファイルが見つかりません。");
});
