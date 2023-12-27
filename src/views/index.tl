<!doctype html>
<html>
<head>
  <title>speakeasy demo</title>
</head>
<body>
  <h1>speakeasy demo</h1>
  <p>
    secret: 
    <span id="secret">${d.secret.base32}</span>
  </p>
  <p>
    qrcode: 
    <img
      src="${d.qrPath}"
      style="display: block; width: 200px; height: 200px;"
      />
  </p>
  <p>qrPath: ${d.qrPath}</p>
  <p>
    token:
    <span id="token">${d.token}</span>
    <br />
    <!-- カウントダウンタイマー -->
    <small
      id="update"
      style="text-color: red;"
      >
      Updating...
    </small>
  </p>
  <p>
    verify:
    <!-- トークンの入力 -->
    <input type="text" id="token_input" placeholder="000000" />
    <button
      id="btn_verify"
      onClick="handleClick();"
      >
      認証
    </button>
    <br />
    <small
      id="verify_result"
      style="text-color: red;"
      >
      未認証
    </small>
  </p>

  <script>
    // トークンの再発行
    let updateToken = function() {
      let secretVal = document.getElementById('secret').textContent;
      console.log(secretVal);

      // トークンを取得する
      fetch(
        '/token?secret=' + secretVal,
        {
          method: "GET"
        })
        .then((response) => response.text())
        .then((data) => {
          console.log(data);
          document.getElementById('token').textContent = data;
          })
        .catch((error) => console.log(error))
        ;
    }

    // 認証ボタン押下時
    let handleClick = function() {
      let secretVal = document.getElementById('secret').textContent;
      let tokenVal = document.getElementById('token_input').value;

      // コード確認
      fetch(
        '/verify?secret=' + secretVal + '&token=' + tokenVal,
        {
          method: "GET"
        })
        .then((response) => response.text())
        .then((data) => {
          // 結果
          console.log(data);
          document.getElementById('verify_result').textContent = data;
          })
        .catch((error) => console.log(error))
        ;

    }

    // タイマー処理
    let updateTimer = function() {
      // 現在時刻の「秒」を取得
      let sec = new Date().getSeconds();

      // 0と30秒のときにトークンの再発行
      if( sec == 0 || sec == 30) {
        updateToken();
      } else {
        let secsToNext = 0;

        // 30秒ごとにカウントになるように調整
        if (sec < 30) {
          secsToNext = 30 - sec;
        } else if (sec > 30) {
          secsToNext = 60 - sec;
        }

        document.getElementById('update').textContent = 'Updating in ' + secsToNext + ' sec...';
      }
    }

    // 500msごとに実行
    setInterval(updateTimer, 500);
  </script>
</body>
</html>
