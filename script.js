document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
});

function loadSettings() {
    // LocalStorageから作業時間と休憩時間を読み込む
    var workInterval = localStorage.getItem('workInterval');
    var breakInterval = localStorage.getItem('breakInterval');

    // LocalStorageに保存されている値がある場合、それをフォームの入力値として設定
    if (workInterval) {
        document.getElementById('workInterval').value = parseInt(workInterval, 10) / 60;  // 秒を分に変換
    }
    if (breakInterval) {
        document.getElementById('breakInterval').value = parseInt(breakInterval, 10) / 60;  // 秒を分に変換
    }
}


document.getElementById('timerSettings').addEventListener('submit', function(event) {
    event.preventDefault();  // フォームのデフォルトの送信動作を防止

    // 入力された時間を取得して数値に変換
    var workInterval = parseInt(document.getElementById('workInterval').value, 10) * 60;  // 分を秒に変換
    var breakInterval = parseInt(document.getElementById('breakInterval').value, 10) * 60;  // 分を秒に変換

    // LocalStorageに設定を保存
    saveSettings(workInterval, breakInterval);

    // タイマーをリセットして新しい設定で開始
    resetAndStartTimers(workInterval, breakInterval);
});

function resetAndStartTimers(workTime, breakTime) {
    startTimer(workTime, 'workTimer', function() {
        onWorkEnd(); // 作業時間が終了したら呼び出される関数
        startTimer(breakTime, 'breakTimer', function() {
            onBreakEnd(); // 休憩時間が終了したら呼び出される関数
            resetAndStartTimers(workTime, breakTime);  // 繰り返し、次のサイクルを開始
        });
    });
}



var currentInterval;  // 現在実行中のタイマーのインターバルIDを保持するグローバル変数

function startTimer(duration, elementId, callback) {
    var timer = duration, minutes, seconds;
    var display = document.getElementById(elementId);
    clearInterval(currentInterval);  // 既存のタイマーがあれば停止
    currentInterval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(currentInterval);
            callback();  // タイマーが0になったときに指定されたコールバックを実行
        }
    }, 1000);
}

// 通知を送る関数
function sendNotification(title, options, onClickAction) {
    if (Notification.permission === 'granted') {
        const notification = new Notification(title, options);
        notification.onclick = () => {
            onClickAction();
            notification.close(); // 通知を閉じる
        };
    }
}




// LocalStorageに設定を保存する関数
function saveSettings(workInterval, breakInterval) {
    localStorage.setItem('workInterval', workInterval);
    localStorage.setItem('breakInterval', breakInterval);
}

function saveWorkLog(duration) {
    console.log("Saving work log with duration:", duration);  // デバッグ出力を追加
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // YYYY-MM-DD形式の日付を取得

    let workLogs = JSON.parse(localStorage.getItem('workLogs')) || {};
    if (!workLogs[today]) {
        workLogs[today] = [];
    }
    workLogs[today].push({ time: now.toISOString(), duration: duration });

    localStorage.setItem('workLogs', JSON.stringify(workLogs));
}

document.addEventListener('DOMContentLoaded', function() {
    displayTodayWorkLog();
});


function onWorkEnd() {
    sendNotification('作業時間終了', {
        body: '休憩時間に入りましょう。',
        icon: 'work_end_icon.png'
    }, () => {
        window.open('breath/index.html', '_blank'); // 新しいタブでページを開く
    });
}

function onBreakEnd() {
    sendNotification('休憩時間終了', {
        body: '作業を再開しましょう。',
        icon: 'break_end_icon.png'
    }, () => {
        window.focus(); // 現在のウィンドウにフォーカスを戻す
    });
}





function displayTodayWorkLog() {
    const today = new Date().toISOString().split('T')[0];
    const workLogs = JSON.parse(localStorage.getItem('workLogs')) || {};

    Object.keys(workLogs).forEach(date => {
        if (date < today) {
            delete workLogs[date];
        }
    });
    localStorage.setItem('workLogs', JSON.stringify(workLogs));

    const todayLogs = workLogs[today] || [];
    const totalDuration = todayLogs.reduce((sum, log) => sum + log.duration, 0);

    const totalHours = Math.floor(totalDuration / 3600);
    const totalMinutes = Math.floor((totalDuration % 3600) / 60);
    const totalSeconds = totalDuration % 60;
    document.getElementById('workLogSummary').innerHTML = `今日の作業時間: ${totalHours}時間 ${totalMinutes}分 ${totalSeconds}秒`;

    const logList = document.getElementById('detailedWorkLogs');
    logList.innerHTML = '';
    todayLogs.forEach(log => {
        const logTime = new Date(log.time);
        const hours = Math.floor(log.duration / 3600);
        const minutes = Math.floor((log.duration % 3600) / 60);
        const seconds = log.duration % 60;
        const timeString = `${logTime.getHours()}:${logTime.getMinutes()}:${logTime.getSeconds()}`;
        const listItem = document.createElement('li');
        listItem.textContent = `${timeString} - ${hours}時間 ${minutes}分 ${seconds}秒`;
        logList.appendChild(listItem);
    });
}



