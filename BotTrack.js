const chrome = require("selenium-webdriver/chrome");
const readline = require("readline");
const { Builder, until, By } = require("selenium-webdriver");
const runBot = require("./runBot");
const minimist = require("minimist");
const { spawn } = require("child_process");
const args = minimist(process.argv.slice(2));
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

if (args.url && args.mode && args.port && args.profile) {
  runBot(args.url, args.mode, args.port, args.profile);
  console.log(
    `Đang chạy bot với URL: ${args.url}, chế độ: ${args.mode}, port: ${args.port}, profile: ${args.profile}`
  );
  return;
}
(async () => {
  const url = await askQuestion("Nhập URL cần truy cập: ");
  const mode = await askQuestion(
    "Chọn chế độ:\n1. Mở trình duyệt\n2. Mua hàng tự động\nNhập số: "
  );

  const options = new chrome.Options()
    .addArguments(
      "--disable-blink-features=AutomationControlled",
      "--remote-debugging-port=9222",
      "--disable-gpu",
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--start-maximized",
      `--user-data-dir=D:/labubu/tmp-profile0`,
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
    await driver.sleep(1000000000); // giữ Chrome mở
    return;
  }
  await driver.get(url); // 🟢 Đúng URL do người dùng nhập
  const baseUrl = "https://www.popmart.com/us/pop-now/set/";
  const prefix = url.split("/set/")[1].split("-")[0]; // lấy '40'
  const productId = extractIdFromUrl(url);
  const threeDigits = Number(productId.slice(6, 9));

  for (let i = 0; i < 10000; i++) {
    const productIdArray = productId.split("");
    const now = new Date();

    // Random 3 số mới và thay vào vị trí 6,7,8 (tức là số 7 8 9)
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

      const notifyButton = await driver.findElement(
        By.css("button.ant-btn.ant-btn-primary.index_subscribe__HL9BU")
      );
      if (notifyButton) {
        await driver.get(randomUrl);
        console.log(`🔔 Đã nhấn nút thông báo lúc: ${now.toLocaleString()}`);
        await driver.sleep(20000);
      }
    } catch (err) {
      console.log("🔔 Không tìm thấy nút thông báo, tiếp tục kiểm tra hộp...");
      await driver.sleep(2000);
      const shadowBox = await driver.findElement(
        By.css(
          "img.index_showBoxItem__5YQkR[alt='POP MART'][src*='box_pic_with_shadow']"
        )
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
          'window.open("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", "_blank");'
        );
        let tabs = await driver.getAllWindowHandles();
        await driver.switchTo().window(tabs[0]); // Quay lại tab cũ (nếu cần)

        console.log("🛒 Thêm thành công sẽ ngủ 20s rồi chạy tiếp nè");
        await driver.sleep(5000);
        spawn(
          "cmd",
          [
            "/k",
            "node",
            "main.js",
            "--url",
            url,
            "--mode",
            "2",
            "--port",
            "9222",
            "--profile",
            "0",
          ],
          {
            detached: true,
            stdio: "ignore",
          }
        );
        break;
      } else {
        console.log(`Lỗi: ${err.message}`);
        console.log("🔄 Reload trang và thử lại...", now.toLocaleString());
        await driver.sleep(10000);
        await driver.get(randomUrl);
      }
    }
  }

  console.log("🏁 Kết thúc 100 vòng lặp");

  await driver.sleep(1000000000);
})();

function extractIdFromUrl(url) {
  const match = url.match(/-(\d+)$/);
  return match ? match[1] : null;
}
