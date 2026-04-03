import Image from "next/image";
import Link from "next/link";
import PhotoGallery from "./PhotoGallery";

const gettyCenterPhotos = [
  {
    id: "01",
    filename: "01_getty_travertine_curve.jpg",
    title: "Travertine Curve",
    date: "2025.10.6",
    location: "Getty Center, Los Angeles, USA",
    description: "A flowing curve of travertine stone captures the warm California light.",
  },
  {
    id: "02",
    filename: "02_getty_light_and_shadow.jpg",
    title: "Light and Shadow",
    date: "2025.10.6",
    location: "Getty Center, Los Angeles, USA",
    description: "Sunlight dances across the white facades, creating ever-shifting patterns.",
  },
  {
    id: "03",
    filename: "03_getty_courtyard_view.jpg",
    title: "Courtyard View",
    date: "2025.10.6",
    location: "Getty Center, Los Angeles, USA",
    description: "The central courtyard opens up to panoramic views of the city below.",
  },
  {
    id: "04",
    filename: "04_getty_modern_columns.jpg",
    title: "Modern Columns",
    date: "2025.10.6",
    location: "Getty Center, Los Angeles, USA",
    description: "Slender columns frame the sky, blurring the line between architecture and atmosphere.",
  },
  {
    id: "05",
    filename: "05_getty_garden_terraces.jpg",
    title: "Garden Terraces",
    date: "2025.10.6",
    location: "Getty Center, Los Angeles, USA",
    description: "Terraced gardens cascade down the hillside, softened by drought-tolerant plantings.",
  },
  {
    id: "06",
    filename: "06_getty_reflection_pool.jpg",
    title: "Reflection Pool",
    date: "2025.10.6",
    location: "Getty Center, Los Angeles, USA",
    description: "A still reflecting pool mirrors the crisp lines of the museum.",
  },
  {
    id: "07",
    filename: "07_getty_architecture_lines.jpg",
    title: "Architecture Lines",
    date: "2025.10.6",
    location: "Getty Center, Los Angeles, USA",
    description: "Pure geometric forms create a rhythm of solids and voids.",
  },
  {
    id: "08",
    filename: "08_getty_cactus_garden.jpg",
    title: "Cactus Garden",
    date: "2025.10.6",
    location: "Getty Center, Los Angeles, USA",
    description: "Sculptural cacti stand against the white architecture in striking contrast.",
  },
  {
    id: "09",
    filename: "09_getty_winding_path.jpg",
    title: "Winding Path",
    date: "2025.10.6",
    location: "Getty Center, Los Angeles, USA",
    description: "A curving path invites visitors to explore the hilltop campus.",
  },
  {
    id: "10",
    filename: "10_getty_central_garden.jpg",
    title: "Central Garden",
    date: "2025.10.6",
    location: "Getty Center, Los Angeles, USA",
    description: "Robert Irwin's garden bursts with color, a living artwork within the architecture.",
  },
  {
    id: "11",
    filename: "11_getty_tree_silhouette.jpg",
    title: "Tree Silhouette",
    date: "2025.10.6",
    location: "Getty Center, Los Angeles, USA",
    description: "A lone tree silhouettes against the geometric backdrop of the museum.",
  },
  {
    id: "12",
    filename: "12_getty_azalea_pool.jpg",
    title: "Azalea Pool",
    date: "2025.10.6",
    location: "Getty Center, Los Angeles, USA",
    description: "Azaleas float on the central garden's iconic floating maze.",
  },
  {
    id: "13",
    filename: "13_getty_tram_ascending.jpg",
    title: "Tram Ascending",
    date: "2025.10.6",
    location: "Getty Center, Los Angeles, USA",
    description: "The glass-walled tram rises from the valley, a journey of anticipation.",
  },
  {
    id: "14",
    filename: "14_getty_city_distant.jpg",
    title: "City Distant",
    date: "2025.10.6",
    location: "Getty Center, Los Angeles, USA",
    description: "Through the frame of architecture, Los Angeles spreads endlessly.",
  },
  {
    id: "15",
    filename: "15_getty_geometric_facade.jpg",
    title: "Geometric Facade",
    date: "2025.10.6",
    location: "Getty Center, Los Angeles, USA",
    description: "The facade's rhythm creates a visual poetry of repetition and variation.",
  },
  {
    id: "16",
    filename: "16_getty_marble_detail.jpg",
    title: "Marble Detail",
    date: "2025.10.6",
    location: "Getty Center, Los Angeles, USA",
    description: "Close-up details reveal the material richness of Meier's design.",
  },
  {
    id: "17",
    filename: "17_getty_viewing_terrace.jpg",
    title: "Viewing Terrace",
    date: "2025.10.6",
    location: "Getty Center, Los Angeles, USA",
    description: "Visitors pause on terraces, framed against the vast urban landscape.",
  },
  {
    id: "18",
    filename: "18_getty_evening_glow.jpg",
    title: "Evening Glow",
    date: "2025.10.6",
    location: "Getty Center, Los Angeles, USA",
    description: "As golden hour approaches, the travertine glows with warmth.",
  },
];

