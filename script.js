//==============================
// プリンセス通信
//==============================

const princess = document.getElementById("princess");
const playButton = document.getElementById("playButton");
const voice = document.getElementById("voice");
const message = document.getElementById("message");

let talking = false;

//==============================
// まばたき
//==============================

function blink(){

    if(talking) return;

    princess.src = "blink.png";

    setTimeout(()=>{

        if(!talking){
            princess.src = "normal.png";
        }

    },180);

}

function randomBlink(){

    const next =
        Math.random()*3000+2000;

    setTimeout(()=>{

        blink();

        randomBlink();

    },next);

}

randomBlink();


//==============================
// 口パク
//==============================

let mouthAnimation;

function startTalking(){

    talking = true;

    let open = false;

    mouthAnimation = setInterval(()=>{

        open = !open;

        if(open){

            princess.src="mouth_open.png";

        }else{

            princess.src="mouth_close.png";

        }

    },180);

}

function stopTalking(){

    talking = false;

    clearInterval(mouthAnimation);

    princess.src="normal.png";

}


//==============================
// ボタン
//==============================

playButton.addEventListener("click",()=>{

    if(!voice.paused){
        return;
    }

    message.textContent="📡 プリンセスから通信を受信しています…";

    voice.currentTime=0;

   playButton.addEventListener("click", () => {
    startPrincessSequence();
});

});


//==============================
// 再生開始
//==============================

voice.addEventListener("play",()=>{

    playButton.disabled=true;

    playButton.textContent="通信中…";

    startTalking();

});


//==============================
// 再生終了
//==============================

voice.addEventListener("ended",()=>{

    stopTalking();

    playButton.disabled=false;

    playButton.textContent="▶ プリンセス通信を受信する";

    message.textContent="通信が終了しました✨";

});


//==============================
// 一時停止
//==============================

voice.addEventListener("pause",()=>{

    if(voice.ended) return;

    stopTalking();

});


//==============================
// エラー
//==============================

voice.addEventListener("error",()=>{

    alert("voice.mp3 が見つかりません。");

});

function getVoiceByDay(){

    const day = new Date().getDay();

    switch(day){

        case 1: return "monday.mp3";
        case 2: return "tuesday.mp3";
        case 3: return "wednesday.mp3";
        case 4: return "thursday.mp3";
        case 5: return "friday.mp3";

        default: return "voice.mp3";
    }
}

//==============================
// 順番再生システム
//==============================

function playAudio(src){

    return new Promise((resolve)=>{

        voice.src = src;
        voice.load();
        voice.play();

        voice.onended = () => {
            resolve();
        };

    });

}

//==============================
// メインシーケンス
//==============================

async function startPrincessSequence(){

    playButton.disabled = true;

    // ① あいさつ固定
    await playAudio("goodmorning.mp3");

    // ② 曜日別音声
    await playAudio(getVoiceByDay());

    // ③ プリンセスモード
    await playAudio("princess_mode_on.mp3");

    playButton.disabled = false;

}


function showPrincess(){
princess.style.opacity = "1";
}
