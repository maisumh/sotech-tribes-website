// ─────────────────────────────────────────────────────────────────────────────
// SITE CONTENT — single source of truth for the marketing pages.
//
// ⚠️ THIS COPY MUST MATCH THE SHIPPED APP. It drifted for four months while the
// site still advertised a "Spring 2026" waitlist for an app that had been
// public on both stores since July. Two rules that keep it honest:
//
//   1. `Marketing/AppStore/aso-metadata-v2.md` is the positioning source of
//      truth. If a feature is not in that document's feature list, it did not
//      ship — do not describe it here.
//   2. Terminology is **Offering / Seeking** (never Want/Have, which is the
//      code-side name), and the sub-community feature is a **Circle**. The
//      company is Tribes; a group inside it is a Circle. Calling a group a
//      "tribe" here sets an expectation the app breaks, because no such object
//      exists in it.
//
// Rollout note: marketing focus is Montrose, but the ZIP gate is deliberately
// invisible to users and admission is decided in-app. So the site may say where
// we are *starting* — it must never say "invite only", never name a ZIP, and
// never make a reader outside Houston feel walled out.
// ─────────────────────────────────────────────────────────────────────────────

export const SITE = {
  title: "Tribes™ | Trade What You Have for What You Need, With Your Neighbors",
  description:
    "List what you're Offering. Post what you're Seeking. Tribes matches you with the neighbor whose needs fit yours both ways. Free on iOS and Android.",
  url: "https://trytribes.com",
  email: "info@trytribes.com",
};

export const BRAND = {
  colors: {
    primary: "#103730",
    secondary: "#879B97",
    accent: "#F6B74A",
    background: "#FEFEFE",
    text: "#0D0D0D",
  },
  logos: {
    primaryDark:
      "https://ktboxzgxzbjajngatuho.supabase.co/storage/v1/object/public/brand-assets/611f4b15-3017-40d0-96b5-1f14208aef62/logos/primary-dark-green.png",
    primaryWhite:
      "https://ktboxzgxzbjajngatuho.supabase.co/storage/v1/object/public/brand-assets/611f4b15-3017-40d0-96b5-1f14208aef62/logos/primary-white.png",
    faviconLight:
      "https://ktboxzgxzbjajngatuho.supabase.co/storage/v1/object/public/brand-assets/611f4b15-3017-40d0-96b5-1f14208aef62/logos/favicon-light-bg.png",
    faviconDark:
      "https://ktboxzgxzbjajngatuho.supabase.co/storage/v1/object/public/brand-assets/611f4b15-3017-40d0-96b5-1f14208aef62/logos/favicon-dark-bg.png",
  },
  images: {
    tribeCard1:
      "https://storage.googleapis.com/msgsndr/TEAVsvTerVipIS3cla4Y/media/69501f87dda1921bdd95b862.jpeg",
    tribeCard2:
      "https://storage.googleapis.com/msgsndr/TEAVsvTerVipIS3cla4Y/media/69501f8773a5e0f6e5503108.jpeg",
    tribeCard3:
      "https://storage.googleapis.com/msgsndr/TEAVsvTerVipIS3cla4Y/media/69501f8773a5e01807503109.jpeg",
  },
};

export const NAV_LINKS = [
  { label: "Neighbors", href: "/neighbors" },
  { label: "Partners", href: "/partners" },
];

export const HERO = {
  headline: [
    "Rediscover Your Neighborhood.",
    "Share What You Have.",
    "Get What You Need.",
    "Build Your Tribe.",
  ],
  subheadline:
    "List what you're Offering. Post what you're Seeking. Tribes finds the neighbor whose needs fit yours both ways — no money, no clutter, no waste.",
  cta: "Get the App",
  // Replaces "Launching Spring 2026 — early access opening soon". Names where we
  // are starting without implying anyone else is blocked (see the rollout note
  // at the top of this file).
  trust: {
    prefix: "Free on iOS and Android. Join",
    number: "500+",
    suffix: "neighbors on Tribes. Starting in Houston, growing block by block.",
  },
};

