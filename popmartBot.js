const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

// Thiết lập các tùy chọn Chrome
const options = new chrome.Options();
options.addArguments("--disable-blink-features=AutomationControlled");
options.addArguments("user-agent=Your Custom User-Agent String");
options.addArguments('--ignore-certificate-errors');
options.addArguments('--disable-features=IsolateOrigins,site-per-process');
// Hàm chính để mua sản phẩm
async function buyProduct() {
  // Khởi tạo driver cho trình duyệt Chrome
  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  try {
    // Mở trang Pop Mart
    await driver.get(
      "https://www.popmart.com/vn/user/login?redirect=%2Faccount"
    );

    // Chờ và nhấn nút "ACCEPT"
    let acceptButton = await driver.wait(
      until.elementLocated(By.xpath("//div[text()='ACCEPT']"))
    );
    await acceptButton.click();

    // Chờ và nhập email
    let emailInput = await driver.wait(until.elementLocated(By.id("email")));
    await emailInput.sendKeys("huynhtranlam2009@gmail.com");

    // Chờ và nhấn nút "Continue"
    let continueButton = await driver.wait(
      until.elementLocated(By.css(".ant-btn-primary"))
    );
    await continueButton.click();

    // Chờ và nhập mật khẩu
    let passwordInput = await driver.wait(
      until.elementLocated(By.id("password"))
    );
    await passwordInput.sendKeys("IloveUbaby012345");

    // Chờ và nhấn nút "Sign In"
    let signInButton = await driver.wait(
      until.elementLocated(By.css(".ant-btn-primary"))
    );

    await signInButton.click();
    await driver.sleep(3000);
    await driver.get(
      "https://www.popmart.com/vn/products/1952/DIMOO-Earth-Day-Figure"
    );
       let buyNowButton = null;
            let attempts = 0;
        const maxAttempts = 100;

    while (!buyNowButton && attempts < maxAttempts) {
      try {
        buyNowButton = await driver.wait(
          until.elementLocated(By.css(".index_euBtn__7NmZ6.index_red__kx6Ql")),
          2000
        );
        console.log("Đã thấy nút Buy Now!");
      } catch (e) {
        console.log(`Chưa thấy nút Buy Now. Reload... (Lần ${attempts + 1})`);
        await driver.navigate().refresh();
        await driver.sleep(500);
        attempts++;
      }
    }

    if (!buyNowButton) {
      console.log("Không tìm thấy nút Buy Now sau nhiều lần thử.");
      return;
    }
    await buyNowButton.click();
    console.log("Cc");
    // await proceedToPayButton.click();
    await driver.sleep(500000);
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
  } finally {
    // Đóng trình duyệt sau khi hoàn tất
    // await driver.quit();
  }
}

// Gọi hàm
buyProduct();