const veniceBiennalePhotos = [
  { id: "01", filename: "01_venice_biennale.jpg", title: "Venice Biennale I", date: "2025.6.18-20", location: "Venice Architecture Biennale, Italy", description: "Architectural exploration at the 2025 Venice Architecture Biennale." },
  { id: "02", filename: "02_venice_biennale.jpg", title: "Venice Biennale II", date: "2025.6.18-20", location: "Venice Architecture Biennale, Italy", description: "Architectural exploration at the 2025 Venice Architecture Biennale." },
  { id: "03", filename: "03_venice_biennale.jpg", title: "Venice Biennale III", date: "2025.6.18-20", location: "Venice Architecture Biennale, Italy", description: "Architectural exploration at the 2025 Venice Architecture Biennale." },
  { id: "04", filename: "04_venice_biennale.jpg", title: "Venice Biennale IV", date: "2025.6.18-20", location: "Venice Architecture Biennale, Italy", description: "Architectural exploration at the 2025 Venice Architecture Biennale." },
  { id: "05", filename: "05_venice_biennale.jpg", title: "Venice Biennale V", date: "2025.6.18-20", location: "Venice Architecture Biennale, Italy", description: "Architectural exploration at the 2025 Venice Architecture Biennale." },
  { id: "06", filename: "06_venice_biennale.jpg", title: "Venice Biennale VI", date: "2025.6.18-20", location: "Venice Architecture Biennale, Italy", description: "Architectural exploration at the 2025 Venice Architecture Biennale." },
  { id: "07", filename: "07_venice_biennale.jpg", title: "Venice Biennale VII", date: "2025.6.18-20", location: "Venice Architecture Biennale, Italy", description: "Architectural exploration at the 2025 Venice Architecture Biennale." },
  { id: "08", filename: "08_venice_biennale.jpg", title: "Venice Biennale VIII", date: "2025.6.18-20", location: "Venice Architecture Biennale, Italy", description: "Architectural exploration at the 2025 Venice Architecture Biennale." },
  { id: "09", filename: "09_venice_biennale.jpg", title: "Venice Biennale IX", date: "2025.6.18-20", location: "Venice Architecture Biennale, Italy", description: "Architectural exploration at the 2025 Venice Architecture Biennale." },
  { id: "10", filename: "10_venice_biennale.jpg", title: "Venice Biennale X", date: "2025.6.18-20", location: "Venice Architecture Biennale, Italy", description: "Architectural exploration at the 2025 Venice Architecture Biennale." },
  { id: "11", filename: "11_venice_biennale.jpg", title: "Venice Biennale XI", date: "2025.6.18-20", location: "Venice Architecture Biennale, Italy", description: "Architectural exploration at the 2025 Venice Architecture Biennale." },
  { id: "12", filename: "12_venice_biennale.jpg", title: "Venice Biennale XII", date: "2025.6.18-20", location: "Venice Architecture Biennale, Italy", description: "Architectural exploration at the 2025 Venice Architecture Biennale." },
  { id: "13", filename: "13_venice_biennale.jpg", title: "Venice Biennale XIII", date: "2025.6.18-20", location: "Venice Architecture Biennale, Italy", description: "Architectural exploration at the 2025 Venice Architecture Biennale." },
  { id: "14", filename: "14_venice_biennale.jpg", title: "Venice Biennale XIV", date: "2025.6.18-20", location: "Venice Architecture Biennale, Italy", description: "Architectural exploration at the 2025 Venice Architecture Biennale." },
  { id: "15", filename: "15_venice_biennale.jpg", title: "Venice Biennale XV", date: "2025.6.18-20", location: "Venice Architecture Biennale, Italy", description: "Architectural exploration at the 2025 Venice Architecture Biennale." },
  { id: "16", filename: "16_venice_biennale.jpg", title: "Venice Biennale XVI", date: "2025.6.18-20", location: "Venice Architecture Biennale, Italy", description: "Architectural exploration at the 2025 Venice Architecture Biennale." },
  { id: "17", filename: "17_venice_biennale.jpg", title: "Venice Biennale XVII", date: "2025.6.18-20", location: "Venice Architecture Biennale, Italy", description: "Architectural exploration at the 2025 Venice Architecture Biennale." },
  { id: "18", filename: "18_venice_biennale.jpg", title: "Venice Biennale XVIII", date: "2025.6.18-20", location: "Venice Architecture Biennale, Italy", description: "Architectural exploration at the 2025 Venice Architecture Biennale." },
];

