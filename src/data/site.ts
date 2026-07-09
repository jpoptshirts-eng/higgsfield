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

export const WORK_IMAGE_VERSION = 1;

export const PROJECTS = [
  {
    id: "shopping-lists",
    title: "Shopping Lists",
    description:
      "AI-assisted shopping lists that turn real-world intent into faster, more relevant grocery planning.",
    metric: "6/7 ease-of-use score",
    image: `/images/work-img_Lists.jpg?v=${WORK_IMAGE_VERSION}`,
    alt: "Shopping Lists — Waitrose flat-lay iPad shopping list interface",
    panelColor: "#D4147A",
    caseStudyUrl: "https://www.jacinto.website/work/shopping-lists",
  },
  {
    id: "quick-shop",
    title: "Quick Shop",
    description:
      "A repeat-purchase experience designed to help customers rebuild their regular shop with less effort.",
    metric: "5m 06s faster repeat-purchase journey",
    image: `/images/work-img_QuickShop.jpg?v=${WORK_IMAGE_VERSION}`,
    alt: "Quick Shop — hand holding Waitrose mobile app on lime green background",
    panelColor: "#C8D82D",
    caseStudyUrl: "https://www.jacinto.website/work/quickshop",
  },
  {
    id: "cellar",
    title: "Cellar",
    description:
      "A simplified account strategy that reduced delivery complexity while unlocking customer value faster.",
    metric: "50%+ effort reduction",
    image: `/images/work-img_Cellar.jpg?v=${WORK_IMAGE_VERSION}`,
    alt: "Cellar — burgundy wine glass with wine pour",
    panelColor: "#5C1538",
    caseStudyUrl: "https://www.jacinto.website/work/cellar",
  },
  {
    id: "primarybid",
    title: "PrimaryBid",
    description:
      "High-trust fintech journeys designed to make complex IPO investing clearer, safer and easier to complete.",
    metric: "4 high-trust journeys redesigned",
    image: `/images/work-img_PrimaryBid.jpg?v=${WORK_IMAGE_VERSION}`,
    alt: "PrimaryBid — hand holding phone with sign-up screen on gradient background",
    panelColor: "#3B4FA8",
    caseStudyUrl: "https://www.jacinto.website/work/primarybid",
  },
  {
    id: "kaizen",
    title: "Kaizen",
    description:
      "A mobile learning experience shaped around motivation, progress and long-term language retention.",
    metric: "NPS 62",
    image: `/images/work-img_Kaizen.jpg?v=${WORK_IMAGE_VERSION}`,
    alt: "Kaizen Languages — Spanish lessons app on purple background",
    panelColor: "#2E1A6E",
    caseStudyUrl: "https://www.jacinto.website/work/kaizen-languages",
  },
  {
    id: "smarter",
    title: "Smarter",
    description:
      "A connected smart-home app experience across iKettle, Smarter Coffee and FridgeCam.",
    metric: "3 connected products supported",
    image: `/images/work-img_Smarter.jpg?v=${WORK_IMAGE_VERSION}`,
    alt: "Smarter — FridgeCam and fridge interior app on light grey background",
    panelColor: "#E8E8E8",
    caseStudyUrl: "https://www.jacinto.website/work/smarter",
  },
] as const;

export const APPROACH_CARDS = [
  {
    id: "behaviour-first",
    title: "Behaviour first",
    description:
      "I start with how people actually behave, not just what they say they want.",
    icon: "/images/approach/behaviour-first.png",
  },
  {
    id: "systems-thinking",
    title: "Systems thinking",
    description:
      "I connect the dots across users, data, technology and business constraints.",
    icon: "/images/approach/systems-thinking.png",
  },
  {
    id: "commercial-impact",
    title: "Commercial impact",
    description:
      "I design for outcomes that create value for customers and the business.",
    icon: "/images/approach/commercial-impact.png",
  },
  {
    id: "prototype-invisible",
    title: "Prototype the invisible",
    description:
      "I make unclear ideas tangible early, so teams can test, align and reduce risk.",
    icon: "/images/approach/prototype-invisible.png",
  },
] as const;

export const RESULTS = [
  {
    project: "Shopping Lists",
    impact:
      "I start with how people actually behave, not just what they say they want.",
    metrics: ["6/7 ease-of-use", "+72% order frequency", "+36% AOV"],
  },
  {
    project: "Quick Shop",
    impact:
      "Reducing repeat-shopping friction through behavioural personalisation",
    metrics: ["25% faster completion", "5m 06s saved", "+19% items per basket"],
  },
  {
    project: "Cellar",
    impact: "Unlocking commercial value by reframing the account strategy",
    metrics: ["£2m CRM opportunity", "50%+ effort reduction", "12+ months avoided"],
  },
  {
    project: "PrimaryBid",
    impact: "Creating foundations for a regulated transactional web platform",
    metrics: ["4 journeys redesigned", "Responsive T-Web", "Broker dashboard support"],
  },
  {
    project: "Kaizen Languages",
    impact: "Improving learning, retention and subscription performance",
    metrics: ["NPS 62", "+35% streak engagement", "+25% lesson completion"],
  },
  {
    project: "Smarter",
    impact:
      "Designing one connected ecosystem across physical and digital products",
    metrics: ["3 products supported", "iOS + Android", "Setup + recovery flows"],
  },
] as const;

export const CONTACT_LINKS = [
  {
    label: "Email",
    href: "mailto:jjmatos@hotmail.com",
    external: false,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/jacinto-de-matos-00b303124/",
    external: true,
  },
  {
    label: "Case studies",
    href: "https://www.jacinto.website/",
    external: true,
  },
  {
    label: "Resume",
    href: "/cv/jacinto-de-matos-resume.pdf",
    external: true,
    download: "Jacinto-De-Matos-Resume.pdf",
  },
] as const;
