(function () {
  "use strict";
  var C = window.NAVRANG;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var mobile = window.matchMedia("(max-width: 860px)");
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  function get(path) { return path.split(".").reduce(function (o, k) { return o && o[k]; }, C); }
  function esc(s) { var d = document.createElement("div"); d.textContent = s; return d.innerHTML; }

  /* ---- config-driven text ---- */
  $$("[data-cfg]").forEach(function (el) { el.textContent = get(el.getAttribute("data-cfg")) || ""; });

  /* ---- logos (genuine files only; dashed placeholder if missing) ---- */
  $$("[data-logo]").forEach(function (el) {
    var src = C.logos[el.getAttribute("data-logo")], img = new Image();
    img.onload = function () { el.classList.add("has-logo"); el.style.backgroundImage = "url(" + src + ")"; el.style.width = (38 * img.width / img.height + 6) + "px"; };
    img.onerror = function () { el.classList.add("missing"); };
    img.src = src;
  });

  /* ---- images with graceful fallback ---- */
  var credits = [];
  $$("[data-img]").forEach(function (el) {
    var d = get("images." + el.getAttribute("data-img"));
    if (!d) return;
    el.setAttribute("role", "img"); el.setAttribute("aria-label", d.alt);
    if (!d.src) return;
    var img = new Image(); img.alt = d.alt; img.loading = "lazy"; img.decoding = "async";
    img.onload = function () { el.classList.add("has-img"); el.appendChild(img); if (d.credit) credits.push(d.credit); renderCredits(); };
    img.src = d.src;
  });
  function renderCredits() { $("#credits").textContent = credits.length ? "Photo credits: " + credits.join("; ") : ""; }

  /* ---- schedule / info / form options ---- */
  var sched = $("#sched");
  C.days.forEach(function (d) {
    var tr = document.createElement("tr"); if (d.id === C.featuredId) tr.className = "y";
    tr.innerHTML = "<td>" + esc(d.date) + "</td><td>" + esc(d.weekday) + "</td><td><span class='sw' style='background:" + d.hex + "'></span>" + esc(d.colour) + (d.id === C.featuredId ? " (featured)" : "") + "</td><td>" + esc(d.group) + "</td>";
    sched.appendChild(tr);
   
  });
  $("#infoDates").innerHTML = C.days.map(function (d) { return esc(d.short + " " + d.colour); }).join(" &nbsp;/&nbsp; ");
  var fc = $("#footContact");
  var bits = [];
  if (C.contact.email) bits.push("<a href='mailto:" + esc(C.contact.email) + "'>" + esc(C.contact.email) + "</a>");
  C.social.forEach(function (s) { bits.push("<a href='" + esc(s.url) + "' rel='noopener'>" + esc(s.label) + "</a>"); });
  fc.innerHTML = bits.length ? bits.join(" · ") : "<span class='small'>" + esc(C.contact.note) + "</span>";
  if (!C.registrationEnabled) $("#register").hidden = true;
  document.documentElement.classList.add("js");

  /* ---- FAQ ---- */
  var yd = C.days.filter(function (d) { return d.id === C.featuredId; })[0];
  var faqs = [
    ["What is Navratri at SUAS?", "A campus celebration of Navratri organized by " + C.organizer + " at " + C.institution + ", with daily aarti, Garba and Dandiya, and a colour for each day."],
    ["Where is the celebration held?", C.venue + ". A specific address or map location has not been provided."],
    ["When does aarti take place?", "Daily at " + C.aarti.time + ", " + C.aarti.place + "."],
    ["What time is Garba/Dandiya?", "Daily from " + C.garba.time + ". On 15 October the event is scheduled after 2:00 PM IST; exact start and end times are awaiting organizer confirmation."],
    ["Which colour is assigned to each date?", C.days.map(function (d) { return d.short + ": " + d.colour; }).join("; ") + "."],
    ["Which school/group is featured on Yellow Day?", yd.group + " (" + yd.date + ")."],
    ["Is participant registration required for the Navratri celebration?", "Awaiting organizer confirmation. ThinkTank registration is separate (see the ThinkTank FAQs above)."],
    ["Where can official updates be found?", "Official channels are awaiting organizer confirmation."],
    ["Whom should I contact?", C.contact.email || "Contact details are awaiting organizer confirmation."]
  ];
  /* accessible accordions (button + region, arrow/Home/End keys) */
  function buildAcc(root, items) {
    var uid = root.id;
    root.innerHTML = items.map(function (f, i) {
      return "<div class='acc-item'><h4 class='acc-q'><button type='button' class='acc-btn' id='" + uid + "-b" + i + "' aria-expanded='false' aria-controls='" + uid + "-p" + i + "'>" + esc(f[0]) + "</button></h4>" +
        "<div class='acc-panel' id='" + uid + "-p" + i + "' role='region' aria-labelledby='" + uid + "-b" + i + "'><div><p>" + esc(f[1]) + "</p></div></div></div>";
    }).join("");
    var btns = $$(".acc-btn", root);
    $$(".acc-panel", root).forEach(function (p) { p.setAttribute("inert", ""); });
    btns.forEach(function (b, i) {
      b.addEventListener("click", function () {
        var open = b.getAttribute("aria-expanded") === "true", p = b.parentNode.nextSibling;
        b.setAttribute("aria-expanded", !open);
        if (open) p.setAttribute("inert", ""); else p.removeAttribute("inert");
      });
      b.addEventListener("keydown", function (e) {
        var t = null;
        if (e.key === "ArrowDown") t = btns[(i + 1) % btns.length];
        else if (e.key === "ArrowUp") t = btns[(i - 1 + btns.length) % btns.length];
        else if (e.key === "Home") t = btns[0];
        else if (e.key === "End") t = btns[btns.length - 1];
        if (t) { e.preventDefault(); t.focus(); }
      });
    });
  }
  var T = C.thinktank;
  buildAcc($("#faqList"), T.faq);
  buildAcc($("#faqNav"), faqs);

  /* ---- nav ---- */
  var nav = $("#nav"), burger = $("#burger"), menu = $("#menu");
  function onScroll() { nav.classList.toggle("solid", window.scrollY > 40); }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  burger.addEventListener("click", function () { var o = menu.classList.toggle("open"); burger.setAttribute("aria-expanded", o); });
  menu.addEventListener("click", function (e) { if (e.target.tagName === "A") { menu.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); } });

  /* ---- colour deck ---- */
  var deck = $("#deck"), cards = [], order = C.days.map(function (d) { return d.id; }), sel = null, detail = $("#detail");
  C.days.forEach(function (d) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "card" + (d.id === C.featuredId ? " feat" : ""); b.setAttribute("role", "option"); b.dataset.id = d.id;
    b.style.setProperty("--hex", d.hex); b.style.setProperty("--ink", d.ink);
    b.setAttribute("aria-label", d.weekday + " " + d.date + ", " + d.colour + ", " + d.group);
    b.innerHTML = "<span class='orn'></span>" + (d.id === C.featuredId ? "<span class='badge'>FEATURED</span>" : "") +
      "<span><span class='m'>" + esc(d.weekday) + "</span><br><span class='d'>" + esc(d.short.split(" ")[0]) + "</span> <span class='m'>October</span></span>" +
      "<span class='c'>" + esc(d.colour) + " Day</span><span class='g'>" + esc(d.group) + "</span>";
    b.addEventListener("click", function () { select(d.id); });
    b.addEventListener("pointermove", tilt); b.addEventListener("pointerleave", untilt);
    deck.appendChild(b); cards.push(b);
  });
  function byId(id) { return C.days.filter(function (d) { return d.id === id; })[0]; }
  function layout(mode) {
    // order[0] is top of deck (front). mode: "stack" | "fan"
    var n = order.length;
    order.forEach(function (id, i) {
      var el = cards.filter(function (c) { return c.dataset.id === id; })[0], x, y, r, s, z;
      if (i === 0) { x = 0; y = 0; r = 0; s = 1.08; z = 120; }
      else if (mode === "fan") { var t = (i - (n) / 2) / (n / 2); x = t * 190 + 60; y = Math.abs(t) * 30; r = t * 16; s = .92; z = -i * 10; }
      else { x = (i % 2 ? 1 : -1) * (14 + i * 9); y = i * 6; r = (i % 2 ? 1 : -1) * (4 + i * 3); s = 1 - i * .03; z = -i * 14; }
      el.style.zIndex = n - i;
      el.style.setProperty("--x", x + "px"); el.style.setProperty("--y", y + "px"); el.style.setProperty("--r", r + "deg");
      el.style.setProperty("--s", s); el.style.setProperty("--z", z + "px");
    });
  }
  function select(id, quiet) {
    sel = id; var d = byId(id);
    order = [id].concat(order.filter(function (x) { return x !== id; }));
    cards.forEach(function (c) { c.setAttribute("aria-selected", c.dataset.id === id); });
    layout("stack");
    document.documentElement.style.setProperty("--sel", d.hex);
    $("#calendar").style.background = "linear-gradient(180deg," + mix(d.hex) + ",var(--char))";
    detail.innerHTML = "<h3>" + esc(d.colour) + " Day" + (id === C.featuredId ? " · Featured" : "") + "</h3><p><b>" + esc(d.weekday) + ", " + esc(d.date) + "</b></p><p>" + esc(d.group) + "</p>";
  }
  function mix(hex) { return "color-mix(in srgb," + hex + " 28%,#1d0f26)"; }
  function shuffle() {
    if (mobile.matches || reduced) { order = order.slice().sort(function (a, b) { return Math.random() - .5; }); select(C.featuredId); return; }
    var pool = order.slice(); for (var i = pool.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = pool[i]; pool[i] = pool[j]; pool[j] = t; }
    order = pool; layout("fan");
    setTimeout(function () { order = order.slice().sort(function () { return Math.random() - .5; }); layout("stack"); }, 650);
    setTimeout(function () { select(sel || C.featuredId); }, 1300);
  }
  function step(dir) {
    var ids = C.days.map(function (d) { return d.id; }), i = ids.indexOf(sel || C.featuredId);
    select(ids[(i + dir + ids.length) % ids.length]);
  }
  function featured() {
    if (mobile.matches || reduced) { select(C.featuredId); return; }
    layout("fan");
    setTimeout(function () { order = order.filter(function (x) { return x !== C.featuredId; }).reverse(); order.push(C.featuredId); order.reverse(); layout("stack"); }, 700);
    setTimeout(function () { select(C.featuredId); }, 1400);
  }
  function tilt(e) {
    if (reduced || mobile.matches || e.currentTarget.dataset.id !== order[0]) return;
    var b = e.currentTarget, r = b.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
    b.style.transition = "transform .1s"; b.style.transform = "translate3d(var(--x),var(--y),var(--z)) rotate(0) scale(var(--s)) rotateY(" + px * 16 + "deg) rotateX(" + -py * 16 + "deg)";
  }
  function untilt(e) { var b = e.currentTarget; b.style.transition = ""; b.style.transform = ""; }
  $("#shuffle").addEventListener("click", shuffle);
  $("#prev").addEventListener("click", function () { step(-1); });
  $("#next").addEventListener("click", function () { step(1); });
  $("#jumpY").addEventListener("click", function () { select(C.featuredId); });
  deck.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); step(1); cards.filter(function (c) { return c.dataset.id === sel; })[0].focus(); }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); step(-1); cards.filter(function (c) { return c.dataset.id === sel; })[0].focus(); }
  });
  layout("stack"); select(C.featuredId);
  var played = false;
  new IntersectionObserver(function (en, ob) {
    if (en[0].isIntersecting && !played) { played = true; featured(); ob.disconnect(); }
  }, { threshold: .4 }).observe($(".deck-wrap"));
  mobile.addEventListener && mobile.addEventListener("change", function () { select(sel || C.featuredId); });

  /* ---- hero parallax ---- */
  var hero = $(".hero");
  if (!reduced && fine) {
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
      $$("[data-depth]", hero).forEach(function (el) { var d = +el.dataset.depth; el.style.transform = "translate3d(" + (-px * d) + "px," + (-py * d) + "px,0)"; });
    });
  }

  /* ---- scroll effects (cheap, rAF-throttled) ---- */
  var yframe = $(".y-frame"), ticking = false;
  function scrollFx() {
    ticking = false; if (reduced) return;
    var vh = innerHeight;
    var si = $(".story-img").getBoundingClientRect(); $(".story-img").style.transform = "translateY(" + (si.top - vh / 2) * 0.08 + "px)";
    var g = $(".g-ring").getBoundingClientRect(); $(".g-ring").style.transform = "rotate(" + (g.top * .12) + "deg)";
    var c = $(".c-geo").getBoundingClientRect(); $(".c-geo").style.transform = "rotate(" + (-c.top * .08) + "deg) scale(" + (1 + Math.max(0, (vh - c.top)) / vh * .05) + ")";
  }
  addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(scrollFx); } }, { passive: true }); scrollFx();

  /* yellow frame layered tilt */
  if (!reduced && fine) {
    yframe.addEventListener("pointermove", function (e) {
      var r = yframe.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
      $$(".y-layer", yframe).forEach(function (l) { var k = +l.dataset.tiltDepth; l.style.transform = "translate3d(" + px * k * 14 + "px," + py * k * 14 + "px,0)"; });
    });
    yframe.addEventListener("pointerleave", function () { $$(".y-layer", yframe).forEach(function (l) { l.style.transform = ""; }); });
  }

  /* ---- hero sparks (single canvas, bounded pool, pauses off-screen) ---- */
  var cv = $("#sparks"), cx = cv.getContext && cv.getContext("2d"), P = [], visible = true;
  if (cx && !reduced) {
    var N = mobile.matches ? 18 : 40;
    function size() { cv.width = hero.clientWidth; cv.height = hero.clientHeight; }
    size(); addEventListener("resize", size);
    for (var i = 0; i < N; i++) P.push({ x: Math.random() * cv.width, y: Math.random() * cv.height, r: Math.random() * 2 + .6, v: Math.random() * .5 + .15, a: Math.random() * 6.28 });
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) loop(); }).observe(hero);
    var cols = ["#f6b800", "#d6361f", "#ffd966"];
    (function () { })();
    function loop() {
      if (!visible) return;
      cx.clearRect(0, 0, cv.width, cv.height);
      P.forEach(function (p, i) { p.y -= p.v; p.a += .02; p.x += Math.sin(p.a) * .4; if (p.y < -5) { p.y = cv.height + 5; p.x = Math.random() * cv.width; }
        cx.globalAlpha = .7; cx.fillStyle = cols[i % 3]; cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 6.28); cx.fill(); });
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* ---- dandiya cursor ---- */
  if (fine && !reduced) {
    document.documentElement.classList.add("has-cursor");
    var cur = $("#cursor"), A = $(".cs.a", cur), B = $(".cs.b", cur);
    var mx = innerWidth / 2, my = innerHeight / 2, x = mx, y = my, vx = 0, vy = 0, ang = 0;
    var pool = [], PN = 20, pi = 0;
    for (var k = 0; k < PN; k++) { var s = document.createElement("i"); s.className = "spark"; s.setAttribute("aria-hidden", "true"); document.body.appendChild(s); pool.push({ el: s, life: 0, x: 0, y: 0, dx: 0, dy: 0 }); }
    function emit(px, py, n) {
      for (var q = 0; q < n; q++) { var p = pool[pi++ % PN]; p.life = 1; p.x = px; p.y = py; p.dx = (Math.random() - .5) * 2; p.dy = Math.random() * 1.5; p.el.style.background = ["#f6b800", "#d6361f", "#ffd966"][q % 3]; }
    }
    addEventListener("pointermove", function (e) { mx = e.clientX; my = e.clientY; if (Math.random() < .35) emit(mx + 6, my + 14, 1); }, { passive: true });
    addEventListener("pointerdown", function () { emit(mx, my, 6); cur.classList.add("hot"); setTimeout(function () { cur.classList.remove("hot"); }, 160); });
    document.addEventListener("pointerover", function (e) { cur.classList.toggle("hot", !!e.target.closest("a,button,summary,input,select,textarea,label")); });
    (function frame() {
      var nx = x + (mx - x) * .18, ny = y + (my - y) * .18; vx = nx - x; vy = ny - y; x = nx; y = ny;
      ang += (Math.max(-45, Math.min(45, vx * 3)) - ang) * .2;
      cur.style.transform = "translate3d(" + (x + 14) + "px," + (y + 4) + "px,0)";
      A.style.transform = "rotate(" + (-25 + ang) + "deg)"; B.style.transform = "rotate(" + (25 + ang * .6) + "deg) translateX(8px)";
      pool.forEach(function (p) { if (p.life <= 0) return; p.life -= .045; p.x += p.dx; p.y += p.dy;
        p.el.style.opacity = Math.max(p.life, 0); p.el.style.transform = "translate3d(" + p.x + "px," + p.y + "px,0) scale(" + p.life + ")"; });
      requestAnimationFrame(frame);
    })();
  }

  /* ---- ThinkTank: event info + stalls (config-driven) ---- */
  var evRows = [
    ["Date", T.date], ["Venue", T.venue], ["Starts", T.starts, T.startsNote], ["Entry", T.entry],
    ["Who can join", T.eligibility], ["Certificates", T.certificates, T.certificatesNote],
    ["Organized by", T.host], ["Stalls", "Handled by the " + T.stallsBy]
  ];
  $("#evList").innerHTML = evRows.map(function (r) {
    return "<div><dt>" + esc(r[0]) + "</dt><dd>" + esc(r[1]) + (r[2] ? "<small>" + esc(r[2].charAt(0).toUpperCase() + r[2].slice(1)) + "</small>" : "") + "</dd></div>";
  }).join("");
  $("#evDeadline").textContent = T.deadline;
  var sl = $("#stallList");
  sl.innerHTML = (T.stalls && T.stalls.length)
    ? T.stalls.map(function (s) { return "<li><b>" + esc(s.name) + "</b>" + (s.note ? esc(s.note) : "") + "</li>"; }).join("")
    : "<li class='tba'>To be announced. Details will appear here once the organizers and the " + esc(T.stallsBy) + " confirm them.</li>";

  /* ---- Beyond the Stage strip controls ---- */
  var strip = $("#strip");
  function stripGo(dir) { strip.scrollBy({ left: dir * Math.min(strip.clientWidth * .8, 340), behavior: reduced ? "auto" : "smooth" }); }
  $("#stripPrev").addEventListener("click", function () { stripGo(-1); });
  $("#stripNext").addEventListener("click", function () { stripGo(1); });

  /* ---- scroll reveals + progress-driven pieces (all optional; content is visible without them) ---- */
  if (!reduced && "IntersectionObserver" in window) {
    var rio = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); rio.unobserve(x.target); } });
    }, { threshold: .18 });
    $$(".rv, .ta-art, .bd-cats").forEach(function (el) { rio.observe(el); });
  } else { $$(".rv, .ta-art, .bd-cats").forEach(function (el) { el.classList.add("in"); }); }
  var progEls = [
    { host: $("#ideathon-details"), el: $("#ideathon-details") },
    { host: $("#track-b"), el: $("#track-b .tb-type") }
  ];
  function prog() {
    if (reduced) return;
    var vh = innerHeight;
    progEls.forEach(function (o) {
      var r = o.host.getBoundingClientRect();
      var p = Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height * .3)));
      if (o.host.id === "ideathon-details") p = Math.max(0, Math.min(1, (vh - r.top) / (vh * .9)));
      o.el.style.setProperty("--p", p.toFixed(3));
    });
  }
  addEventListener("scroll", prog, { passive: true }); addEventListener("resize", prog); prog();

  /* ---- registration: track selector + two forms ---- */
  var tabs = $$(".tab"), forms = { ideathon: $("#ideathon-form"), openmic: $("#openmic-form") };
  var order2 = ["ideathon", "openmic"];
  function selectTrack(t) {
    order2.forEach(function (k) {
      var on = k === t, tab = $("#tab-" + k);
      tab.setAttribute("aria-selected", on); tab.tabIndex = on ? 0 : -1; forms[k].hidden = !on;
    });
  }
  function goForm(t, cat) {
    selectTrack(t);
    if (cat) { var sel = $("#o-cat"); sel.value = cat; if (sel.value !== cat) sel.value = ""; }
    var f = forms[t];
    f.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    var first = $("input,select,textarea", f);
    setTimeout(function () { try { (first || f).focus({ preventScroll: true }); } catch (e) { f.focus(); } }, reduced ? 0 : 450);
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { selectTrack(tab.dataset.track); });
    tab.addEventListener("keydown", function (e) {
      var n = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") n = tabs[(i + 1) % tabs.length];
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === "Home") n = tabs[0]; else if (e.key === "End") n = tabs[tabs.length - 1];
      if (n) { e.preventDefault(); selectTrack(n.dataset.track); n.focus(); }
    });
  });
  $$("a[data-track]").forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); goForm(a.dataset.track, a.dataset.cat); history.replaceState(null, "", "#" + forms[a.dataset.track].id); });
  });
  function fromHash() {
    var h = location.hash.slice(1);
    if (h === "ideathon-form" || h === "openmic-form") { selectTrack(h === "ideathon-form" ? "ideathon" : "openmic"); forms[h === "ideathon-form" ? "ideathon" : "openmic"].scrollIntoView(); }
  }
  addEventListener("hashchange", fromHash); fromHash();

  /* conditional fields */
  function cond(form, wrap, val, extra) {
    var radios = $$("input[name=participation]", form);
    function upd() {
      var v = (radios.filter(function (r) { return r.checked; })[0] || {}).value;
      wrap.hidden = v !== val;
      if (extra) extra.required = v === val;
    }
    radios.forEach(function (r) { r.addEventListener("change", upd); }); upd();
  }
  cond(forms.ideathon, $("#i-team-wrap"), "Team");
  cond(forms.openmic, $("#o-group-wrap"), "Group", $("#o-count"));

  /* character counters */
  $$(".cnt").forEach(function (c) {
    var ta = $("#" + c.dataset.for), max = ta.maxLength;
    function upd() { c.textContent = ta.value.length + " / " + max; c.classList.toggle("warn", ta.value.length > max * .9); }
    ta.addEventListener("input", upd); upd();
  });

  /* validation + submit (DEMO unless an endpoint is configured; success only if the server confirms) */
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function setErr(f, id, msg) { var e = $("#" + id + "-e", f), inp = $("#" + id, f); if (e) e.textContent = msg; if (inp) inp.setAttribute("aria-invalid", "true"); return false; }
  function clearErr(f) { $$(".err", f).forEach(function (x) { x.textContent = ""; }); $$("[aria-invalid]", f).forEach(function (x) { x.removeAttribute("aria-invalid"); }); }
  function validate(kind, f) {
    clearErr(f);
    var p = kind === "ideathon" ? "i" : "o", ok = true, v = function (id) { return $("#" + p + "-" + id, f).value.trim(); };
    var part = $("input[name=participation]:checked", f);
    function need(id, msg) { if (!v(id)) ok = setErr(f, p + "-" + id, msg); }
    need("name", kind === "ideathon" ? "Enter your full name." : "Enter the participant or group contact name.");
    if (!v("email")) ok = setErr(f, p + "-email", "Enter your college email.");
    else if (!emailRe.test(v("email"))) ok = setErr(f, p + "-email", "Enter a valid email address, like name@college.edu.");
    if (!part) { $("#" + p + "-part-e").textContent = kind === "ideathon" ? "Choose Solo or Team." : "Choose Solo or Group."; ok = false; }
    need("title", kind === "ideathon" ? "Enter your idea title." : "Enter your act title.");
    if (kind === "ideathon") { need("problem", "Describe the problem you want to address."); need("desc", "Add a short description of your idea."); }
    else {
      need("cat", "Choose a performance category."); need("desc", "Add a brief description of your act.");
      if (part && part.value === "Group") { var n = Number(v("count")); if (!v("count") || !Number.isInteger(n) || n < 2) ok = setErr(f, "o-count", "Enter the number of performers (2 or more)."); }
      var link = v("link");
      if (link && !/^https?:\/\/[^\s.]+\.[^\s]+$/i.test(link)) ok = setErr(f, "o-link", "Enter a full link starting with http:// or https://");
    }
    if (!$("#" + p + "-ok", f).checked) ok = setErr(f, p + "-ok", "Tick the box to continue.");
    return ok;
  }
  function collect(f) {
    var d = {}; $$("input,select,textarea", f).forEach(function (el) {
      if (el.closest("[hidden]")) return;
      if (el.type === "radio" && !el.checked) return;
      if (el.type === "checkbox") { d[el.name] = el.checked; return; }
      d[el.name] = el.value.trim();
    }); return d;
  }
  function submitEntry(kind, data) {
    if (!T.registrationEndpoint) return Promise.resolve({ sent: false });
    return fetch(T.registrationEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ track: kind, entry: data }) })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return { sent: true }; });
  }
  if (T.registrationEndpoint) { $("#demoNote").hidden = true; $$(".use").forEach(function (u) { u.textContent = "How your details are used: they are sent to the ThinkTank organizers (ACM SUAS) to manage participation. Only the fields above are collected."; }); }
  order2.forEach(function (kind) {
    var f = forms[kind], btn = $(".submit", f), st = $(".status", f), busy = false;
    f.addEventListener("submit", function (e) {
      e.preventDefault(); if (busy) return;
      st.className = "status"; st.textContent = "";
      if (!validate(kind, f)) {
        var first = $("[aria-invalid]", f) || $(".radios .err:not(:empty)", f);
        if (first) { var tgt = first.matches("input,select,textarea") ? first : $("input", first.parentNode); if (tgt) tgt.focus(); }
        st.textContent = "Fix the highlighted fields and submit again."; return;
      }
      busy = true; btn.disabled = true; btn.setAttribute("aria-disabled", "true"); var label = btn.textContent; btn.textContent = "Submitting…";
      submitEntry(kind, collect(f)).then(function (r) {
        if (r.sent) { st.className = "status ok"; st.textContent = "Your registration was received by the server."; f.reset(); $$(".cnt", f).forEach(function (c) { $("#" + c.dataset.for).dispatchEvent(new Event("input")); }); $$("input[name=participation]", f)[0].dispatchEvent(new Event("change")); }
        else { st.textContent = "Demo only: your entry passed the checks, but nothing was sent, saved or recorded, and you are not registered. Registration will open when the organizers connect it."; }
      }).catch(function () { st.textContent = "We could not reach the registration service, so your entry was not recorded. Please try again."; })
        .then(function () { busy = false; btn.disabled = false; btn.removeAttribute("aria-disabled"); btn.textContent = label; });
    });
  });
})();