export const VALUE_PROP = {
  title: ["On Social Media You Scroll.", "On Tribes™, You Trade."],
  paragraphs: [
    "Most marketplaces are built around cash. Tribes is built around your block. You list what you can share — a power drill, a spare bike, guitar lessons — and what you actually need. Our matching engine pairs your Offerings with a neighbor's Seekings, and theirs with yours.",
    "You get what you need. They get what they need. Nobody opens a wallet, and a little more of your neighborhood gets used instead of stored.",
  ],
};

// Illustrative trades, not a feature claim. These used to be named as "Tribes"
// ("Oak Street Tool Share Tribe"), which described groups the app doesn't have.
export const TRIBE_EXAMPLES = [
  {
    image: BRAND.images.tribeCard1,
    title: "A pressure washer for a weekend of pet sitting",
  },
  {
    image: BRAND.images.tribeCard2,
    title: "Outgrown kids' clothes for a box of garden tools",
  },
  {
    image: BRAND.images.tribeCard3,
    title: "Guitar lessons for help hanging drywall",
  },
];

export const NEIGHBORHOOD = {
  title: ["Your Neighborhood Has", "Everything You Need"],
  paragraphs: [
    "Your block already has what you need: Someone has the ladder. You have the baby gear. Another neighbor has the skills your business needs. The problem isn't resources — it's connection. Tribes bridges that instantly.",
    "You don't know who has what. They don't know what you need. Tribes bridges that gap instantly.",
  ],
  stats: [
    { value: "$7,000", target: 7000, prefix: "$", suffix: "", formatWithCommas: true, label: "average value of unused household items¹" },
    {
      value: "Fewer than 5",
      target: null,
      prefix: "",
      suffix: "",
      formatWithCommas: false,
      label: "the number of neighbors most people can identify²",
    },
    {
      value: "67%",
      target: 67,
      prefix: "",
      suffix: "%",
      formatWithCommas: false,
      label: "of Americans wish they knew their neighbors better³",
    },
  ],
};

// The real five-step loop, mirroring the App Store description.
export const HOW_IT_WORKS = {
  title: ["List What You Have.", "Name What You Need."],
  steps: [
    {
      title: "List an Offering",
      text: "Something you can share — a power drill, a sourdough starter, guitar lessons. Snap a photo and Tribes drafts the listing for you.",
    },
    {
      title: "Post a Seeking",
      text: "Something you actually need — a ladder, a babysitter, help moving boxes. Be as specific as you like.",
    },
    {
      title: "Get Matched Automatically",
      text: "Tribes finds neighbors nearby whose Seekings meet your Offerings, and whose Offerings meet your Seekings. You get a notification when a match appears.",
    },
    {
      title: "Chat in the App",
      text: "Work out the details without handing over your phone number. Messages stay in Tribes until you decide otherwise.",
    },
    {
      title: "Trade and Rate",
      text: "Propose the trade, counter-offer if you need to, meet up, mark it complete, and rate each other. Every trade builds your reputation.",
    },
  ],
};

// ⚠️ Only features that actually shipped. The previous list advertised Tribe
// Feeds, Multi-Tribe Participation and address verification — none of which
// exist. The ASO refresh already struck them; this file had never caught up.
export const FEATURES = {
  title: "Built for Real Neighborhoods",
  items: [
    {
      icon: "🔁",
      title: "Two-Way Matching",
      text: "The engine looks for trades that work in both directions, across goods and services alike.",
    },
    {
      icon: "📷",
      title: "Snap and List",
      text: "Take a photo and Tribes drafts the listing — title, description, the lot — so posting takes seconds.",
    },
    {
      icon: "🤝",
      title: "Trade Proposals",
      text: "Propose a trade, send a counter-offer, and track it through to a completion handshake.",
    },
    {
      icon: "💬",
      title: "In-App Messaging",
      text: "Private chat with reactions, editing and archiving. Your phone number stays yours.",
    },
    {
      icon: "⭕",
      title: "Circles",
      text: "Join an invite-only Circle for your street, church or school, and see who in a match you already know.",
    },
    {
      icon: "🛡️",
      title: "Trust and Safety",
      text: "Five-star ratings after every completed trade, plus reporting and blocking always one tap away.",
    },
  ],
};

