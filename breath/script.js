function startBreathing() {
    const inhaleSound = document.getElementById('inhale-sound');
    const exhaleSound = document.getElementById('exhale-sound');

    const inhaleTime = document.getElementById('inhale-time').value * 1000;
    const pauseTimeAfterInhale = document.getElementById('pause-time-after-inhale').value * 1000;
    const exhaleTime = document.getElementById('exhale-time').value * 1000;
    const pauseTimeAfterExhale = document.getElementById('pause-time-after-exhale').value * 1000;
    const cycles = document.getElementById('cycles').value;
    
    const circle = document.getElementById('breathing-circle');
    circle.innerHTML = ''; // Clear previous animations

    for (let i = 0; i < cycles; i++) {
        setTimeout(() => {
            const fill = document.createElement('div');
            fill.className = 'fill';
            circle.appendChild(fill);

            fill.style.animation = `expand ${inhaleTime}ms ease-in, 
                                     stay_ex ${pauseTimeAfterInhale}ms ${inhaleTime}ms, 
                                     shrink ${exhaleTime}ms ease-in ${inhaleTime + pauseTimeAfterInhale}ms, 
                                     stay_sh ${pauseTimeAfterExhale}ms ${inhaleTime + pauseTimeAfterInhale + exhaleTime}ms`;

            // Adjust sound playback rate to match the breathing times
            inhaleSound.playbackRate = inhaleSound.duration * 1000 / inhaleTime;
            exhaleSound.playbackRate = exhaleSound.duration * 1000 / exhaleTime;

            inhaleSound.play();
            setTimeout(() => {
                exhaleSound.play();
            }, inhaleTime + pauseTimeAfterInhale);

            setTimeout(() => {
                circle.removeChild(fill);
            }, inhaleTime + pauseTimeAfterInhale + exhaleTime + pauseTimeAfterExhale);
        }, (inhaleTime + pauseTimeAfterInhale + exhaleTime + pauseTimeAfterExhale) * i);
    }
}


// CSS animations
const styleSheet = document.createElement('style');
styleSheet.innerHTML = `
    @keyframes expand {
        from { width: 0; height: 0; }
        to { width: 100%; height: 100%; }
    }
    @keyframes shrink {
        from { width: 100%; height: 100%; }
        to { width: 0; height: 0; }
    }
    @keyframes stay_ex {
        from { width: 100%; height: 100%; }
        to { width: 100%; height: 100%; }
    }
    @keyframes stay_sh {
        from { width: 0; height: 0; }
        to { width: 0; height: 0; }
    }
`;
document.head.appendChild(styleSheet);

window.onload = function() {
    // 呼吸の設定値
    document.getElementById('inhale-time').value = 2;  // 吸入時間（秒）
    document.getElementById('pause-time-after-inhale').value = 1;  // 吸入後の停止時間（秒）
    document.getElementById('exhale-time').value = 2;  // 吐出時間（秒）
    document.getElementById('pause-time-after-exhale').value = 1;  // 吐出後の停止時間（秒）
    document.getElementById('cycles').value = 5;  // 呼吸のサイクル数

    // ボタンクリックを自動化
    document.getElementById('start-breathing-btn').click();  // 'start-breathing-btn'はボタンのID
};