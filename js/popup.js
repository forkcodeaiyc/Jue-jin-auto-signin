chrome.storage.sync.get("jj-ore-number", function (data) {
  document.querySelector(".ks-wrapper .ore-num").innerText = `累计获得 ${data["jj-ore-number"]} 矿石`;
});
document.querySelector("#reset-btn").addEventListener("click", function () {
  chrome.storage.sync.set({ jj_to_day: "" }, value => {
    console.log("重置成功: ");
    console.log(value);
  });
});
