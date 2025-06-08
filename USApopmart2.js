const chrome = require("selenium-webdriver/chrome");
const readline = require("readline");
const { Builder, until, By } = require("selenium-webdriver");
require("chromedriver");

// Hàm hỏi input và trả về Promise
function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

(async () => {
  const url = await askQuestion("Nhập URL cần truy cập: ");
  const mode = await askQuestion(
    "Chọn chế độ:\n1. Mở trình duyệt\n2. Mua hàng tự động\nNhập số: "
  );

  const options = new chrome.Options()
    .addArguments(
      "--disable-blink-features=AutomationControlled",
      "--remote-debugging-port=9220",
      "--disable-gpu",
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--start-maximized",
      `--user-data-dir=D:/labubu/tmp-profile3`,
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
    await driver.get(url); // 🟢 Đúng URL do người dùng nhập
    console.log("✅ Mở trình duyệt thành công. Đang giữ session...");
    await driver.sleep(1000000000); // giữ Chrome mở
    return;
  }

  await driver.get(url); // 🟢 Đúng URL do người dùng nhập
  const baseUrl = "https://www.popmart.com/us/pop-now/set/";
  const prefix = url.split("/set/")[1].split("-")[0]; // lấy '40'
  const productId = extractIdFromUrl(url);
  const threeDigits = Number(productId.slice(6, 9));

  console.log(threeDigits,"thang ccc")

  for (let i = 0; i < 10000; i++) {
    const productIdArray = productId.split("");

    console.log(productIdArray,"cccccccc");

    // Random 3 số mới và thay vào vị trí 6,7,8 (tức là số 7 8 9)
    const newThreeDigits = (
      Math.floor(Math.random() * (100)) +
      threeDigits
    ).toString()
      .padStart(3, "0");



    console.log(newThreeDigits,"newThreeDigits");
    productIdArray[6] = newThreeDigits[0];
    productIdArray[7] = newThreeDigits[1];
    productIdArray[8] = newThreeDigits[2];

    const newProductId = productIdArray.join("");
    const randomUrl = `${baseUrl}${prefix}-${newProductId}`;
    console.log(`🔗 Đang thử URL: ${randomUrl}`);

    await driver.get(randomUrl);
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

        const selectAllSpan = await driver.wait(
          until.elementLocated(
            By.xpath("//span[normalize-space(text())='Select all']")
          ),
          5000
        );
        await driver.wait(until.elementIsVisible(selectAllSpan), 5000);
        await selectAllSpan.click();

        const addToBagBtn = await driver.wait(
          until.elementLocated(
            By.xpath("//button[normalize-space(text())='ADD TO BAG']")
          ),
          5000
        );
        await driver.wait(until.elementIsVisible(addToBagBtn), 5000);
        await addToBagBtn.click();

        if (addToBagBtn.click) {
          await driver.executeScript(
            "window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');"
          );
        }

        break;
      }
    } catch (err) {
      try {
        const nextBtn = await driver.findElement(
          By.css("img.index_nextImg__PTfZF")
        );
        await nextBtn.click();
      } catch (e) {
        console.log("❌ Không tìm thấy nút next");
      }
    }

    await driver.sleep(2000);
  }

  console.log("🏁 Kết thúc 100 vòng lặp");

  await driver.sleep(1000000000);
  // await driver.quit();
})();

function extractIdFromUrl(url) {
  const match = url.match(/-(\d+)$/);
  return match ? match[1] : null;
}
