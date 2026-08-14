"use client";

import { useMemo, useState } from "react";

type Page = "home" | "activities" | "stay" | "transport" | "planner" | "faq";

const nav: { id: Page; label: string }[] = [
  { id: "activities", label: "Things to do" },
  { id: "stay", label: "Stay & eat" },
  { id: "transport", label: "Getting around" },
  { id: "planner", label: "Plan your visit" },
  { id: "faq", label: "Travel essentials" },
];

const activities = [
  { icon: "🌋", name: "Volcano trail", tag: "Outdoor · Family", text: "A guided route to viewpoints near Taniti’s small active volcano." },
  { icon: "🌿", name: "Rainforest hike", tag: "Outdoor · Family", text: "Explore lush tropical forest on a marked, guide-led trail." },
  { icon: "🤿", name: "Yellow Leaf snorkeling", tag: "Outdoor · Family", text: "Calm-water snorkeling near the white-sand beaches of the bay." },
  { icon: "🎣", name: "Chartered fishing tour", tag: "Outdoor", text: "Half-day trips depart from Taniti’s small, protected harbor." },
  { icon: "🖼️", name: "History & arts", tag: "Indoor", text: "Visit the local history museum and independent art galleries." },
  { icon: "🎳", name: "Merriton Landing", tag: "Entertainment", text: "Bowling, an arcade, pubs, a movie theater, and a new dance club." },
];

const restaurants = [
  { name: "Harbor Fish House", cuisine: "Local", detail: "Fresh fish, rice, and a harbor view" },
  { name: "Yellow Leaf Kitchen", cuisine: "Local", detail: "Island staples near the beach" },
  { name: "Rainforest Table", cuisine: "Local", detail: "Seasonal fish and rice bowls" },
  { name: "Volcano View Grill", cuisine: "Local", detail: "Casual local plates" },
  { name: "Taniti Family Café", cuisine: "Local", detail: "Family-style island cooking" },
  { name: "Merriton Diner", cuisine: "American", detail: "Breakfast, burgers, and sandwiches" },
  { name: "Bayfront Grill", cuisine: "American", detail: "Familiar favorites by the water" },
  { name: "Landing Café", cuisine: "American", detail: "All-day casual dining" },
  { name: "Pacific Lantern", cuisine: "Pan-Asian", detail: "Noodles, curries, and shared plates" },
  { name: "Banyan Wok", cuisine: "Pan-Asian", detail: "Quick family-friendly stir-fries" },
];

const lodging = [
  { icon: "🏨", name: "Four-star resort", detail: "Full-service lodging", cost: "Premium", area: "Yellow Leaf Bay" },
  { icon: "🏡", name: "Family-owned hotel", detail: "Smaller independently owned properties", cost: "Mid-range", area: "Throughout Taniti" },
  { icon: "🛏️", name: "Bed & breakfast", detail: "A growing collection of local stays", cost: "Mid-range", area: "Varies by property" },
  { icon: "🎒", name: "Budget hostel", detail: "Simple, inexpensive lodging", cost: "Budget", area: "Varies by property" },
];

type DayPlan = { lodging: string; activity: string; transport: string };

const emptyPlan: DayPlan[] = [
  { lodging: "", activity: "", transport: "" },
  { lodging: "", activity: "", transport: "" },
  { lodging: "", activity: "", transport: "" },
];

const loadSavedPlan = (): DayPlan[] => {
  try {
    const savedPlan = window.localStorage.getItem("taniti-three-day-plan");
    if (!savedPlan) return emptyPlan;
    const parsed = JSON.parse(savedPlan);
    return Array.isArray(parsed) && parsed.length === 3 ? parsed : emptyPlan;
  } catch {
    return emptyPlan;
  }
};

const faqs = [
  ["What currency can I use?", "The U.S. dollar is Taniti’s currency. Many businesses also accept euros and yen, and major credit cards are widely accepted. Banks offer currency exchange."],
  ["What voltage do the outlets use?", "Power outlets are 120 volts—the same voltage used in the United States."],
  ["Is English spoken?", "Many younger Tanitians speak fluent English. Less English is spoken in rural areas, especially by older residents."],
  ["What should I know about safety?", "Violent crime is very rare. As tourism grows, reports of pickpocketing and other petty crime have increased, so keep valuables secure."],
  ["Is medical care available?", "Taniti has one hospital and several clinics. The hospital employs many multilingual staff members."],
  ["Are there holiday closures?", "Taniti has many national holidays. Attractions and restaurants may close, so check ahead when planning your visit."],
  ["What are the alcohol rules?", "Alcohol cannot be served or sold from midnight to 9:00 a.m. The legal drinking age is 18."],
];

