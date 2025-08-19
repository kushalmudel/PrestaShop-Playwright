class AuthPage {
  constructor(frame) {
    this.frame = frame;
  }
  get createAccountLink() {
    return this.frame.locator('a[data-link-action="display-register-form"]');
  }
  get emailInput() {
    return this.frame.locator("#field-email");
  }
  get passwordInput() {
    return this.frame.locator("#field-password");
  }
  get signInButton() {
    return this.frame.locator(
      'button#submit-login, button:has-text("Sign in")'
    );
  }
  get signOutLink() {
    return this.frame.locator("a.logout");
  }
  async clickCreateAccount() {
    await this.createAccountLink.click();
  }
  async login(email, password) {
    await this.emailInput.waitFor({ state: "visible", timeout: 10000 });
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }
}
module.exports = { AuthPage };
