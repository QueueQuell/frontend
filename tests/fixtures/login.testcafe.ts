import { Selector, ClientFunction, RequestMock } from "testcafe";

const loginUrl = "http://localhost:3000/login";
const apiLoginUrl = "http://localhost:5000/api/v1/admin/auth/login";

const loginMock = RequestMock()
  .onRequestTo(apiLoginUrl)
  .respond(
    {
      success: true,
      data: {
        authDetails: {
          accessToken: "fake-access-token",
          refreshToken: "fake-refresh-token",
          tokenType: "Bearer",
          expiresIn: 3600,
        },
        user: {
          id: "user-123",
          org: { id: "org-123" },
        },
      },
      message: "Login successful",
    },
    200,
    { "content-type": "application/json" },
  );

const loginFailMock = RequestMock().onRequestTo(apiLoginUrl).respond(
  {
    success: false,
    message: "Invalid credentials",
  },
  401,
  { "content-type": "application/json" },
);

const emailInput = Selector('input[name="email"]');
const passwordInput = Selector('input[name="password"]');
const submitButton = Selector('button[type="submit"]').withExactText("Sign in");
const errorAlert = Selector(".MuiAlert-root");
const logoLink = Selector('a[href="/"] img[src="/queuequell-logo.png"]');
const passwordToggle = Selector('button[type="button"]');

const clearLocalStorage = ClientFunction(() => localStorage.clear());
const getLocalStorageItem = ClientFunction((key) => localStorage.getItem(key));

fixture`Login Tests for QueueQuell`
  .page(loginUrl)
  .requestHooks(loginMock)
  .beforeEach(async (t) => {
    await clearLocalStorage();
    await t.navigateTo(loginUrl);
  });

test("Login page renders correctly", async (t) => {
  await t
    .expect(emailInput.exists)
    .ok()
    .expect(passwordInput.exists)
    .ok()
    .expect(submitButton.exists)
    .ok()
    .expect(logoLink.exists)
    .ok();
});

test("Displays validation for empty fields", async (t) => {
  await t.click(submitButton);
  await t
    .expect(errorAlert.innerText)
    .contains("Please enter email and password.");
});

test("Displays validation for missing email", async (t) => {
  await t.typeText(passwordInput, "password123").click(submitButton);

  await t.expect(errorAlert.innerText).contains("Please enter email.");
});

test("Displays validation for missing password", async (t) => {
  await t.typeText(emailInput, "test@example.com").click(submitButton);

  await t.expect(errorAlert.innerText).contains("Please enter password.");
});

test("Displays validation for invalid email", async (t) => {
  await t
    .typeText(emailInput, "invalid")
    .typeText(passwordInput, "password123")
    .click(submitButton);

  await t
    .expect(errorAlert.innerText)
    .contains("Please enter a valid email address.");
});

test("Toggles password visibility", async (t) => {
  await t
    .typeText(passwordInput, "password123")
    .expect(passwordInput.getAttribute("type"))
    .eql("password")
    .click(passwordToggle)
    .expect(passwordInput.getAttribute("type"))
    .eql("text")
    .click(passwordToggle)
    .expect(passwordInput.getAttribute("type"))
    .eql("password");
});

test("Successfully logs in and redirects to home", async (t) => {
  await t
    .typeText(emailInput, "test@example.com")
    .typeText(passwordInput, "password123")
    .click(submitButton)
    .expect(getLocalStorageItem("accessToken"))
    .eql("fake-access-token")
    .expect(t.eval(() => window.location.pathname))
    .eql("/home");
});

fixture`Login Error Handling Tests for QueueQuell`
  .page(loginUrl)
  .requestHooks(loginFailMock)
  .beforeEach(async (t) => {
    await clearLocalStorage();
    await t.navigateTo(loginUrl);
  });

test("Shows API error when login fails", async (t) => {
  await t
    .typeText(emailInput, "test@example.com")
    .typeText(passwordInput, "wrongpassword")
    .click(submitButton)
    .expect(errorAlert.innerText)
    .contains("Invalid username/email or password");
});

test("Logo click navigates to root page", async (t) => {
  await t.click(logoLink);
  await t.expect(t.eval(() => window.location.pathname)).eql("/");
});
