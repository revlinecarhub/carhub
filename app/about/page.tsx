import { BookOpen, Users, MapPin, Trophy, FileText, Heart } from "lucide-react";

const FEATURES = [
  {
    icon: BookOpen,
    title: "Classeur automobile",
    body:
      "Publiez et consultez des fiches techniques détaillées sur des milliers de véhicules : berlines, sportives, hypercars et bien plus.",
  },
  {
    icon: Users,
    title: "Communauté passionnée",
    body:
      "Suivez d'autres passionnés, commentez leurs publications, réagissez et échangez autour de votre passion commune.",
  },
  {
    icon: MapPin,
    title: "Évènements en direct",
    body:
      "Retrouvez les rassemblements, courses, salons et évènements automobiles à venir près de chez vous.",
  },
  {
    icon: Trophy,
    title: "Top du mois",
    body:
      "Chaque mois, les véhicules les plus appréciés et les plus vus sont mis en avant dans notre classement.",
  },
  {
    icon: FileText,
    title: "Fiches techniques",
    body:
      "Exportez une fiche PDF complète avec photos, caractéristiques et description pour chaque véhicule.",
  },
  {
    icon: Heart,
    title: "Sans pub, sans profit",
    body:
      "Revline est un projet indépendant, construit par des passionnés, pour des passionnés. Aucune publicité, aucune monétisation.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <header className="mb-12 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-accent)]">
          À propos
        </p>
        <h1 className="mt-3 font-serif text-6xl md:text-8xl text-white" style={{ fontFamily: "var(--font-playfair)" }}>
          REVLINE
        </h1>
      </header>

      <section className="space-y-6 text-[var(--color-fg)]">
        <p>
          Revline est une plateforme communautaire dédiée aux passionnés d&apos;automobile.
          Elle permet à chacun de constituer un véritable classeur numérique de véhicules :
          voitures de sport, hypercars, youngtimers, oldtimers, ou simples voitures de rue
          aperçues lors d&apos;un carspotting.
        </p>
        <p>
          Sur Revline, vous pouvez publier des fiches détaillées avec photos, vidéos,
          motorisation, cylindrée, transmission, et bien d&apos;autres caractéristiques
          techniques. Chaque publication devient une contribution à une base de données
          collaborative, consultable par tous les membres de la communauté.
        </p>
        <p>
          La plateforme est pensée pour tous les passionnés : que vous soyez spotter du
          dimanche, propriétaire d&apos;une sportive, visiteur de salons automobiles ou
          simple amoureux des belles mécaniques. Revline vous offre un espace pour
          partager, commenter, noter et découvrir des véhicules du monde entier.
        </p>
        <p>
          Le projet est développé de façon indépendante, sans publicité et sans objectif
          commercial. Il est maintenu avec passion par une petite équipe de développeurs et
          d&apos;enthousiastes automobiles qui souhaitent offrir à la communauté un outil
          simple, élégant et efficace.
        </p>
      </section>

      <section className="mt-16 grid gap-6 sm:grid-cols-2">
        {FEATURES.map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6"
          >
            <Icon className="h-8 w-8 text-[var(--color-accent)]" />
            <h3 className="mt-4 font-serif text-xl" style={{ fontFamily: "var(--font-playfair)" }}>
              {title}
            </h3>
            <p className="mt-2 text-sm text-[var(--color-muted)]">{body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
