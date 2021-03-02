/*
2020/10/29
created by ironikot
*/

'use strict';
// 現在時刻表示
const NOW = new Date();
const YEAR = NOW.getFullYear();
const MONTH = NOW.getMonth() +1;
const DATE = NOW.getDate();
const HOUR = NOW.getHours();
const MIN = NOW.getMinutes();
const PAGEOPENDATE = `${YEAR}年 ${MONTH + 0}月 ${DATE}日 ${HOUR}時${MIN}分`;

var PARSED_MONTH = 0;
var PARSED_DATE = 0;

document.getElementById('callDate').textContent = PAGEOPENDATE;



/**
* クリップボードにコピーする
* @param {Void}
* @return {Void}
*/
function copyToClipboard(){

    var toNameTarget = document.getElementById("toNameTarget").innerText;
    var callFromNameTarget = document.getElementById("callFromNameTarget").innerText;
    var checkBoxContent = document.getElementById("checkBoxContent").innerText;
    var callReasonMessage = document.getElementById("callReasonMessage").innerText;

     var copyMessage = toNameTarget + callFromNameTarget +  "\n" +checkBoxContent +  "\n" +callReasonMessage;

    if(execCopy(copyMessage)){
        copyResultAlert(copyMessage);
        //alert("コピーできました！ : " + callReasonMessage);
    }else{
        alert("このブラウザではコピーに対応していません");
    };

}

/**
* コピー結果をページに表示する
* @param {String}
* @return {Void}
*/
function copyResultAlert(text){
    var parentElement = document.getElementById('copyResultParent');
    var element = document.getElementById('copyResult');
    element.classList.add('alert', 'alert-primary', 'alert-dismisslble', 'fade', 'show');
    //document.getElementById('copyResultTitle').innerText = "hi";
    element.innerText =text;
    element.insertAdjacentHTML('afterbegin', '<h4 class="alert-heading">コピーできました！</h4>' );
    //element.insertAdjacentHTML('beforeend', '<button type="button" class="close"  data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span> </button>');

}

//[memo]:このグローバル変数の値に対して、各関数がメッセージを更新していくためにある
let _message = "";
/**
* 宛名を作成する関数
* @param {Void}
* @return {Void}
*/
function toName(){
  let message = _message;
  const keyName = event.key;
  var toName = document.getElementById("toName").value;
  var callFromName = document.getElementById("callFromName").value;
  message =  toName + "さんへ\n";
  _message = message;
  document.getElementById("toNameTarget").innerText = message;

}

/**
* チェックボックスのチェックに応じてメッセージを作成する。
* @param {Void}
* @return {Void}
*/
function subjectFromCheckBox(){
    var isPlsCallBackChecked = document.getElementById("plsCallBack").checked;
    var isCallBackAgainChecked = document.getElementById("callBackAgain").checked;
    //var isVisitedChecked = document.getElementById("visited").checked;
    var isPlsComeChecked = document.getElementById("plsCome").checked;
    var isVisitAgainChecked = document.getElementById("visitAgain").checked;
    var message = "";

    if(isPlsCallBackChecked===true){
      var callBackTelNum = document.getElementById("callBackTelNum").value;
      message = message + "下記電話番号に、折り返し連絡をいただきたいとのことです。\n"+"tel:" +callBackTelNum +"\n";
    }
    if(isCallBackAgainChecked===true){
        var selectDate_yyyymmdd = document.getElementById("selectdate-day").value;
        var selectDate_h = document.getElementById("selectedate-h").value;
        var selectDate_m = document.getElementById("selectedate-m").value;
        var displayDate = "";
        checkDate(selectDate_yyyymmdd);
        //[memo]:当月なら、月はわざわざ表示しない
        if(PARSED_MONTH != 0){
            if(PARSED_MONTH != MONTH){
                displayDate = PARSED_MONTH + "月";
            }
        }
        if(PARSED_DATE != 0){
            //[memo]:当日の
            if(PARSED_DATE != DATE || (PARSED_MONTH != MONTH && PARSED_DATE == DATE)){
                displayDate = displayDate + PARSED_DATE + "日";
            }
        }
        if((PARSED_MONTH == MONTH && PARSED_DATE == DATE)){
            displayDate = displayDate + "本日";
        }
        //[memo]:時間の処理
        if(selectDate_h != 0 || (selectDate_h == 0 && selectDate_m != 0)){
            displayDate = displayDate + selectDate_h + "時";
        }
        if(selectDate_m != 0){
            displayDate = displayDate + selectDate_m + "分";
        }
        //[memo]:メッセージ文章の作成
        if((PARSED_MONTH == 0 && PARSED_DATE == 0 && selectDate_h == 0 && selectDate_m == 0))
        {
            message =  message +  "もう一度電話をしますとのことです。\n";
        }else if((PARSED_MONTH == MONTH && PARSED_DATE == DATE)){
            if(selectDate_h != 0 && selectDate_m == 0){
                message = message + displayDate + "頃にもう一度電話をしますとのことです。\n";
            }else{
            message = message + displayDate + "にもう一度電話をしますとのことです。\n";
            }
        }else{
            if(selectDate_h != 0 && selectDate_m == 0){
                message = message + displayDate + "頃にもう一度電話をしますとのことです。\n";
            }else{
            message = message + displayDate + "にもう一度電話をしますとのことです。\n";
            }
        }

    }

    if(isPlsComeChecked===true){
      var place = document.getElementById("plsComeHere").value;
      message = message + place +"に来ていただきたいとのことです。\n";
    }
    if(isVisitAgainChecked===true){
      message = message + "もう一度訪問するとのことです。\n";
    }

    document.getElementById("checkBoxContent").innerText = message;

}

