document.querySelector(".ks-wrapper .count").innerText = `自动抽奖xx次, 免费抽奖xx次`;
chrome.storage.sync.get("jj-ore-number", function (data) {
  document.querySelector(".ks-wrapper .ore-num").innerText = `累计获得 ${data["jj-ore-number"]} 矿石`;
});
