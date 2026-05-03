import { test, expect } from "@playwright/test";

test("unauthenticated /admin redirects to login", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole("heading", { name: /connexion/i })).toBeVisible();
});

test("login page rejects invalid credentials", async ({ page }) => {
  await page.goto("/login");
  await page.getByPlaceholder("Email").fill("wrong@example.com");
  await page.getByPlaceholder("Mot de passe").fill("wrongpassword");
  await page.getByRole("button", { name: /se connecter/i }).click();
  await expect(page.getByText(/invalid|erreur|invalide/i)).toBeVisible({ timeout: 10_000 });
});

test("signup page renders", async ({ page }) => {
  await page.goto("/signup");
  await expect(page.getByRole("heading", { name: /inscription/i })).toBeVisible();
  await expect(page.getByPlaceholder(/pseudo/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /continuer avec google/i })).toBeVisible();
});

test("/cars/new requires login", async ({ page }) => {
  await page.goto("/cars/new");
  await expect(page).toHaveURL(/\/login/);
});

test("/me/cars requires login", async ({ page }) => {
  await page.goto("/me/cars");
  await expect(page).toHaveURL(/\/login/);
});

test("profile not-found page renders for unknown username", async ({ page }) => {
  const res = await page.goto("/u/nonexistent_user_123");
  expect(res?.status()).toBe(404);
  await expect(page.getByText(/profil introuvable/i)).toBeVisible();
});
