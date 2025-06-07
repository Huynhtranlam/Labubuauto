const chrome = require("selenium-webdriver/chrome");
const { Builder, until, By } = require("selenium-webdriver");
require("chromedriver");

(async () => {
  const userDataDir = "D:/labubu/tmp-profile"; // thư mục không ai dùng
  const profileDir = "Profile 3"; // hoặc có thể là 'Default', 'Profile 1', 'Profile 2', v.v.

  const options = new chrome.Options()
    .addArguments(
      "--disable-blink-features=AutomationControlled",
      "--remote-debugging-port=9222",
      "--disable-gpu",
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--start-maximized",
      `--user-data-dir=D:/labubu/tmp-profile`,
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

  await driver.get("https://www.popmart.com/us/pop-now/set/40");
  await driver.sleep(10000); // 🕐 Chờ web load 5 giây

  for (let i = 0; i < 10000; i++) {
    console.log(`🔁 Vòng lặp lần ${i + 1}`);

    try {
      const shadowBox = await driver.findElement(
        By.css(
          "img.index_showBoxItem__5YQkR[alt='POP MART'][src*='box_pic_with_shadow']"
        )
      );

      if (shadowBox) {
        console.log("✅ Tìm thấy hộp có bóng đổ → Tiến hành mua");

        const buyBtn = await driver.findElement(
          By.xpath("//button[span[text()='Buy Multiple Boxes']]")
        );
        await buyBtn.click();
        await driver.sleep(1000);

        const selectAllSpan = await driver.findElement(
          By.xpath("//span[normalize-space(text())='Select all']")
        );
        await selectAllSpan.click();
        await driver.sleep(500);

        const addToBagBtn = await driver.findElement(
          By.xpath("//button[normalize-space(text())='ADD TO BAG']")
        );
        await addToBagBtn.click();
        console.log("🛒 Đã thêm vào giỏ hàng");
      }
    } catch (err) {
      // Không tìm thấy shadowBox hoặc lỗi → xử lý refresh
      const nextBtn = await driver.findElement(
            By.css("img.index_nextImg__PTfZF")
          );
          await nextBtn.click();
    }

    await driver.sleep(2000); // Delay nhỏ giữa các vòng nếu cần
  }

  console.log("🏁 Kết thúc 100 vòng lặp");

  await driver.sleep(1000000000);
  //   await driver.quit();
})();
