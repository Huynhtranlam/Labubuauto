const chrome = require("selenium-webdriver/chrome");
const { Builder, until, By } = require("selenium-webdriver");
require("chromedriver");

(async () => {
  const userDataDir = "D:/labubu/tmp-profile"; // thư mục không ai dùng
  const profileDir = "Profile 3"; // hoặc có thể là 'Default', 'Profile 1', 'Profile 2', v.v.

  const options = new chrome.Options()
    .addArguments(
      "--disable-blink-features=AutomationControlled",
      "--remote-debugging-port=9223",
      "--disable-gpu",
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--start-maximized",
      `--user-data-dir=D:/labubu/tmp-profile1`,
      `--profile-directory=Default`,
      "--enable-unsafe-webgpu",
      "--enable-unsafe-swiftshader"
    )
    .excludeSwitches("enable-automation");
  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  const isWebDriver = await driver.executeScript("return navigator.webdriver");
  console.log("navigator.webdriver:", isWebDriver);

  await driver.get(
    "https://www.lazada.vn/products/pop-mart-the-monsters-vinyl-plush-figures-combination-blind-box-i3081479147-s14794894481.html?trafficFrom=17449020_303586&laz_trackid=2:mm_251641332_208803005_2167103005:clkgisk9m1it36o0keco2a&mkttid=clkgisk9m1it36o0keco2a"
  );
  console.log("Đã mở trang kiểm tra UA!");

  let buyNowButton = null;
  let attempts = 0;
  const maxAttempts = 10000;
  const timeoutEachMs = 3000; // tối đa 20 s mỗi lần
  const pollInterval = 500;

  while (attempts < maxAttempts) {
    const deadline = Date.now() + timeoutEachMs;
    let buyNowBtn;

    // ===== Poll tối đa 20 s =====
    while (!buyNowBtn && Date.now() < deadline) {
      const btns = await driver.findElements(
        By.xpath('//span[text()="Buy Now"]')
      );
      if (btns.length) buyNowBtn = btns[0];
      else await driver.sleep(pollInterval); // chờ rồi hỏi lại
    }

    /* ---- Nếu tìm được nút ---- */
    if (buyNowBtn) {
      await driver.executeScript("arguments[0].click();", buyNowBtn);
      console.log(`💰 Clicked 'Buy Now' on attempt ${attempts + 1}`);

      // đợi & bấm “PROCEED TO PAYMENT”
      const proceedBtn = await driver.wait(
        until.elementLocated(
          By.xpath("//div[normalize-space()='PROCEED TO PAYMENT']")
        ),
        10_000
      );
      await driver.wait(until.elementIsVisible(proceedBtn), 5_000);
      await proceedBtn.click();
      break; // THÀNH CÔNG → thoát vòng while
    }

    /* ---- Không thấy nút trong 20 s ---- */
    attempts++;
    console.log(`🔁 Attempt ${attempts}: chưa thấy nút, refresh...`);
    await driver.sleep(1000); // cho trang “nguội” bớt
    await driver.navigate().refresh();
  }

  if (attempts === maxAttempts) {
    console.error("❌ Đã thử 100 lần vẫn không thấy nút 'Buy Now'.");
  }

  await driver.sleep(1000000000);
  await driver.quit();
})();