const portraitsPhotos = [
  {
    id: "01",
    filename: "01_the_cat_charmer.jpg",
    title: "The Cat Charmer",
    date: "2025.1.3",
    location: "Aït Benhaddou, Morocco",
    description:
      "A tender encounter between a traveler and a stray cat along the red-earth slopes leading to the ancient ksar's summit.",
  },
  {
    id: "02",
    filename: "02_dune_scroller.jpg",
    title: "Dune Scroller",
    date: "2025.1.5",
    location: "Merzouga, Sahara Desert, Morocco",
    description:
      "Digital signals of modern civilization seek a connection atop the timeless, golden silence of the Sahara.",
  },
  {
    id: "03",
    filename: "03_pilgrim_in_light.jpg",
    title: "Pilgrim in Light",
    date: "2025.1.7",
    location: "Hassan II Mosque, Casablanca, Morocco",
    description:
      "A solitary figure carved into a slice of silence by the towering shadows of grand architecture.",
  },
  {
    id: "04",
    filename: "04_beachcomber.jpg",
    title: "Beachcomber",
    date: "2025.1.8",
    location: "Casablanca Coast, Morocco",
    description:
      "A quiet game of reflection between a beachcomber and the Atlantic tide on a mirrored shore.",
  },
  {
    id: "05",
    filename: "05_the_arched_lovers.jpg",
    title: "The Arched Lovers",
    date: "2025.2.28",
    location: "Museo Canova, Possagno, Italy",
    description:
      "Modern footsteps softly echo through neoclassical arches, awakening the silent plaster souls within the gallery.",
  },
  {
    id: "06",
    filename: "06_triangle_and_faith.jpg",
    title: "Triangle and Faith",
    date: "2025.3.1",
    location: "Monte Grisa Sanctuary, Trieste, Italy",
    description:
      "Human gestures overflow with raw emotion against the rigid, geometric triangles of Brutalist concrete.",
  },
  {
    id: "07",
    filename: "07_the_vicens_little_guest.jpg",
    title: "The Vicens' Little Guest",
    date: "2025.4.22",
    location: "Casa Vicens, Barcelona, Spain",
    description:
      "Amidst Gaudí's marigold tiles, a child's curiosity reaches out to touch the whimsical history of the \"Red House.\"",
  },
  {
    id: "08",
    filename: "08_the_muscle_angler.jpg",
    title: "The Muscle Angler",
    date: "2025.4.23",
    location: "Sitges, Spain",
    description:
      "Under the Mediterranean sun, the raw strength of an angler finds a quiet balance within the effortless ease of the coast.",
  },
  {
    id: "09",
    filename: "09_seafront_solitude.jpg",
    title: "Seafront Solitude",
    date: "2025.4.23",
    location: "Sitges, Spain",
    description:
      "A single spark between fingers dissolves into a deep Mediterranean monologue as eyes meet a distant sail.",
  },
  {
    id: "10",
    filename: "10_rex_rooftop_play.jpg",
    title: "Rex Rooftop Play",
    date: "2025.10.19",
    location: "Amos Rex Museum, Helsinki, Finland",
    description:
      "Pure Nordic energy is unleashed as children run across the bubbly skylights of an underground museum.",
  },
];

export default function PhotographyPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-700 font-sans">
      <main className="mx-auto w-full max-w-5xl px-6 py-16 md:px-10 md:py-20">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs tracking-[0.24em] text-stone-500 uppercase">
            Photography
          </p>
          <h1 className="mt-4 font-serif text-4xl text-stone-900 md:text-5xl">
            Photography
          </h1>
          <p className="mt-4 leading-7 text-stone-500">
            Quiet urban frames — a collection of observations in light, movement, and place.
          </p>
        </div>

        {/* Portraits & Human Scale Section */}
        <section className="mb-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl text-stone-900 md:text-3xl">
                Portraits & Human Scale
              </h2>
              <p className="mt-2 text-sm text-stone-500">
                10 photos · 2025
              </p>
            </div>
          </div>

          <PhotoGallery photos={portraitsPhotos} basePath="/photography/portraits-human-scale" />
        </section>

        {/* Architecture Tectonics Section */}
        <section className="mb-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl text-stone-900 md:text-3xl">
                Architecture Tectonics
              </h2>
              <p className="mt-2 text-sm text-stone-500">
                18 photos · 2025
              </p>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                Richard Meier's modernist masterpiece — a symphony of travertine, light, and geometric precision perched above Los Angeles.
              </p>
            </div>
          </div>

          <PhotoGallery photos={gettyCenterPhotos} basePath="/photography/architecture-tectonics" />
        </section>

        {/* Venice Architecture Biennale Section */}
        <section className="mb-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl text-stone-900 md:text-3xl">
                Venice Architecture Biennale 2025
              </h2>
              <p className="mt-2 text-sm text-stone-500">
                18 photos · June 2025
              </p>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                The world's most influential architectural exhibition — pavilions, installations, and spatial experiments across Giardini and Arsenale.
              </p>
            </div>
          </div>

          <PhotoGallery photos={veniceBiennalePhotos} basePath="/photography/venice-biennale" />
        </section>

        {/* Navigation */}
        <div className="mt-16 border-t border-stone-200 pt-8">
          <Link
            href="/"
            className="text-sm text-stone-600 underline decoration-stone-300 underline-offset-4 transition-colors hover:text-stone-900"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
