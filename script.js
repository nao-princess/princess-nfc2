const jewel = document.getElementById("jewel");
const princess = document.getElementById("princess");
const voice = document.getElementById("voice");
const message = document.getElementById("message");

let isSequencing = false;
let princessMode = false;
let mouthTimer = null;

/* ===========================
   紙吹雪（両脇下からパンッ）
=========================== */



    const end = Date.now() + 2000;

  (function confettiBurst() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.8 },
      colors: ['#ffe6f2', '#d81b60', '#ffb3d9', '#ffffff'] // プリンセス風の色合い
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.8 },
      colors: ['#ffe6f2', '#d81b60', '#ffb3d9', '#ffffff']
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
}
前

/* ===========================
   口パク
=========================== */

function startTalking(){
    let open = false;

    mouthTimer = setInterval(()=>{
        open = !open;
        princess.src = open ? "mouth_open.png" : "mouth_close.png";
    },180);
}

function stopTalking(){
    clearInterval(mouthTimer);
    princess.src = "normal.png";
}

/* ===========================
   音声
=========================== */

function playAudio(file){
    return new Promise((resolve)=>{

        voice.src = file;

        voice.onplay = () => startTalking();
        voice.onended = () => {
            stopTalking();
            resolve();
        };

        voice.play();
    });
}

/* ===========================
   変身
=========================== */

function transform(){
    jewel.style.opacity = "0";

    setTimeout(()=>{
        princess.classList.add("showPrincess");
        princessMode = true;
    },600);
}

/* ===========================
   本編
=========================== */

async function startSequence(){

    if(isSequencing) return;
    isSequencing = true;

    message.textContent = "📡 通信開始…";

    await playAudio("servant.wav");

    transform();

    message.textContent = "✨ プリンセス登場";

    await playAudio("goodmorning.wav");
    await playAudio(getVoiceByDay());

    confettiBurst(); // ←ここ！

    await playAudio("princess_mode_on.wav");

    message.textContent = "✨ 通信終了";

    isSequencing = false;
}

/* ===========================
   曜日
=========================== */

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

/* ===========================
   イベント
=========================== */

jewel.addEventListener("click", startSequence);
princess.addEventListener("click", startSequence);
