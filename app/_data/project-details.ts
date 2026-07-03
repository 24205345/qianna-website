export interface ProjectDetailItem {
  label: string;
  value: string;
}

/** thesis 详情页静态回退 */
export const thesisDetailFallback = {
  projectDetails: [
    { label: "Programme", value: "Urban Design MArch" },
    { label: "Cluster", value: "RC15" },
    {
      label: "Students",
      value: "Bor-En Huang, Qianqian Wang, Shanshan Gao",
    },
  ] as ProjectDetailItem[],
  overviewParagraphs: [
    "The project investigates the hidden emotional costs embedded in London's public transport system. While efficient on the surface, the network imposes overlooked burdens on its most dependent users, such as long commutes, cognitive fatigue, and emotional strain. These impacts are rarely addressed in transport planning, yet they deepen urban inequality.",
    "Using geospatial analysis, public transport accessibility level (PTAL) mapping, and wearable GSR sensors, the group mapped emotional stress across transit journeys in Stratford (East London), revealing unequal experiential geographies, and how, for many, public transport is not a path to opportunity but a mechanism of urban injustice.",
    "In response, the project proposes a dual intervention: a mobile app that tracks users' emotional states in transit, offering a live affective overview of the network and suggesting neurodiverse routes; and a parasitic architectural system embedded in multimodal hubs, offering spaces from quiet rest to collective events, in a process that transforms commuting into civic time and reimagines mobility as a shared spatial practice of care.",
  ],
  introVideoUrl:
    "https://drive.google.com/file/d/1YvNuMVlKYizcHRTqBWhPklIDExRCMYHk/preview",
  layoutTemplate: "thesis" as const,
};

/** xicaoshi 详情页静态回退 */
export const xicaoshiDetailFallback = {
  projectDetails: [
    { label: "Category", value: "Architecture Project" },
    { label: "Year", value: "2023" },
    { label: "Location", value: "Beijing Central Axis, China" },
  ] as ProjectDetailItem[],
  overviewParagraphs: [
    "In the context of the preservation and renewal of historic cities, and with the Beijing Central Axis world heritage application, old urban areas on the central axis need sustainable development in multiple dimensions.",
    "The design object — Xicaoshi Red Temple block — is located on the east side of the south central axis of Beijing, in the transitional space between 'city' and 'suburb'. On the basis of block design, a typical courtyard is selected for in-depth design as a demonstration for courtyard protection and renewal.",
    "The method of 'urban acupuncture' is proposed — taking relatively small-scale intervention measures at specific nodes of the block, so as to have a positive catalytic effect on social, economic, and environmental problems in a wider range.",
  ],
  introVideoUrl: null as string | null,
  layoutTemplate: "xicaoshi" as const,
};
