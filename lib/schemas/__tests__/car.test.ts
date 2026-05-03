import { describe, it, expect } from "vitest";
import { carInputSchema } from "../car";

describe("carInputSchema", () => {
  const valid = {
    marque: "Porsche",
    modele: "911 GT3 RS",
    pays_constructeur: "Allemagne",
    carburant: "essence",
  };

  it("accepts minimal valid input", () => {
    expect(carInputSchema.parse(valid)).toMatchObject(valid);
  });

  it("rejects missing marque", () => {
    expect(() =>
      carInputSchema.parse({ ...valid, marque: "" })
    ).toThrow();
  });

  it("rejects negative cylindree", () => {
    expect(() =>
      carInputSchema.parse({ ...valid, cylindree_cm3: -100 })
    ).toThrow();
  });

  it("accepts full optional fields", () => {
    const full = {
      ...valid,
      type: "Coupé",
      annee: 2023,
      exemplaires_produits: 500,
      phase_generation: "Phase 2",
      config_moteur: "Flat 6 atmo",
      cylindree_cm3: 4000,
      puissance_ch: 525,
      roues_motrices: "propulsion",
      boite_vitesse: "auto",
      nb_vitesses: 7,
      alimentation: "atmo",
      position_moteur: "arrière",
      video_url: "https://youtube.com/watch?v=abc",
    };
    expect(carInputSchema.parse(full)).toMatchObject(full);
  });
});
