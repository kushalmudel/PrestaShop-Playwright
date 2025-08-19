const { test, expect } = require("@playwright/test");
const { HomePage } = require("../page/HomePage");
const { AuthPage } = require("../page/AuthPage");
const { RegisterPage } = require("../page/RegisterPage");
const { generateUser } = require("../utils/testData");

test("E2E Product Purchase flow", async ({ page }) => {
  const home = new HomePage(page);
  await home.goto();
  await home.clickSignIn();
  const frame = await home.getFrame();

  // Assert sign-in form is visible
  await expect(frame.locator("section#main")).toBeVisible({ timeout: 15000 });
  await expect(frame.locator('input[name="email"]')).toBeVisible({
    timeout: 15000,
  });

  // Register a new user
  const auth = new AuthPage(frame);
  await auth.clickCreateAccount();
  await expect(frame.locator('input[name="firstname"]')).toBeVisible({
    timeout: 15000,
  });
  const user = generateUser();
  const register = new RegisterPage(frame);
  await register.register(user);

  // Assert registration/login success
  await expect(auth.signOutLink.first()).toBeVisible({ timeout: 15000 });

  // Hover on a random product
  const allProducts = frame.locator(".product-miniature");
  const productCount = await allProducts.count();
  expect(productCount).toBeGreaterThan(0);
  const idx = Math.floor(Math.random() * productCount);
  const productMiniature = allProducts.nth(idx);
  await productMiniature.scrollIntoViewIfNeeded();
  await productMiniature.hover();

  // Assert product is visible
  await expect(productMiniature).toBeVisible();

  // Extract product name for assertion
  const productName = (
    await productMiniature
      .locator(".product-title a, .product-title")
      .first()
      .textContent()
  ).trim();

  // Open quick view modal
  const quickViewBtn = productMiniature.locator("a.quick-view");
  await expect(quickViewBtn).toBeVisible({ timeout: 5000 });
  await quickViewBtn.click();

  // Assert quick view modal is visible
  let quickViewModal = frame.locator(
    '.modal .product-quickview, [id^="quickview-modal-"]'
  );
  await expect(quickViewModal).toBeVisible({ timeout: 10000 });

  // Assert product name in quick view modal
  const modalHeading = quickViewModal.getByRole("heading");
  await expect(modalHeading).toBeVisible({ timeout: 5000 });
  const headingText = (await modalHeading.textContent()).trim();
  expect(headingText.toLowerCase()).toContain(
    productName.toLowerCase().slice(0, 8)
  );
  const addToCartBtn = quickViewModal.getByRole("button", {
    name: /Add to cart/i,
  });
  await addToCartBtn.click();

  // Proceed through checkout steps using ProductPage POM
  const { ProductPage } = require("../page/ProductPage");
  const productPage = new ProductPage(frame);

  // Assert cart modal checkout button is visible
  let cartModalCheckoutBtn = productPage.cartModalCheckoutButton;
  if (
    !(await cartModalCheckoutBtn
      .isVisible({ timeout: 5000 })
      .catch(() => false))
  ) {
    cartModalCheckoutBtn = frame.getByRole("link", {
      name: /Proceed to checkout/i,
    });
  }
  await expect(cartModalCheckoutBtn).toBeVisible({ timeout: 10000 });
  await productPage.clickCartModalCheckout();

  // Assert summary checkout button is visible
  await expect(productPage.summaryCheckoutButton).toBeVisible({
    timeout: 10000,
  });
  await productPage.clickSummaryCheckout();

  // Fill address form with test data
  const addressData = {
    address1: "123 Main St",
    city: "Testville",
    postcode: "12345",
    country: "United States",
  };

  await productPage.fillAddressForm(addressData);

  // Assert address field is filled
  await expect(productPage.addressFields.address1).toHaveValue(
    addressData.address1
  );

  await productPage.clickAddressContinue();

  await expect(productPage.deliveryContinueButton).toBeVisible({
    timeout: 10000,
  });

  await productPage.clickDeliveryContinue();

  await productPage.checkTermsAndConditions();

  // Assert Place Order button is visible and enabled
  await expect(productPage.placeOrderButton).toBeVisible({ timeout: 10000 });
  await expect(productPage.placeOrderButton).toBeEnabled({ timeout: 10000 });

  await productPage.clickPlaceOrder();

  await expect(productPage.orderConfirmation).toBeVisible({ timeout: 15000 });
});
