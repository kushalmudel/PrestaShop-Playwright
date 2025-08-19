class ProductPage {
  // Utility: Wait for a locator to be enabled
  async waitForEnabled(locator, timeout = 10000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      if (await locator.isEnabled().catch(() => false)) return;
      await new Promise((r) => setTimeout(r, 200));
    }
    throw new Error("Element not enabled after " + timeout + "ms");
  }
  constructor(frame) {
    this.frame = frame;
  }

  get allProducts() {
    return this.frame.locator(".product-miniature");
  }
  quickViewButton(product) {
    return product.locator("a.quick-view");
  }
  get quickViewName() {
    return this.frame.locator(".modal .product-quickview .h1");
  }
  get quickViewPrice() {
    return this.frame.locator(".modal .product-quickview .current-price");
  }
  get quickViewAddToCart() {
    return this.frame.locator(".modal .add-to-cart");
  }
  get addToCartSuccess() {
    return this.frame.locator(
      ".cart-content .cart-products .product-line-info, .cart-content .cart-title"
    );
  }

  get cartModalCheckoutButton() {
    // Prefer robust selector, fallback to role-based
    return this.frame.locator('a.btn-primary[href*="order"]');
  }
  async clickCartModalCheckout() {
    let btn = this.cartModalCheckoutButton;
    if (!(await btn.isVisible({ timeout: 5000 }).catch(() => false))) {
      btn = this.frame.getByRole("link", { name: /Proceed to checkout/i });
    }
    await btn.waitFor({ state: "visible", timeout: 10000 });
    await this.waitForEnabled(btn, 10000);
    await btn.click();
  }

  get summaryCheckoutButton() {
    // Prefer robust selector, fallback to role-based
    return this.frame.locator(".text-sm-center a.btn.btn-primary", {
      hasText: /Proceed to checkout/i,
    });
  }
  async clickSummaryCheckout() {
    // Wait for summary/cart step to load
    await this.frame
      .locator(".cart-summary, .checkout-step, .cart-items")
      .first()
      .waitFor({ state: "visible", timeout: 10000 });
    let btn = this.summaryCheckoutButton;
    if (!(await btn.isVisible({ timeout: 5000 }).catch(() => false))) {
      btn = this.frame.getByRole("link", { name: /Proceed to checkout/i });
    }
    await btn.waitFor({ state: "visible", timeout: 10000 });
    await this.waitForEnabled(btn, 10000);
    await btn.click();
  }

  get addressFields() {
    return {
      address1: this.frame.locator('input[name="address1"]'),
      city: this.frame.locator('input[name="city"]'),
      postcode: this.frame.locator('input[name="postcode"]'),
      country: this.frame.locator('select[name="id_country"]'),
    };
  }

  async fillAddressForm(address) {
    const { address1, city, postcode, country, state } = address;
    const fields = this.addressFields;
    await fields.address1.waitFor({ state: "visible", timeout: 10000 });
    await fields.address1.fill(address1);
    await fields.city.fill(city);
    await fields.postcode.fill(postcode);
    await fields.country.selectOption({ label: country });

    // Robustly handle state dropdown
    const stateDropdown = this.frame.locator('select[name="id_state"]');
    if (await stateDropdown.isVisible().catch(() => false)) {
      let stateValue = state;
      if (!stateValue) {
        const options = await stateDropdown
          .locator('option:not([value=""])')
          .all();
        if (options.length > 0) {
          // Prefer first enabled option
          for (const opt of options) {
            if (await opt.isEnabled()) {
              stateValue = await opt.getAttribute("value");
              break;
            }
          }
          // fallback: pick random if none enabled
          if (!stateValue) {
            const idx = Math.floor(Math.random() * options.length);
            stateValue = await options[idx].getAttribute("value");
          }
        }
      }
      if (stateValue) {
        await stateDropdown.selectOption(stateValue);
      }
    }
  }
  get addressContinueButton() {
    return this.frame.locator('button[name="confirm-addresses"]');
  }
  async clickAddressContinue() {
    const btn = this.addressContinueButton;
    await btn.waitFor({ state: "visible", timeout: 10000 });
    await this.waitForEnabled(btn, 10000);
    await btn.click();
  }

  get deliveryContinueButton() {
    return this.frame.locator('button[name="confirmDeliveryOption"]');
  }
  async clickDeliveryContinue() {
    const btn = this.deliveryContinueButton;
    await btn.waitFor({ state: "visible", timeout: 10000 });
    await this.waitForEnabled(btn, 10000);
    await btn.click();
  }

  get termsCheckbox() {
    return this.frame.locator(
      'input[name="conditions_to_approve[terms-and-conditions]"]'
    );
  }
  async checkTermsAndConditions() {
    const checkbox = this.termsCheckbox;
    await checkbox.waitFor({ state: "visible", timeout: 10000 });
    if (!(await checkbox.isChecked())) {
      await checkbox.check();
    }
  }
  get placeOrderButton() {
    return this.frame.locator('button:has-text("Place order")');
  }
  async clickPlaceOrder() {
    const btn = this.placeOrderButton;
    await btn.waitFor({ state: "visible", timeout: 10000 });
    await this.waitForEnabled(btn, 15000);
    await btn.click();
  }

  get orderConfirmation() {
    return this.frame.locator(".h1.card-title");
  }

  get cartProductName() {
    return this.frame.locator(".cart-item .product-line-info a");
  }
  get cartProductPrice() {
    return this.frame.locator(".cart-item .current-price");
  }
  get checkoutButton() {
    return this.frame.locator('a[href*="order"]:has-text("Checkout")');
  }
  get shippingMessageBox() {
    return this.frame.locator('textarea[name="delivery_message"]');
  }
}

module.exports = { ProductPage };