/**
* 入力された値が日付でYYYY-MM-DD形式になっているか調べる
* @param {String} strDate
* @return {Boolean} 指定の形式になっているか否か。
*/
function checkDate(strDate) {
    if(!strDate.match(/^\d{4}\-\d{2}\-\d{2}$/)){
        return "validation";
    }
    var year = strDate.split("-")[0];
    var month = Number(strDate.split("-")[1] );
    var day = strDate.split("-")[2];
    var date = new Date(year,month,day);
    if(date.getFullYear() != year || date.getMonth() != month || date.getDate() != day){
        //return false;
    }
    PARSED_MONTH = month;
    PARSED_DATE = day;
    return true;
}

/**
* 引数の文字列をクライアント端末のクリップボードにコピーさせる
* @param {String} コピーさせたいデータ
* @return {Boolean}
*/
function execCopy(string){

  // 空div 生成
  var tmp = document.createElement("div");
  // 選択用のタグ生成
  var pre = document.createElement('pre');

  // 親要素のCSSで user-select: none だとコピーできないので書き換える
  pre.style.webkitUserSelect = 'auto';
  pre.style.userSelect = 'auto';

  tmp.appendChild(pre).textContent = string;

  // 要素を画面外へ
  var s = tmp.style;
  s.position = 'fixed';
  s.right = '200%';

  // body に追加
  document.body.appendChild(tmp);
  // 要素を選択
  document.getSelection().selectAllChildren(tmp);

  // クリップボードにコピー
  //[todo]: execCommand は廃止予定なので、代替が必要
  var result = document.execCommand("copy");

  // 要素削除
  document.body.removeChild(tmp);
  return result;
}

/**
* かかってきた人の名前を作成する関数
* @param {Void}
* @return {Void}
*/
function callFromName(){
    let message = _message;
    const keyName = event.key;
    var toName = document.getElementById("callFromName").value;
    var callFromName = document.getElementById("callFromName").value;
    var calledDate = `${HOUR}時${MIN}分`;
    message =  callFromName + "様から"+ calledDate +"にお電話がありました。\n";
      _message = message;
    document.getElementById("callFromNameTarget").innerText = message;
}

/**
* 用件を作成する関数
* @param {Void}
* @return {Void}
*/
function callReason(){
    var message = "用件は下記のとおりです。\n";
    var reason = document.getElementById("callReason").value;
    message = message + reason;
    document.getElementById("callReasonMessage").innerText = message;
}
//[memo]:名前の入力の処理
document.getElementById("callFromName").oninput = ()=>callFromName();
document.getElementById("toName").oninput = ()=>toName();
//[memo]:リアルタイム入力結果反映処理
document.getElementById("callBackTelNum").oninput = ()=>subjectFromCheckBox();
document.getElementById("plsComeHere").oninput = ()=>subjectFromCheckBox();
document.getElementById("callReason").oninput = ()=>callReason();

document.getElementById("copyButton").onclick = ()=>copyToClipboard();


//[memo]:チェックボックスの処理
var checkboxContent = document.getElementsByName("subject");
for (var n of checkboxContent){
    n.addEventListener('change', ()=> subjectFromCheckBox());
    n.addEventListener('click', ()=> subjectFromCheckBox());
}