function AppIcon({ children }: { children: React.ReactNode }) {
  return <span className="app-icon" aria-hidden="true">{children}</span>;
}

export default function TanitiPrototype() {
  const [page, setPage] = useState<Page>("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [cuisine, setCuisine] = useState("All");
  const [search, setSearch] = useState("");
  const [days, setDays] = useState<DayPlan[]>(loadSavedPlan);
  const [saved, setSaved] = useState(false);

  const go = (next: Page) => {
    setPage(next);
    setMenuOpen(false);
    setSaved(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredRestaurants = useMemo(() => restaurants.filter((restaurant) => {
    const matchesCuisine = cuisine === "All" || restaurant.cuisine === cuisine;
    const haystack = `${restaurant.name} ${restaurant.cuisine} ${restaurant.detail}`.toLowerCase();
    return matchesCuisine && haystack.includes(search.toLowerCase());
  }), [cuisine, search]);

  const updateDay = (index: number, field: "lodging" | "activity" | "transport", value: string) => {
    setDays((current) => current.map((day, dayIndex) => dayIndex === index ? { ...day, [field]: value } : day));
    setSaved(false);
  };

  const savePlan = () => {
    window.localStorage.setItem("taniti-three-day-plan", JSON.stringify(days));
    setSaved(true);
  };

  const completedChoices = days.reduce((total, day) => total + Object.values(day).filter(Boolean).length, 0);

  return (
    <div className="site-shell">
      <header className="header">
        <button className="brand" onClick={() => go("home")} aria-label="Taniti home">
          <span className="brand-mark">T</span>
          <span><strong>Taniti</strong><small>island travel guide</small></span>
        </button>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="site-navigation">
          <span>{menuOpen ? "Close" : "Menu"}</span><b aria-hidden="true">{menuOpen ? "×" : "☰"}</b>
        </button>
        <nav id="site-navigation" className={menuOpen ? "nav open" : "nav"} aria-label="Primary navigation">
          {nav.map((item) => (
            <button key={item.id} onClick={() => go(item.id)} className={page === item.id ? "active" : ""}>{item.label}</button>
          ))}
        </nav>
      </header>

      <main>
        {page === "home" && (
          <>
            <section className="hero">
              <div className="hero-copy">
                <p className="eyebrow">Small island · remarkable variety</p>
                <h1>Find your pace<br />in Taniti.</h1>
                <p>White-sand beaches, rainforest trails, a living volcano, and a warm island welcome—all within easy reach.</p>
                <div className="hero-actions">
                  <button className="button primary" onClick={() => go("activities")}>Explore things to do <span>→</span></button>
                  <button className="button text-button" onClick={() => go("planner")}>Build a 3-day plan</button>
                </div>
              </div>
              <button className="hero-art" onClick={() => go("activities")} aria-label="Explore things to do in Taniti">
                <span className="sun" />
                <span className="island one" />
                <span className="island two" />
                <span className="palm">⌁</span>
                <span className="hero-card"><b>Explore the island</b><small>Beaches · rainforest · volcano</small></span>
              </button>
            </section>
            <section className="quick-grid" aria-label="Popular trip information">
              <button onClick={() => go("activities")}><AppIcon>🌿</AppIcon><span><b>Outdoor adventures</b><small>Family-friendly island experiences</small></span><i>↗</i></button>
              <button onClick={() => go("stay")}><AppIcon>🍽️</AppIcon><span><b>Stay & eat</b><small>Inspected lodging and 10 restaurants</small></span><i>↗</i></button>
              <button onClick={() => go("transport")}><AppIcon>🚌</AppIcon><span><b>Getting around</b><small>Rental cars, buses, taxis, and bikes</small></span><i>↗</i></button>
            </section>
            <section className="intro-strip">
              <p className="eyebrow">About Taniti</p>
              <h2>Less than 500 square miles.<br />More than one way to get away.</h2>
              <p>Taniti is home to about 20,000 people and a landscape that moves from protected harbor to tropical rainforest and mountainous interior.</p>
            </section>
          </>
        )}

        {page === "activities" && (
          <PageSection eyebrow="Things to do" title="Pick your kind of adventure." intro="Outdoor favorites are grouped first, making family activities easy to compare.">
            <div className="callout"><span>👨‍👩‍👧‍👦</span><div><b>Planning for a family?</b><p>Look for the “Family” tag. The volcano trail, rainforest hike, and Yellow Leaf snorkeling are good places to start.</p></div></div>
            <div className="card-grid">
              {activities.map((activity) => <article className="feature-card" key={activity.name}><span className="large-icon">{activity.icon}</span><small>{activity.tag}</small><h3>{activity.name}</h3><p>{activity.text}</p><button onClick={() => go("planner")}>Add to a trip <span>＋</span></button></article>)}
            </div>
          </PageSection>
        )}

        {page === "stay" && (
          <PageSection eyebrow="Stay & eat" title="Comfort for every traveler. Flavor for every appetite." intro="All lodging is regulated and regularly inspected by the Tanitian government.">
            <h2 className="section-heading">Places to stay</h2>
            <div className="lodging-grid">{lodging.map((item) => <article key={item.name}><AppIcon>{item.icon}</AppIcon><div><h3>{item.name}</h3><p>{item.detail}</p><dl className="lodging-meta"><div><dt>Relative cost</dt><dd>{item.cost}</dd></div><div><dt>General area</dt><dd>{item.area}</dd></div></dl></div></article>)}</div>
            <section className="filter-panel" aria-labelledby="restaurant-heading">
              <div><p className="eyebrow">10 restaurants island-wide</p><h2 id="restaurant-heading">Find a restaurant</h2><p>Filter by cuisine or search by name. Taniti has five local, three American, and two Pan-Asian restaurants.</p></div>
              <div className="filter-controls">
                <label><span>Search restaurants</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Try “Pan-Asian”" /></label>
                <label><span>Cuisine</span><select value={cuisine} onChange={(event) => setCuisine(event.target.value)}><option>All</option><option>Local</option><option>American</option><option>Pan-Asian</option></select></label>
              </div>
            </section>
            <p className="result-count" aria-live="polite"><strong>{filteredRestaurants.length}</strong> {filteredRestaurants.length === 1 ? "restaurant" : "restaurants"} found</p>
            <div className="restaurant-grid">{filteredRestaurants.map((restaurant) => <article key={restaurant.name}><small>{restaurant.cuisine}</small><h3>{restaurant.name}</h3><p>{restaurant.detail}</p></article>)}</div>
          </PageSection>
        )}

        {page === "transport" && (
          <PageSection eyebrow="Getting around" title="From touchdown to town, know your options." intro="Almost all visitors arrive by air. Taniti’s airport serves small jets and propeller planes.">
            <section className="transport-spotlight">
              <div><AppIcon>🚙</AppIcon><p className="eyebrow">Arriving by air</p><h2>Rental cars near the airport</h2><p>Pick up a rental car from the local agency near the airport. It is a practical choice for reaching destinations outside Taniti City.</p></div>
              <div><AppIcon>🚌</AppIcon><p className="eyebrow">Daily city service</p><h2>Public buses: 5 a.m.–11 p.m.</h2><p>Public buses serve Taniti City every day. Private buses serve the rest of the island.</p></div>
            </section>
            <div className="transport-grid">
              <article><span>🚕</span><h3>Taxi</h3><p>Available within Taniti City.</p></article>
              <article><span>🚲</span><h3>Bike</h3><p>Rentals include access to helmets, which are required by law.</p></article>
              <article><span>🚶</span><h3>Walk</h3><p>Taniti City is flat and walkable. Merriton Landing is easy to explore on foot.</p></article>
              <article><span>🚢</span><h3>Cruise ship</h3><p>A small ship docks in Yellow Leaf Bay one night per week.</p></article>
            </div>
            <div className="next-step"><div><p className="eyebrow">Ready to put it together?</p><h2>Add transportation without leaving your itinerary.</h2></div><button className="button primary" onClick={() => go("planner")}>Open trip planner →</button></div>
          </PageSection>
        )}

        {page === "planner" && (
          <PageSection eyebrow="Plan your visit" title="Three days. One simple plan." intro="Choose lodging, an activity, and transportation for each day—all without leaving this page.">
            <div className="planner-crosslink"><span>🚌</span><p><b>Need help choosing transportation?</b><br />Compare rental cars, bus hours, taxis, bikes, and walking.</p><button onClick={() => go("transport")}>View getting around →</button></div>
            <div className="progress-row"><span><b>{completedChoices}</b> of 9 choices added</span><div><i style={{ width: `${(completedChoices / 9) * 100}%` }} /></div></div>
            <div className="days">
              {days.map((day, index) => (
                <article className="day-card" key={index}>
                  <header><span>0{index + 1}</span><div><small>Your itinerary</small><h2>Day {index + 1}</h2></div></header>
                  <label><span>Where will you stay?</span><select value={day.lodging} onChange={(event) => updateDay(index, "lodging", event.target.value)}><option value="">Select lodging</option>{lodging.map((item) => <option key={item.name} value={item.name}>{item.name} — {item.cost} — {item.area}</option>)}</select></label>
                  <label><span>What will you do?</span><select value={day.activity} onChange={(event) => updateDay(index, "activity", event.target.value)}><option value="">Select an activity</option>{activities.map((item) => <option key={item.name}>{item.name}</option>)}</select></label>
                  <label><span>How will you get around?</span><select value={day.transport} onChange={(event) => updateDay(index, "transport", event.target.value)}><option value="">Select transportation</option><option>Rental car</option><option>Public bus</option><option>Taxi</option><option>Bike</option><option>Walk</option></select></label>
                </article>
              ))}
            </div>
            <section className="review">
              <div><p className="eyebrow">Review your trip</p><h2>Your Taniti plan</h2><p>Check your choices, then save or print a copy for your trip.</p></div>
              <div className="review-list">{days.map((day, index) => <article key={index}><b>Day {index + 1}</b><span>{day.lodging || "Lodging not selected"}</span><span>{day.activity || "Activity not selected"}</span><span>{day.transport || "Transportation not selected"}</span></article>)}</div>
              <div className="save-panel">
                <div><strong>{completedChoices === 9 ? "Your plan is complete!" : "Save your progress anytime"}</strong><p>Save stores your selections in this browser. Print opens your device’s print dialog. Neither action makes a reservation.</p></div>
                <button onClick={savePlan} className="button primary">♡ Save plan</button>
                <button onClick={() => window.print()} className="button secondary">Print plan</button>
              </div>
              {saved && <p className="success" role="status">✓ Saved in this browser. Your selections will be available when you return on this device.</p>}
            </section>
          </PageSection>
        )}

        {page === "faq" && (
          <PageSection eyebrow="Travel essentials" title="Good to know before you go." intro="Practical answers about money, power, safety, language, and island customs.">
            <div className="essential-pair"><article><span>💵</span><small>Currency</small><h2>U.S. dollar</h2><p>Euros and yen are also accepted by many businesses.</p></article><article><span>🔌</span><small>Electricity</small><h2>120 volts</h2><p>The same voltage used in the United States.</p></article></div>
            <div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span>＋</span></summary><p>{answer}</p></details>)}</div>
          </PageSection>
        )}
      </main>

      <footer>
        <button className="footer-brand" onClick={() => go("home")}><span className="brand-mark">T</span><span><strong>Taniti</strong><small>Find your pace.</small></span></button>
        <div><h2>Plan with confidence.</h2><p>Everything you need for a comfortable island visit, from activities to travel essentials.</p></div>
        <nav aria-label="Footer navigation">{nav.map((item) => <button key={item.id} onClick={() => go(item.id)}>{item.label}</button>)}</nav>
        <p className="source-note">Prototype content adapted from the course-provided “About the Island” document. Taniti is a fictional destination created for this UX design project.</p>
      </footer>
    </div>
  );
}

function PageSection({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: React.ReactNode }) {
  return <section className="page-section"><header className="page-intro"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{intro}</p></header>{children}</section>;
}
