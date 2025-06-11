const chrome = require("selenium-webdriver/chrome");
const { Builder, By, until } = require("selenium-webdriver");
require("chromedriver");

 async function runBot(url, mode,port,profile) {
  const options = new chrome.Options()
    .addArguments(
      "--disable-blink-features=AutomationControlled",
     `--remote-debugging-port=${port}`,
      "--disable-gpu",
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--start-maximized",
       `--user-data-dir=D:/labubu/tmp-profile${profile}`,
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

  if (mode === "1") {
    await driver.get(url);
    await driver.sleep(1000000000); // giữ trình duyệt mở
    return;
  }

  // === MUA HÀNG TỰ ĐỘNG ===
  await driver.get(url);

  const baseUrl = "https://www.popmart.com/us/pop-now/set/";
  const prefix = url.split("/set/")[1].split("-")[0];
  const productId = extractIdFromUrl(url);
  const threeDigits = Number(productId.slice(6, 9));

  for (let i = 0; i < 10000; i++) {
    const productIdArray = productId.split("");
    const newThreeDigits = (Math.floor(Math.random() * 300) + threeDigits)
      .toString()
      .padStart(3, "0");

    productIdArray[6] = newThreeDigits[0];
    productIdArray[7] = newThreeDigits[1];
    productIdArray[8] = newThreeDigits[2];

    const newProductId = productIdArray.join("");
    const randomUrl = `${baseUrl}${prefix}-${newProductId}`;
    console.log(`🔄 Vòng lặp ${i + 1}: Truy cập ${randomUrl}`);

    try {
      await driver.sleep(2000);
      const shadowBox = await driver.findElement(
        By.css("img.index_showBoxItem__5YQkR[alt='POP MART'][src*='box_pic_with_shadow']")
      );

      if (shadowBox) {
        console.log("✅ Tìm thấy hộp có bóng đổ → Tiến hành mua");
        await driver.sleep(2000);

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
        const addToBagBtn = await driver.wait(
          until.elementLocated(
            By.xpath("//button[normalize-space(text())='ADD TO BAG']")
          ),
          5000
        );
        await driver.wait(until.elementIsVisible(addToBagBtn), 5000);
        await addToBagBtn.click();

        await driver.sleep(2000);
        await driver.executeScript(
          'window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");'
        );
        const tabs = await driver.getAllWindowHandles();
        await driver.switchTo().window(tabs[0]);

        console.log("🛒 Thêm thành công sẽ ngủ 20s rồi chạy tiếp nè");
        await driver.sleep(5000);
      }
    } catch (err) {
      await driver.get(randomUrl);
    }
  }

  console.log("🏁 Kết thúc 10000 vòng lặp");
  await driver.sleep(1000000000); // Giữ trình duyệt mở
}

exports.runBot = runBot;

function extractIdFromUrl(url) {
  const match = url.match(/-(\d+)$/);
  return match ? match[1] : null;
}