export const OUR_PEOPLE = {
  title: "We All Need Our People",
  paragraphs: [
    "Humans have always thrived in small, trusted groups. Modern life disconnected us — but the need never disappeared.",
    "Tribes brings back that sense of belonging by helping you trade with the people who already live around you.",
    "Borrow the drill from the neighbor two doors down. Hand your outgrown baby gear to the family who needs it. Swap an afternoon of your skills for an afternoon of theirs.",
    "Join a Circle for your street, your church or your kids' school, and every match tells you who you already have in common.",
  ],
};

// Was "What Kind of Tribe Will You Build?" — a group-creation claim the app
// doesn't support. Now what neighbors actually trade, which it does.
export const TRIBE_TYPES = {
  title: "What Neighbors Are Trading",
  items: [
    {
      icon: "🔧",
      title: "Tools & Equipment",
      text: "Ladders, drills, pressure washers, the tile saw you needed exactly once.",
    },
    {
      icon: "👨‍👩‍👧‍👦",
      title: "Kids' Gear",
      text: "Clothes they outgrew in a season, strollers, car seats, bikes, toys.",
    },
    {
      icon: "💼",
      title: "Skills & Services",
      text: "Photography, tutoring, handyman help, design, accounting, repairs.",
    },
    {
      icon: "🌱",
      title: "Garden & Home",
      text: "Cuttings, compost, planters, furniture, and the surplus from a good harvest.",
    },
    {
      icon: "🤲",
      title: "A Hand With Things",
      text: "Moving boxes, pet sitting, a ride to the airport, watching the house.",
    },
    {
      icon: "🎨",
      title: "Everything Else",
      text: "Books, sports gear, baking, music lessons — whatever your block has to offer.",
    },
  ],
};

export const AUDIENCES = {
  title: "Who Tribes™ Serves",
  items: [
    {
      id: "neighbors",
      icon: "🏘️",
      title: "For Neighbors",
      subtitle:
        "Borrow, lend, help, trade — use Tribes however fits your day.",
      benefits: [
        "Trade for what you need instead of buying it",
        "Put what you already own back to work",
        "Offer a skill and get one back",
        "Build a reputation your neighbors can see",
      ],
      cta: "Learn More",
    },
    {
      id: "partners",
      icon: "🤝",
      title: "For Partners",
      subtitle:
        "Bring your street, congregation, school or club onto Tribes as a Circle.",
      benefits: [
        "Invite your members into a private Circle",
        "Give them a practical reason to show up",
        "Matches inside a Circle carry a trust badge",
        "Circle creation is coming to Tribes Premium",
      ],
      cta: "Learn More",
    },
  ],
};

export const IMPACT = {
  title: "Stronger Trades. Stronger Neighborhoods.",
  paragraphs: [
    "Tribes isn't just about borrowing a drill or finding a babysitter (though it's great for that too). It's about rebuilding the social fabric of our neighborhoods. When you know your neighbors, you know who to call when you need help. You know who can call you. You build resilience, reduce waste, and create the connected community you actually want to live in.",
    "We're starting in Houston and growing block by block.",
  ],
  metrics: [
    { value: "500+", target: 500, suffix: "+", label: "Neighbors Connected" },
    { value: "50+", target: 50, suffix: "+", label: "Circles Forming" },
    // Replaced "Spring 2026 / Launch Date" — that date has passed and the app is
    // public on both stores.
    { value: "Live Now", target: null, suffix: "", label: "On iOS and Android" },
  ],
};

export const TESTIMONIALS = [
  {
    quote:
      "Tribes helped us bring our neighborhood together — we finally have a practical way to share resources and build trust.",
    name: "Sarah Martinez",
    title: "HOA President, Riverside Community",
  },
  {
    quote: "Borrowing tools instead of buying them has saved me hundreds.",
    name: "Michael Chen",
    title: "Tribes Neighbor",
  },
  {
    quote: "Our parents' Circle is the support system we were missing.",
    name: "Jessica Thompson",
    title: "Tribes Neighbor",
  },
];

