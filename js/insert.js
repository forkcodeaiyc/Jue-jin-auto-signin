// document.body.innerHTML = "";
console.log("注入成功");
(function () {
  const goSignin = function () {
    const oSignInBtn = document.querySelector(".signin.btn");
    oSignInBtn && oSignInBtn.click();
  };
  const getIsSigned = function () {
    const oSigned = document.querySelector(".signedin.btn");
    if (!oSigned) return false;
    var computedStyle = getComputedStyle(oSigned);
    return computedStyle.display !== "none" && computedStyle.visibility !== "hidden";
  };
  const getIsnotLogin = function () {
    return !!(document.querySelector(".auth-form") || document.querySelector(".login-button"));
  };

  const sendMessage = function (message) {
    chrome.runtime.sendMessage({ message }, function (response) {
      console.log("response", response);
    });
  };
  function init () {
    console.log("未登录:", getIsnotLogin());
    if (window.location.pathname !== "/user/center/signin") {
      window.location.href = "https://juejin.cn/user/center/signin?from=avatar_menu";
    }
    if (getIsnotLogin()) {
      sendMessage("未登录,请先登录");
    }
    goSignin();
    // 去抽奖 , 找到父元素 ,再查找 figure-text(矿石数量)
    // 打开弹窗可能有延迟, 需要写函数能重复延迟执行
    document.querySelectorAll(".btn-area");
  }

  init();
  // 判断今日是否已执行
  // 判断是否登录
  // 判断是否已签到
  // 进行签到
  // 判断是否已经抽奖
  // 进行免费抽奖
  // 记录今日已执行
  // 关闭 tab
  // 自动抽奖功能
})();

// 注入脚本(content-script)使用权限有限 大致只能使用以下权限: https://stackoverflow.com/questions/34912279/error-when-using-chrome-notifications-create-uncaught-typeerror-cannot-read-pr
// extension ( getURL , inIncognitoContext , lastError , onRequest , sendRequest )
// i18n
// runtime ( connect , getManifest , getURL , id , onConnect , onMessage , sendMessage )
// storage

chrome.storage.sync.get("value", json => {
  console.log(json);
});
chrome.storage.sync.set({ value: "xxxxx" }, function () {
  // 通知保存完成。
  console.log("设置已保存");
});
