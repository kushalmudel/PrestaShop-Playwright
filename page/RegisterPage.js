class RegisterPage {
  constructor(frame) {
    this.frame = frame;
  }
  get socialTitleMr() {
    return this.frame.locator('input[name="id_gender"][value="1"]');
  }
  get socialTitleMrs() {
    return this.frame.locator('input[name="id_gender"][value="2"]');
  }
  get firstNameInput() {
    return this.frame.locator('input[name="firstname"]');
  }
  get lastNameInput() {
    return this.frame.locator('input[name="lastname"]');
  }
  get emailInput() {
    return this.frame.locator("#field-email");
  }
  get passwordInput() {
    return this.frame.locator('input[name="password"]');
  }
  get birthdateInput() {
    return this.frame.locator('input[name="birthday"]');
  }
  get privacyCheckbox() {
    return this.frame.locator('input[name="customer_privacy"]');
  }
  get termsCheckbox() {
    return this.frame.locator('input[name="psgdpr"]');
  }
  get newsletterCheckbox() {
    return this.frame.locator('input[name="newsletter"]');
  }
  get saveButton() {
    return this.frame.locator('button:has-text("Save")');
  }
  async register({
    gender = "Mr",
    firstName,
    lastName,
    email,
    password,
    birthdate,
  }) {
    if (gender === "Mr") await this.socialTitleMr.check();
    else await this.socialTitleMrs.check();
    await this.firstNameInput.waitFor({ state: "visible", timeout: 10000 });
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.birthdateInput.fill(birthdate);
    await this.privacyCheckbox.check();
    await this.termsCheckbox.check();
    await this.newsletterCheckbox.check();
    await this.saveButton.click();
  }
}
module.exports = { RegisterPage };
