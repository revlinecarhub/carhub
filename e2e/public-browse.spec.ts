import { test, expect } from "@playwright/test";

test("homepage renders with title and CTA", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /voitures/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /explorer le classeur/i })).toBeVisible();
});

test("browse page renders search + filters toggle", async ({ page }) => {
  await page.goto("/cars");
  await expect(page.getByPlaceholder(/rechercher/i)).toBeVisible();
  // Filters are collapsed by default; toggle button is visible
  const toggle = page.getByRole("button", { name: /filtres/i });
  await expect(toggle).toBeVisible();
  // Click toggle reveals Marque label
  await toggle.click();
  await expect(page.getByText(/marque/i).first()).toBeVisible();
});

test("detail page 404 for unknown slug", async ({ page }) => {
  const res = await page.goto("/cars/voiture-qui-nexiste-pas");
  expect(res?.status()).toBe(404);
  await expect(page.getByText(/introuvable/i)).toBeVisible();
});
