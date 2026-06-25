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

function confettiBurst(){

    for(let i=0;i<25;i++){

        const c = document.createElement("div");
        c.className = "confetti";

        // 左右どっちか
        const side = Math.random() > 0.5 ? -1 : 1;

        c.style.left = (window.innerWidth/2 + side * 120) + "px";
        c.style.top = (window.innerHeight/2 + 120) + "px";

        c.style.background = randomColor();

        c.style.setProperty("--x", (side * (100 + Math.random()*200)) + "px");
        c.style.setProperty("--y", (-200 - Math.random()*300) + "px");

        document.body.appendChild(c);

        setTimeout(()=>c.remove(),1200);
    }
}

function randomColor(){
    const colors = ["#ff6bd6","#ffd36b","#6bd6ff","#9dff6b","#ffffff"];
    return colors[Math.floor(Math.random()*colors.length)];
}

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
