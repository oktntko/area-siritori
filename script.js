
let playerNames = [];   // 参加者名一覧
let turn = 0;           // 手番

let boardChars = [[]];  // 盤の各セルの文字
let focusPosition = { "Top": 0, "Left": 0 };

let validWords = [];    // 許容する単語一覧
const notfirstChars = "ぁぃぅぇぉゃゅょーん";   // １文字目にできない文字

let history = [{}];                                 // 棋譜
history[0].word = "";                               // └単語
history[0].startPosition = { "Top": 0, "Left": 0 }; // └開始セル位置
history[0].direction = "";                          // └方向
history[0].putNewCharIndex = [];                    // └新しくプルインした文字

// スタートボタンクリック時
function clickStart() {
  document.getElementById("devForm").style.display = "none";
  document.getElementById("form").style.display = "block";
  startGame();
}

// ゲーム開始
function startGame() {

  let userData = document.getElementById("userData").value;
  eval(userData);
  // --------------------下記が実行される--------------------
  // // ユーザー設定（仮）
  // playerNames = [ "Ａ太", "Ｂ子", "Ｃ郎" ];      // 参加者名一覧
  // validWords = [ "りんご", "ごりら", "らっぱ" ]; // 許容する単語一覧（現在は制約を掛けていない）
  // startWord = "しりとり";                       // 始めの中央4文字
  // --------------------上記が実行される--------------------

  createBoard(startWord);     // 盤生成
  turn = 0;                   // 手番クリア
  history = [];               // 棋譜クリア

  document.getElementById("status").innerHTML = playerNames[turn] + "さんの手番です。最初のマスを選んでください。";
  document.getElementById("selectStartCell").style.display = "block";
}

// 盤生成
function createBoard(startWord) {
  boardChars = [];  // 内部データ
  let addStr = "";  // 画面表示用データ
  for (let i = 0; i < 6; i ++) {
    boardChars[i] = [];
    addStr += "<tr>";
    for (let j = 0; j < 6; j ++) {
      boardChars[i][j] = "";
      addStr += "<td></td>";
    }
    addStr += "</tr>";
  }
  document.getElementById("board").innerHTML = addStr;

  putChar(startWord.charAt(0), { "Top": 2, "Left": 2 });
  putChar(startWord.charAt(1), { "Top": 2, "Left": 3 });
  putChar(startWord.charAt(2), { "Top": 3, "Left": 2 });
  putChar(startWord.charAt(3), { "Top": 3, "Left": 3 });
}

// 最初のセルクリック時
function clickStartCell(position) {
  focusPosition = position;
  element = document.getElementById("board");
  element.rows[position.Top].cells[position.Left].setAttribute("class", "focusCell");

  document.getElementById("selectStartCell").style.display = "none";
  document.getElementById("inputWords").style.display = "block";
  document.getElementById("status").innerHTML = playerNames[turn] + "さんの手番です。進む方向を選び、文字を入力してください。";
}

// 単語の決定ボタンクリック時
function clickDecision() {
  let word = document.getElementById("word").value;
  let direction = "";
  let elements = document.getElementsByName("radioDirection");
  for (let i = 0; i < elements.length; i ++) {
    if (elements[i].checked) direction = elements[i].id;
  }

  let checkWordResult = checkWord(word, direction);   // 単語チェック

  // 単語エラー表示
  if (!checkWordResult.result) {
    document.getElementById("errorMessage").innerHTML = checkWordResult.errorMessage;
    return;
  }

  document.getElementById("errorMessage").innerHTML = "";  // エラー非表示

  putWord(word, direction);             // 単語配置
  changeFocusPosition(word, direction); // フォーカス移動

  let checkDrawResult = checkDraw();    // 引き分けチェック

  // 引き分け表示
  if (checkDrawResult) {
    document.getElementById("status").innerHTML = "引き分けです。";
    document.getElementById("inputWords").style.display = "none";
    return;
  }

  changeTurn(); // 手番移動
}

