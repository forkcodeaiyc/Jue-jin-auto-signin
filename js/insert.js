// document.body.innerHTML = "";
console.red = function (msg) {
  console.log("%c" + JSON.stringify(msg), "font-size:36px;color:red;");
};
console.red("注入成功");
// todo 添加一个文字选择器, 根据文字查找dom (css选择器, 文字过滤)
// todo 全部改为 await, 按步骤顺序向下执行函数(执行完成 resolve(true))
console.red("readyState: " + document.readyState);
(async function () {
  let signinSuccess = false;
  let lotterySuccess = false;
  // fun return true 继续执行, 后续可改造为生成器
  const loopFunction = function (fun, finished, time = 1500, count = 6) {
    return new Promise((resolve, reject) => {
      let currentCount = 0;
      const loop = () => {
        setTimeout(function () {
          if (currentCount < count && fun()) {
            currentCount++;
            loop();
          } else {
            finished && finished();
            resolve();
          }
        }, time);
      };
      loop();
    });
  };
  const getStorage = key => {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(key, value => {
        resolve(value[key]);
      });
    });
  };
  function isSameDay (timeStampA, timeStampB) {
    let dateA = new Date(timeStampA);
    let dateB = new Date(timeStampB);
    return dateA.setHours(0, 0, 0, 0) == dateB.setHours(0, 0, 0, 0);
  }
  const goSignin = function () {
    const oSignInBtn = document.querySelector(".signin.btn"); //|| document.querySelector(".signedin.btn");
    if (oSignInBtn) {
      oSignInBtn && oSignInBtn.click();
      return false;
    } else {
      return true;
    }
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
      console.red(response);
    });
  };
  const getOre = () => {
    let oText = document.querySelector(".figure-text");
    return parseInt(oText ? oText.innerText : null);
  };
  const goLottery = () => {
    let btn = document.querySelector(".btn-area .btn");
    btn && btn.click();
  };
  const lottery = () => {
    var btn = document.querySelector(".lottery");
    console.red("开始免费抽奖: " + (btn && btn.innerHTML.indexOf("免费") > -1));
    if (btn && btn.innerHTML.indexOf("免费") > -1) {
      btn.querySelector(".lottery-text").click();
      lotterySuccess = true;
      return false;
    } else {
      lotterySuccess = true;
    }
    return true;
  };
  // api 方案
  async function planApi () {
    const checkIn = await fetch("https://api.juejin.cn/growth_api/v1/check_in", {
      headers: {
        cookie: document.cookie,
      },
      method: "POST",
      credentials: "include",
    }).then(res => res.json());

    if (check_in.err_no !== 0) {
      console.red(checkIn);
    } else {
      console.red(`api 签到成功 ${check_in.data.sum_point}`);
    }
    // 免费抽奖
    const draw = await fetch("https://api.juejin.cn/growth_api/v1/lottery/draw", {
      headers: {
        cookie: document.cookie,
      },
      method: "POST",
      credentials: "include",
    }).then(res => res.json());

    if (draw.err_no !== 0) {
      console.red("api 免费抽奖失败！");
    } else {
      console.red(`恭喜抽到: ${draw.data.lottery_name}`);
    }
  }
  async function init () {
    console.red(getIsnotLogin() ? "未登录" : "已登录");
    let time = await getStorage("jj_to_day");
    // todo 继续添加账号id + 日期 共同判断完成情况
    if (isSameDay(time, Date.now())) {
      console.red("今日已完成签到、免费抽奖");
      return;
    }
    if (getIsnotLogin()) {
      sendMessage("未登录,请先登录");
      return;
    }
    //sendMessage("打开tab");
    if (!["/user/center/signin", "/user/center/lottery"].includes(window.location.pathname)) {
      window.location.href = "https://juejin.cn/user/center/signin?from=avatar_menu";
    }
    await loopFunction(goSignin);
    await loopFunction(() => {
      let num = getOre();
      if (num) {
        sendMessage("签到成功, 获得矿石:" + num);
        chrome.storage.sync.get("jj-ore-number", value => {
          chrome.storage.sync.set({ "jj-ore-number": num + value["jj-ore-number"] });
          console.red("累计获得矿石: " + (num + value["jj-ore-number"]));
        });
        signinSuccess = true;
        return false;
      }
      var signedin = document.querySelector(".signedin.btn");
      if (signedin) {
        signinSuccess = true;
        return false;
      }
      return true;
    });
    goLottery();
    // 改为监听页面url 是目标页面再执行
    await loopFunction(
      () => {
        return lottery();
      },
      () => {},
      1000
    );
    await loopFunction(
      () => {
        // 查询抽奖结果
        let result = document.querySelector(".lottery_modal .title");
        if (result) {
          sendMessage(result.innerText);
          // 避免后续目标改动造成程序异常, 不管是否签到抽奖成功程序只执行一次
          // if(signinSuccess && lotterySuccess){

          // }
          sendMessage("关闭tab");
          return false;
        }
        return true;
      },
      () => {
        chrome.storage.sync.set({ jj_to_day: Date.now() }, function () {});
      }
    );
    // 双重加固 😎
    planApi();
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
  // 自动登录
  // api 操作
})();

// 注入脚本(content-script)使用权限有限 大致只能使用以下权限: https://stackoverflow.com/questions/34912279/error-when-using-chrome-notifications-create-uncaught-typeerror-cannot-read-pr
// extension ( getURL , inIncognitoContext , lastError , onRequest , sendRequest )
// i18n
// runtime ( connect , getManifest , getURL , id , onConnect , onMessage , sendMessage )
// storage

// chrome.storage.sync.get("value", json => {
//   console.log(json);
// });
// chrome.storage.sync.set({ value: "xxxxx" }, function () {
//   // 通知保存完成。
//   console.log("设置已保存");
// });
