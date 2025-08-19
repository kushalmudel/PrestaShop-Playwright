const { test, expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");
const { HomePage } = require("../page/HomePage");
const { AuthPage } = require("../page/AuthPage");
const { RegisterPage } = require("../page/RegisterPage");
const { generateUser } = require("../utils/testData");

test("New account creation flow", async ({ page }) => {
  const home = new HomePage(page);
  await home.goto();

  await expect(page.locator("iframe#framelive")).toBeVisible({
    timeout: 15000,
  });
  await home.clickSignIn();
  const frame = await home.getFrame();

  // Assert sign-in form is visible
  await expect(frame.locator("section#main")).toBeVisible({ timeout: 15000 });
  await expect(frame.locator('input[name="email"]')).toBeVisible({
    timeout: 15000,
  });

  // Start account creation
  const auth = new AuthPage(frame);
  await auth.clickCreateAccount();
  // Assert create account form is visible
  await expect(frame.locator('input[name="firstname"]')).toBeVisible({
    timeout: 15000,
  });

  // Fill registration form with generated user
  const user = generateUser();
  const register = new RegisterPage(frame);
  await register.register(user);

  // Assert registration/login success
  await expect(auth.signOutLink.first()).toBeVisible({ timeout: 15000 });

  // Save credentials for login test and assert file written
  const credsPath = path.resolve(__dirname, "../fixtures/registeredUser.json");
  fs.writeFileSync(
    credsPath,
    JSON.stringify({ email: user.email, password: user.password })
  );
  expect(fs.existsSync(credsPath)).toBeTruthy();

  // Sign out after registration and assert sign-in form reappears
  await auth.signOutLink.first().click();
  await expect(frame.locator('input[name="email"]')).toBeVisible({
    timeout: 15000,
  });
});