// 単語チェック
function checkWord(word, direction) {

  // 方向入力チェック
  if (direction == "") return { "result": false, "errorMessage": "方向を指定してください。" };

  // 0文字チェック
  if (word == "") return { "result": false, "errorMessage": "単語を入力してください。" };

  // 正規表現チェック
  let pattern = "^[ぁ-んー]+$";
  if (word.match(pattern) == null) return { "result": false, "errorMessage": "ひらがなで入力してください。" };

  // 「ん」チェック
  if (word.charAt(word.length - 1) == "ん") return { "result": false, "errorMessage": "「ん」で終わってはいけません。" };

  let move = directionStringToObject(direction);  // "TopLeft" → { "Top": -1, "Left": -1 }
  let errorFlg = false;

  // 盤からのはみ出しチェック
  let top = focusPosition.Top + word.length * move.Top;
  let left = focusPosition.Left + word.length * move.Left;
  if (top < -1 || top > 6) errorFlg = true;
  if (left < -1 || left > 6) errorFlg = true;
  if (errorFlg) return { "result": false, "errorMessage": "選択した方向へは" + word.length + "文字の単語は作れません。" };

  // 空白セルの通過チェック
  errorFlg = true;
  let position = { "Top": focusPosition.Top, "Left": focusPosition.Left };
  for (let i = 0; i < word.length - 1; i ++) {
    position.Top += move.Top;
    position.Left += move.Left;
    if (boardChars[position.Top][position.Left] != "") continue;
    errorFlg = false;
    break;
  }
  if (errorFlg) return { "result": false, "errorMessage": "空白マスを通るように単語を作ってください。" };

  // 既存文字チェック
  let notMatchIndex = []; // 既存の文字と合わない文字
  position = { "Top": focusPosition.Top, "Left": focusPosition.Left };
  for (let i = 0; i < word.length; i ++) {
    console.log(position)
    if (boardChars[position.Top][position.Left] != "") {
      if (boardChars[position.Top][position.Left] != word.charAt(i)) {
        notMatchIndex[notMatchIndex.length] = i + 1;
        errorFlg = true;
      }
    }
    position.Top += move.Top;
    position.Left += move.Left;
  }
  if (errorFlg) return { "result": false, "errorMessage": "既に出ている文字と合いません。（" + notMatchIndex.join(",") + "文字目）" };

  // 許容単語チェック
  // for (let i = 0; i < validWords.length; i ++) {
  //   return { "result": false, "errorMessage": "辞書に載っていません。" };
  // }

  // エラー無し
  return { "result": true };
  console.log("エラー無し");
}

// 単語配置
function putWord(word, direction) {

  // 棋譜の記録
  history[history.length] = {};
  history[history.length - 1].word = word;
  history[history.length - 1].startPosition = focusPosition;
  history[history.length - 1].direction = direction;
  history[history.length - 1].putNewCharIndex = [];

  let move = directionStringToObject(direction);  // "TopLeft" → { "Top": -1, "Left": -1 }

  let position = { "Top": focusPosition.Top, "Left": focusPosition.Left };
  for (let i = 1; i < word.length; i ++) {
    position.Top += move.Top;
    position.Left += move.Left;
    if (boardChars[position.Top][position.Left] != "") continue;

    putChar(word.charAt(i), position);  // 文字配置

    // 新しくプルインした文字の棋譜の記録
    let charIndex = history[history.length - 1].putNewCharIndex.length - 1;
    history[history.length - 1].putNewCharIndex[charIndex] = i;
  }

  let element = document.getElementById("log");
  element.innerHTML = "<div>" + playerNames[turn] + "さんは「" + word + "」をプレイしました。</div>" + element.innerHTML;
}

// 文字配置
function putChar(char, position) {
  boardChars[position.Top][position.Left] = char; // 内部データ
  element = document.getElementById("board");
  element.rows[position.Top].cells[position.Left].innerHTML = char; // 画面表示用データ
}

// フォーカス移動
function changeFocusPosition(word, direction) {
  let move = directionStringToObject(direction);

  element = document.getElementById("board");
  element.rows[focusPosition.Top].cells[focusPosition.Left].removeAttribute("class");

  for (let i = word.length - 1; i >= 0; i --) {
    if (notfirstChars.includes(word.charAt(i))) continue;
    focusPosition.Top += i * move.Top;
    focusPosition.Left += i * move.Left;
    break;
  }

  element.rows[focusPosition.Top].cells[focusPosition.Left].setAttribute("class", "focusCell");
}

// 引き分けチェック
function checkDraw() {
  for (let i = 0; i < 6; i ++) {
    if (boardChars[focusPosition.Top][i] == "") return false;
    if (boardChars[i][focusPosition.Left] == "") return false;
  }
  for (let t = -1; t <= 1; t += 2) {
    for (let l = -1; l <= 1; l += 2) {
      for (let i = 1; i < 6; i ++) {
        let top = focusPosition.Top + t * i;
        let left = focusPosition.Left + l * i;
        if (top >= 0 && top <= 5 && left >= 0 && left <= 5) {
          if (boardChars[top][left] == "") return false;
        }
      }
    }
  }
  return true;
}

// 手番移動
function changeTurn() {
  turn = (turn + 1) % playerNames.length;
  document.getElementById("status").innerHTML = playerNames[turn] + "さんの手番です。進む方向を選び、文字を入力してください。";
  document.getElementById("word").value = "";

}

// 文字列からオブジェクトに変換
function directionStringToObject(direction) {
  switch (direction) {
    case "TopLeft":      return { "Top": -1, "Left": -1 };
    case "Top":          return { "Top": -1, "Left":  0 };
    case "TopRight":     return { "Top": -1, "Left":  1 };
    case "Left":         return { "Top":  0, "Left": -1 };
    case "Right":        return { "Top":  0, "Left":  1 };
    case "BottomLeft":   return { "Top":  1, "Left": -1 };
    case "Bottom":       return { "Top":  1, "Left":  0 };
    case "BottomRight":  return { "Top":  1, "Left":  1 };
    default: return false;
  }
}