export const FAQ_ITEMS = [
  {
    question: "How does Tribes actually work?",
    answer:
      "You list what you're Offering and what you're Seeking. Tribes looks for a neighbor whose Seekings match your Offerings — and whose Offerings match your Seekings — then notifies you both. You chat in the app, agree the trade, meet up, and rate each other.",
  },
  {
    question: "Is Tribes available where I live?",
    answer:
      "Tribes is free to download anywhere on iOS and Android. We're opening neighborhoods a few at a time, starting in Houston, so that nobody arrives to an empty marketplace. Download the app and it will tell you where your area stands — and let you know the moment it opens.",
  },
  {
    question: "Does it cost anything?",
    answer:
      "No. Downloading Tribes, listing, matching, chatting and trading are all free. A Tribes Premium tier is coming later for people who want to create their own Circles.",
  },
  {
    question: "Do I need money to trade?",
    answer:
      "No. Tribes is built around two-way trades rather than cash — you and your neighbor agree what a fair swap looks like. There are no payments in the app at all.",
  },
  {
    question: "What is a Circle?",
    answer:
      "An invite-only group inside Tribes for a street, church, school or club. Join one with a link or code from a neighbor, filter your feed down to just that Circle, and see an \"in your Circle\" badge on matches from people you already know. Joining a Circle is free.",
  },
  {
    question: "Can I create my own Circle?",
    answer:
      "Not yet — Circle creation is coming to Tribes Premium. Joining a Circle someone invites you to is free and available now.",
  },
  {
    question: "How is Tribes different from Nextdoor or Facebook groups?",
    answer:
      "Those are feeds you scroll. Tribes is a matching engine: it reads what you have and what you need and finds the specific neighbor who completes the trade. There's no feed to keep up with.",
  },
  {
    question: "Who can see what I post?",
    answer:
      "Neighbors near you, sorted by distance — and if you scope a listing to a Circle, just that Circle. Conversations stay in the app, your phone number stays private, and you're always one tap from reporting or blocking.",
  },
  {
    question: "How old do I have to be?",
    answer: "Tribes is for adults 18 and over.",
  },
];

export const FINAL_CTA = {
  heading: "Get Tribes",
  subheading:
    "Free on iOS and Android. List one thing you're Offering and one thing you're Seeking, and let your block do the rest.",
  prefix: "Join",
  number: "500+",
  suffix: "neighbors already trading on Tribes.",
  // The secondary capture below the download badges. Framed as "tell us where
  // you are" rather than a waitlist gate, because the app itself is open to
  // download — admission is decided in-app, not here.
  waitlist: {
    heading: "Not open in your area yet?",
    body: "Tell us where you are and we'll let you know the moment Tribes opens near you.",
  },
};

export const FOOTER = {
  links: {
    explore: [
      { label: "About Tribes", href: "#what-is-tribes" },
      { label: "Neighbors", href: "/neighbors" },
      { label: "Partners", href: "/partners" },
      { label: "FAQ", href: "#faq" },
    ],
    // ⚠️ These pages existed and were in the sitemap but nothing on the site
    // linked to them. Both app stores point at /privacy and /support, so
    // orphaning them was a trust gap as well as an SEO one.
    legal: [
      { label: "Support", href: "/support" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Delete Account", href: "/delete-account" },
    ],
  },
  email: "info@trytribes.com",
  copyright: `© ${new Date().getFullYear()} Tribes™ — All Rights Reserved`,
  social: [
    { label: "Instagram", href: "https://www.instagram.com/trytribes", icon: "instagram" },
    { label: "TikTok", href: "https://www.tiktok.com/@trytribes", icon: "tiktok" },
    { label: "Facebook", href: "https://www.facebook.com/p/Tribes-Connect-Locally-61580383774896/", icon: "facebook" },
  ],
};
