class HomePage {
  constructor(page) {
    this.page = page;
  }
  async goto() {
    await this.page.goto("https://demo.prestashop.com/#/en/front");
    await this.page.waitForSelector("iframe#framelive");
  }
  async getFrame() {
    return this.page.frame({ name: "framelive" });
  }
  async clickSignIn() {
    const frame = await this.getFrame();
    const signIn = frame.locator('a[title="Log in to your customer account"]');
    if (await signIn.count()) {
      await signIn.first().click();
    } else {
      await frame.locator("text=Sign in").first().click();
    }
  }
  async clickSignOut() {
    const frame = await this.getFrame();
    const signOut = frame.locator("a.logout");
    if (await signOut.count()) {
      await signOut.first().click();
    } else {
      await frame.locator("text=Sign out").first().click();
    }
  }
}
module.exports = { HomePage };
