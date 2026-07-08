export const NAV_ITEMS = [
  { id: "work", label: "Work" },
  { id: "approach", label: "Approach" },
  { id: "results", label: "Results" },
  { id: "contact", label: "Contact" },
] as const;

export type NavId = (typeof NAV_ITEMS)[number]["id"];

export const HERO_STATES = [
  {
    id: "hero-1",
    headline: [
      { text: "Turning ", accent: false },
      { text: "complex behaviour", accent: true },
      { text: " into simple, ", accent: false },
      { text: "measurable", accent: true },
      { text: " product experiences.", accent: false },
    ],
    supporting: [
      { text: "I'm ", accent: false },
      { text: "Jac", accent: true },
      {
        text: ", a Senior Product Designer with ",
        accent: false,
      },
      { text: "15+ years'", accent: true },
      {
        text: " experience across e-commerce, fintech and ed-tech.",
        accent: false,
      },
    ],
  },
  {
    id: "hero-2",
    headline: [
      {
        text: "In fintech, grocery and ed-tech, specialising in complex digital products that connect ",
        accent: false,
      },
      { text: "customer behaviour", accent: true },
      { text: ", technology and ", accent: false },
      { text: "commercial outcomes", accent: true },
      { text: ".", accent: false },
    ],
    supporting: [
      {
        text: "From strategy through to shipped experience, I design products that align user needs, business goals and delivery realities.",
        accent: false,
      },
    ],
  },
] as const;

export const HERO_METRICS = [
  {
    value: "6/7",
    label: "Shopping Lists testing score",
  },
  {
    value: "50%+",
    label: "Delivery effort reduced",
  },
  {
    value: "NPS 62",
    label: "Kaizen Languages",
  },
] as const;

export const PROJECTS = [
  {
    id: "shopping-lists",
    title: "Shopping Lists",
    description:
      "AI-assisted shopping lists that turn real-world intent into faster, more relevant grocery planning.",
    metric: "6/7 ease-of-use score",
    image: "/media/work/Feature-img_Lists.png",
    alt: "Shopping Lists — Waitrose flat-lay iPad shopping list interface",
    panelColor: "#D4147A",
  },
  {
    id: "quick-shop",
    title: "Quick Shop",
    description:
      "A repeat-purchase experience designed to help customers rebuild their regular shop with less effort.",
    metric: "5m 06s faster repeat-purchase journey",
    image: "/media/work/Feature-img_QuickShop.png",
    alt: "Quick Shop — hand holding Waitrose mobile app on lime green background",
    panelColor: "#C8D82D",
  },
  {
    id: "cellar",
    title: "Cellar",
    description:
      "A simplified account strategy that reduced delivery complexity while unlocking customer value faster.",
    metric: "50%+ effort reduction",
    image: "/media/work/Feature-img_Cellar.png",
    alt: "Cellar — burgundy wine glass with wine pour",
    panelColor: "#5C1538",
  },
  {
    id: "primarybid",
    title: "PrimaryBid",
    description:
      "High-trust fintech journeys designed to make complex IPO investing clearer, safer and easier to complete.",
    metric: "4 high-trust journeys redesigned",
    image: "/media/work/Feature-img_PrimaryBid.png",
    alt: "PrimaryBid — hand holding phone with sign-up screen on gradient background",
    panelColor: "#3B4FA8",
  },
  {
    id: "kaizen",
    title: "Kaizen Languages",
    description:
      "A mobile learning experience shaped around motivation, progress and long-term language retention.",
    metric: "NPS 62",
    image: "/media/work/Feature-img_Kaizen.png",
    alt: "Kaizen Languages — Spanish lessons app on purple background",
    panelColor: "#2E1A6E",
  },
  {
    id: "smarter",
    title: "Smarter",
    description:
      "A connected smart-home app experience across iKettle, Smarter Coffee and FridgeCam.",
    metric: "3 connected products supported",
    image: "/media/work/Feature-img_Smarter.png",
    alt: "Smarter — FridgeCam and fridge interior app on light grey background",
    panelColor: "#E8E8E8",
  },
] as const;

export const APPROACH_CARDS = [
  {
    id: "behaviour-first",
    title: "Behaviour first",
    description:
      "I start with real human behaviour — habits, decisions, workarounds and friction — then turn those insights into product opportunities.",
    icon: "/images/approach/behaviour-first.png",
  },
  {
    id: "systems-thinking",
    title: "Systems thinking",
    description:
      "I connect users, data, technology and business constraints to design solutions that work across the whole journey, not just one screen.",
    icon: "/images/approach/systems-thinking.png",
  },
  {
    id: "commercial-impact",
    title: "Commercial impact",
    description:
      "I design with measurable outcomes in mind, whether that means improving adoption, reducing effort, increasing confidence or unlocking value faster.",
    icon: "/images/approach/commercial-impact.png",
  },
  {
    id: "prototype-invisible",
    title: "Prototype the invisible",
    description:
      "I make ideas tangible early through prototypes and experiments, helping teams test assumptions, reduce risk and align before build.",
    icon: "/images/approach/prototype-invisible.png",
  },
] as const;

export const RESULTS = [
  {
    project: "Shopping Lists",
    impact:
      "Turning real-world shopping intent into higher-value digital behaviour.",
    chips: ["6/7 ease-of-use", "+72% order frequency", "+36% AOV"],
  },
  {
    project: "Quick Shop",
    impact:
      "Reducing repeat-shopping friction through faster, personalised regular shops.",
    chips: ["25% faster completion", "5m 06s saved", "+19% items per basket"],
  },
  {
    project: "Cellar",
    impact:
      "Unlocking commercial value by simplifying account strategy and delivery effort.",
    chips: ["£2m CRM opportunity", "50%+ effort reduction", "12+ months avoided"],
  },
  {
    project: "PrimaryBid",
    impact:
      "Creating clearer, high-trust journeys for regulated investment products.",
    chips: ["4 journeys redesigned", "Responsive T-Web", "Broker dashboard support"],
  },
  {
    project: "Kaizen Languages",
    impact:
      "Improving learning motivation, retention and subscription performance.",
    chips: ["NPS 62", "+35% retention", "+25% lesson completion"],
  },
  {
    project: "Smarter",
    impact:
      "Designing one connected app ecosystem across physical smart-home products.",
    chips: ["3 products supported", "iOS + Android", "Setup + recovery flows"],
  },
] as const;

export const CONTACT_LINKS = [
  {
    label: "Email",
    href: "mailto:jacinto@example.com",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/jacintodematos",
  },
  {
    label: "View portfolio website",
    href: "#work",
  },
  {
    label: "Download CV",
    href: "/cv/jacinto-de-matos-cv.pdf",
  },
] as const;
