const speakeasy = require('speakeasy');
const qr = require('qr-image');
const express = require('express');
const tl = require('express-tl');

const app = express();

// ------------------------------
// viewのテンプレートエンジン設定
// ------------------------------
app.engine('tl', tl);
app.set('views', 'src/views');
app.set('view engine', 'tl');

// ------------------------------
// リクエストの処理
// ------------------------------
// トップページ
app.get('/', function (req, res) {
  // シークレットキー発行
  let secret = speakeasy.generateSecret({ length: 20 });

  // QRコード生成のURL設定
  let qrPath = '/qrcode?qrurl=' + encodeURIComponent(secret.otpauth_url);

  // 現在のトークン設定
  let token = getToken(secret.base32);

  // レンダリング
  res.render('index', {
    // パラメータ
    secret,
    qrPath,
    token,
  });
});

// QRコード生成
// param: qrurl : QRコードのURL
app.get('/qrcode', function (req, res) {
  let code = qr.image(req.query.qrurl, { type: 'png' });
  res.type('png');
  code.pipe(res);
});

// 現在のトークン取得
// param: secret : シークレットキー
app.get('/token', function (req, res) {
  let token = getToken(req.query.secret);
  console.log(token);
  res.send(token);
});

// コードの認証
// param: secret : シークレットキー
// param: token : トークン
app.get('/verify', function (req, res) {
  if (verifyToken(req.query.secret, req.query.token)) {
    res.send('認証成功！');
  } else {
    res.send('認証失敗！！');
  }
});

// ------------------------------
// 関連処理
// ------------------------------
// 現在のトークンの取得
function getToken(secretVal) {
  console.log('---- getToken() ----');
  console.log('secret:' + secretVal);

  return speakeasy.time({
    secret: secretVal,
    encoding: 'base32',
  });
}

// コードの認証
function verifyToken(secret, token) {
  console.log('---- verifyToken() ----');
  console.log('secret:' + secret);
  console.log('token:' + token);
  console.log(getToken(secret));

  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
  });
}

// ------------------------------
// リスナー起動
// ------------------------------
app.listen(3000, () => {
  console.log('Express listening on port 3000!');
});
