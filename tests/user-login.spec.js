const { test, expect } = require("@playwright/test");
const { HomePage } = require("../page/HomePage");
const { AuthPage } = require("../page/AuthPage");
const fs = require("fs");
const path = require("path");

// Read valid credentials from fixture file
function getCredentials() {
  const credsPath = path.resolve(__dirname, "../fixtures/registeredUser.json");
  if (!fs.existsSync(credsPath))
    throw new Error(
      "fixtures/registeredUser.json not found. Run registration test first."
    );
  return JSON.parse(fs.readFileSync(credsPath, "utf-8"));
}

// Wait for the PrestaShop iframe to be ready and return the frame
async function getReadyFrame(page, timeout = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const iframe = await page.$("iframe#framelive");
    if (iframe) {
      const frame = await page.frame({ name: "framelive" });
      if (frame) {
        try {
          if (
            (await frame
              .locator("section#main")
              .isVisible({ timeout: 1000 })) &&
            (await frame
              .locator('input[name="email"]')
              .isVisible({ timeout: 1000 }))
          ) {
            return frame;
          }
        } catch {}
      }
    }
    await page.waitForTimeout(400);
  }
  throw new Error("framelive iframe did not become ready in time");
}

// Navigate to home, open sign-in and return frame and AuthPage
async function setup(page) {
  const home = new HomePage(page);
  await home.goto();
  await getReadyFrame(page);
  await home.clickSignIn();
  const frame = await getReadyFrame(page);
  return { frame, auth: new AuthPage(frame) };
}

// Assert that a login error alert is visible
async function expectLoginError(frame) {
  const errorAlert = frame.locator(
    '.alert-danger, .alert-error, .alert[role="alert"]'
  );
  await expect(errorAlert).toBeVisible({ timeout: 15000 });
}

// User login scenarios
test.describe("User login scenarios", () => {
  test("Test case 1 success: Valid email and password", async ({ page }) => {
    const { email, password } = getCredentials();
    const { auth, frame } = await setup(page);
    await auth.login(email, password);
    await expect(auth.signOutLink.first()).toBeVisible();
    await expect(
      frame.locator('.alert-danger, .alert-error, .alert[role="alert"]')
    ).toBeHidden();
    await auth.signOutLink.first().click();
  });

  test("Test case 2 Failure: Invalid email and invalid password", async ({
    page,
  }) => {
    const { auth, frame } = await setup(page);
    await auth.login("invalid@email.com", "wrongpassword");
    await expectLoginError(frame);
  });

  test("Test case 3 Failure: Invalid email and valid password", async ({
    page,
  }) => {
    const { password } = getCredentials();
    const { auth, frame } = await setup(page);
    await auth.login("invalid@email.com", password);
    await expectLoginError(frame);
  });

  test("Test case 4 Failure: Valid email and invalid password", async ({
    page,
  }) => {
    const { email } = getCredentials();
    const { auth, frame } = await setup(page);
    await auth.login(email, "wrongpassword");
    await expectLoginError(frame);
  });

  test("Test case 5 Failure: Empty email and password", async ({ page }) => {
    const { auth } = await setup(page);
    await auth.emailInput.fill("");
    await auth.passwordInput.fill("");
    await auth.signInButton.click();
    const validationMsg = await auth.emailInput.evaluate(
      (el) => el.validationMessage
    );
    expect(validationMsg && validationMsg.length > 0).toBeTruthy();
  });
});
