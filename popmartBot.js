const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// Thiết lập các tùy chọn Chrome
const options = new chrome.Options();
options.addArguments('--disable-blink-features=AutomationControlled');
options.addArguments('user-agent=Your Custom User-Agent String');

// Hàm chính để mua sản phẩm
async function buyProduct() {
    // Khởi tạo driver cho trình duyệt Chrome
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        // Mở trang Pop Mart
        await driver.get('https://www.popmart.com/vn/user/login?redirect=%2Faccount');

        // Chờ và nhấn nút "ACCEPT"
        let acceptButton = await driver.wait(
            until.elementLocated(By.xpath("//div[text()='ACCEPT']")),
       
        );
        await acceptButton.click();

        // Chờ và nhập email
        let emailInput = await driver.wait(
            until.elementLocated(By.id('email')),
       
        );
        await emailInput.sendKeys('huynhtranlam2009@gmail.com');

        // Chờ và nhấn nút "Continue"
        let continueButton = await driver.wait(
            until.elementLocated(By.css('.ant-btn-primary')),
          
        );
        await continueButton.click();

        // Chờ và nhập mật khẩu
        let passwordInput = await driver.wait(
            until.elementLocated(By.id('password')),
    
        );
        await passwordInput.sendKeys('IloveUbaby012345');

        // Chờ và nhấn nút "Sign In"
        let signInButton = await driver.wait(
            until.elementLocated(By.css('.ant-btn-primary')),
        
        );
        await signInButton.click();
        await driver.sleep(3000);
        await driver.get('https://www.popmart.com/vn/products/1468/Lil-Peach-Riot%EF%BC%9ALoading!-Series-Keychain');
        const buyNowButton = await driver.wait(
            until.elementLocated(By.css('.index_euBtn__7NmZ6.index_red__kx6Ql'))
        );
        await buyNowButton.click();
        await driver.sleep(5000);
        const proceedToPayButton = await driver.wait(
            until.elementLocated(By.css('.ant-btn.ant-btn-primary.ant-btn-dangerous.index_placeOrderBtn__E2dbt')),
            5000
        );
        // await proceedToPayButton.click();
        await driver.sleep(50000);

    } catch (error) {
        console.error('Đã xảy ra lỗi:', error);
    } finally {
        // Đóng trình duyệt sau khi hoàn tất
        await driver.quit();
    }
}

// Gọi hàm
buyProduct();
