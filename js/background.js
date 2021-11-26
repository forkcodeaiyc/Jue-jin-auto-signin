chrome.browserAction.setBadgeBackgroundColor({
  color: [190, 190, 190, 230],
});

chrome.runtime.onInstalled.addListener(function () {
  console.log("安装完成");
});

chrome.runtime.onStartup.addListener(function () {
  console.log("启动了");
});
// 后台打开 tab
chrome.tabs.create({ url: "https://juejin.cn/user/center/signin", active: false }, tab => {
  // chrome.tabs.remove(tab.id);
});
// 查询 tab id
// chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//   chrome.tabs.sendMessage(tabs[0].id, { greeting: "hello" }, function (response) {
//     console.log(response.farewell);
//   });
// });

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // request 接收到的信息
  // sender 接收源信息, 一般是tab信息。sender.tab.url sender.tab.title...
  console.log(request.message);
  const opt = {
    type: "basic",
    iconUrl: "../img/message.png",
    title: "掘金自动签到",
    message: request.message,
    priority: 2, // 优先级，从 -2 到 2，-2 优先级最低，2 最高，默认为零。
    eventTime: Date.now(),
  };
  chrome.notifications.create("login", opt, e => {
    console.log(e);
  });
  //   sendResponse({xxx}); 返回消息给请求者
});
