const speakeasy = require('speakeasy');
const qr = require('qr-image');
const express = require('express');
const tl = require('express-tl');

const app = express();

// viewのテンプレートエンジン設定
app.engine('tl', tl);
app.set('views', 'src/views');
app.set('view engine', 'tl');

// トップページ
app.get('/', function (req, res) {
  // レンダリング
  res.render('index', {
    // パラメータ
    sport: true,
  });
});

// リスナー起動
app.listen(3000, () => {
  console.log('Express listening on port 3000!');
});
