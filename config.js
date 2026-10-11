/* Single source of truth for all event details. Edit here only. */
window.NAVRANG = {
  name: "NAVRANG 2026",
  eventName: "Navratri at SUAS 2026",
  organizer: "ACM SUAS",
  institution: "Symbiosis University of Applied Sciences, Indore",
  venue: "SUAS Campus",
  featuredId: "yellow",
  featuredTiming: "After 2:00 PM IST (exact start and end times awaiting organizer confirmation)",
  aarti: { time: "9:15 AM", place: "Reception Area" },
  garba: { time: "3:30 PM – 4:30 PM", place: "SUAS Campus" },
  contact: { email: "", note: "Official contact details awaiting organizer confirmation." },
  social: [], // add verified links only: { label: "Instagram", url: "https://..." }
  registrationEnabled: true, // demo form only; set false to hide
  days: [
    { id: "white",   date: "12 October 2026", short: "12 Oct", weekday: "Monday",    colour: "White",       hex: "#f4efe6", ink: "#2a2230", group: "School of SAR & DME, DAME (CSR)" },
    { id: "red",     date: "13 October 2026", short: "13 Oct", weekday: "Tuesday",   colour: "Red",         hex: "#c8231f", ink: "#fff4ea", group: "School of LSCM & School of Data Science" },
    { id: "blue",    date: "14 October 2026", short: "14 Oct", weekday: "Wednesday", colour: "Royal Blue",  hex: "#1f3fa8", ink: "#f2f4ff", group: "School of BFSI" },
    { id: "yellow",  date: "15 October 2026", short: "15 Oct", weekday: "Thursday",  colour: "Yellow",      hex: "#f6b800", ink: "#2b1a00", group: "School of DMM & School of RM" },
    { id: "green",   date: "16 October 2026", short: "16 Oct", weekday: "Friday",    colour: "Green",       hex: "#1f7a3d", ink: "#effff3", group: "School of CSIT & AIML" },
    { id: "peacock", date: "19 October 2026", short: "19 Oct", weekday: "Monday",    colour: "Peacock Green", hex: "#0b6e6e", ink: "#e8ffff", group: "Non-Teaching Staff, Registrar Office, HR, Admission, Placement & Accounts" }
  ],

  /* ThinkTank 2026 — confirmed details only. Anything unconfirmed says so. */
  thinktank: {
    name: "ThinkTank 2026",
    host: "ACM SUAS",
    stallsBy: "School of DMM",
    date: "15 October 2026",
    venue: "SUAS Amphitheatre",
    venueFull: "SUAS Amphitheatre, Symbiosis University of Applied Sciences, Indore",
    starts: "After 2:00 PM IST",
    startsNote: "exact timing to be confirmed",
    entry: "Free",
    eligibility: "SUAS students only",
    deadline: "14 October 2026, 3:00 PM IST",
    certificates: "Planned",
    certificatesNote: "final policy to be confirmed",
    /* Registration backend: none is connected yet. Leave "" for the honest frontend demo.
       If you set a URL, the form POSTs JSON and shows success ONLY when the server replies 2xx. */
    registrationEndpoint: "",
    /* Add confirmed stalls/activities here later, e.g. { name: "…", note: "…" }. Empty = "to be announced". */
    stalls: [],
    faq: [
      ["Who can register?", "ThinkTank 2026 is for SUAS students only."],
      ["Is entry free?", "Yes. Entry is free."],
      ["Can I participate solo?", "Yes. Both Ideathon and Open Mic allow solo participation."],
      ["Can I register as a team or group?", "Yes. Ideathon supports team participation, and Open Mic supports group participation."],
      ["Can I participate in both events?", "Yes. Ideathon and Open Mic have separate registration flows, so you can register for either event independently."],
      ["When does registration close?", "Registration closes on 14 October 2026 at 3:00 PM IST."],
      ["When does the event begin?", "The event is scheduled for 15 October 2026 at SUAS Amphitheatre, after 2:00 PM IST. The exact start time is still to be confirmed."],
      ["Will certificates be provided?", "Certificates are planned, but the final distribution policy and eligibility conditions have not yet been confirmed."],
      ["Are food stalls available?", "Stalls and stall-based experiences are being handled by the School of DMM. Specific stall offerings and further details will be announced when confirmed."],
      ["Where is the event?", "SUAS Amphitheatre, Symbiosis University of Applied Sciences, Indore."],
      ["Who is organizing ThinkTank?", "ACM SUAS is hosting ThinkTank 2026. The School of DMM is handling the stalls-related aspect."]
    ]
  },
  /* Logos: drop the official files into assets/ and set the paths. Nothing is drawn or approximated. */
  logos: { acm: "assets/acm-logo.png", suas: "assets/suas-logo.png" },
  /* Photos: add licensed images to assets/img/ and set src + credit. Empty src shows an art-directed fallback. */
  images: {
    hero:    { src: "", alt: "Dancers in colourful chaniya choli performing Garba in a circle", credit: "" },
    story:   { src: "", alt: "Garba dancers in a festive evening circle", credit: "" },
    yellow:  { src: "", alt: "Yellow traditional Indian festive textile", credit: "" },
    aarti:   { src: "", alt: "A lit diya glowing in warm light", credit: "" },
    garba:   { src: "", alt: "Dancers with dandiya sticks mid-step", credit: "" },
    beyond: [
      { src: "", alt: "Food stall at a campus festival", credit: "" },
      { src: "", alt: "Friends sharing food outdoors", credit: "" },
      { src: "", alt: "Festival lights over a campus evening", credit: "" },
      { src: "", alt: "Students gathering and talking on campus", credit: "" },
      { src: "", alt: "Colourful festive decoration", credit: "" }
    ],
    gallery: [
      { src: "", alt: "Close view of dandiya sticks", credit: "" },
      { src: "", alt: "Rangoli pattern in bright powders", credit: "" },
      { src: "", alt: "Festive string lights at dusk", credit: "" },
      { src: "", alt: "Embroidered festive fabric detail", credit: "" }
    ]
  }
};
