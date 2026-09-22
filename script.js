const products = [
  {id:1,name:"Педали RAZE / TTPRO / TIMETRY",cat:"Педали",brand:"TTPRO",price:150000,badge:"Новинка",type:"pedal"},
  {id:2,name:"Велошлем TTPRO — защита и комфорт",cat:"Шлемы",brand:"TTPRO",price:280000,badge:"Хит",type:"helmet"},
  {id:3,name:"Переключатель задний Shimano RD-R8000-GS ULTEGRA",cat:"Трансмиссия",brand:"Shimano",price:1564000,badge:"Premium",type:"derailleur"},
  {id:4,name:"Кассета Shimano 105 — 11 скоростей",cat:"Трансмиссия",brand:"Shimano",price:720000,badge:"",type:"cassette"},
  {id:5,name:"Гидравлический тормоз TTPRO",cat:"Тормоза",brand:"TTPRO",price:540000,badge:"Новинка",type:"brake"},
  {id:6,name:"Велофара 1200 lm USB-C",cat:"Аксессуары",brand:"VELO",price:195000,badge:"",type:"light"},
  {id:7,name:"Грипсы Liquid Grip Pro",cat:"Аксессуары",brand:"VELO",price:110000,badge:"",type:"grip"},
  {id:8,name:"Цепь KMC X11",cat:"Трансмиссия",brand:"KMC",price:240000,badge:"Хит",type:"chain"}
];

const categories = ["Все","Трансмиссия","Тормоза","Педали","Шлемы","Аксессуары"];
let favorites = JSON.parse(localStorage.getItem("veloFav") || "[]");
let cart = JSON.parse(localStorage.getItem("veloCart") || "[]");
let activeCat = "Все";
let query = "";

const $ = s => document.querySelector(s);
const money = n => new Intl.NumberFormat("ru-RU").format(n) + " сум";

function save(){localStorage.setItem("veloFav",JSON.stringify(favorites));localStorage.setItem("veloCart",JSON.stringify(cart));updateCounters();}
function updateCounters(){
  const fc=favorites.length, cc=cart.reduce((a,b)=>a+b.qty,0);
  ["favCount","favCountTop","bottomFav"].forEach(id=>{const e=$("#"+id);if(e)e.textContent=fc});
  ["cartCount","cartCountTop","bottomCart"].forEach(id=>{const e=$("#"+id);if(e)e.textContent=cc});
}
function svg(type){
  const common=`fill="none" stroke="#b5ffdd" stroke-width="5"`;
  if(type==="pedal") return `<svg viewBox="0 0 220 160"><g ${common}><path d="M50 80h120M80 45v70M140 45v70"/><path d="M25 55h45v22H25zM150 83h45v22h-45z"/><circle cx="80" cy="80" r="9" fill="#17e58a"/><circle cx="140" cy="80" r="9" fill="#17e58a"/></g></svg>`;
  if(type==="helmet") return `<svg viewBox="0 0 220 160"><path ${common} d="M35 100c0-48 25-70 67-70s78 30 83 76H35z"/><path ${common} d="M67 38l12 62M105 31l4 69M143 45l-8 55M35 100h150"/></svg>`;
  if(type==="derailleur") return `<svg viewBox="0 0 220 160"><g ${common}><circle cx="70" cy="70" r="22"/><circle cx="145" cy="112" r="18"/><path d="M83 76l52 22-10-50-43 22z"/><path d="M135 98l45 18-22 22-31-18z"/><path d="M78 52l50-25 28 15"/></g></svg>`;
  if(type==="cassette") return `<svg viewBox="0 0 220 160"><g ${common}><circle cx="110" cy="80" r="57"/><circle cx="110" cy="80" r="35"/><circle cx="110" cy="80" r="13" fill="#17e58a"/><path d="M110 23v114M53 80h114M70 40l80 80M150 40L70 120"/></g></svg>`;
  if(type==="brake") return `<svg viewBox="0 0 220 160"><g ${common}><path d="M55 25h110M75 25v45l-30 55M145 25v45l30 55"/><path d="M45 125h55M120 125h55"/><circle cx="110" cy="75" r="16" fill="#17e58a"/></g></svg>`;
  if(type==="light") return `<svg viewBox="0 0 220 160"><g ${common}><path d="M80 45h60l20 35-20 35H80L60 80z"/><circle cx="110" cy="80" r="25" fill="rgba(23,229,138,.22)"/><path d="M160 60l35-20M165 80h45M160 100l35 20"/></g></svg>`;
  if(type==="grip") return `<svg viewBox="0 0 220 160"><g ${common}><path d="M45 60h130v40H45z"/><path d="M55 60v40M70 60v40M85 60v40M135 60v40M150 60v40M165 60v40"/></g></svg>`;
  return `<svg viewBox="0 0 220 160"><g ${common}><circle cx="75" cy="80" r="48"/><circle cx="145" cy="80" r="28"/><path d="M75 32c20 20 40 35 70 48M75 128c20-20 40-35 70-48"/></g></svg>`;
}
function productCard(p){
  const fav=favorites.includes(p.id);
  return `<article class="product glass" data-id="${p.id}">
    <div class="product-img">${p.badge?`<span class="badge">${p.badge}</span>`:""}<button class="heart ${fav?"active":""}" data-fav="${p.id}">${fav?"♥":"♡"}</button>${svg(p.type)}</div>
    <div class="product-info"><small>${p.brand} • ${p.cat}</small><h3>${p.name}</h3>
      <div class="price-row"><span class="price">${money(p.price)}</span><button class="add" data-add="${p.id}">+ В корзину</button></div>
    </div>
  </article>`;
}
function filtered(){
  return products.filter(p=>(activeCat==="Все"||p.cat===activeCat)&&(`${p.name} ${p.brand} ${p.cat}`).toLowerCase().includes(query.toLowerCase()));
}
function categoriesHTML(){
  return `<div class="chips">${categories.map(c=>`<button class="chip ${activeCat===c?"active":""}" data-cat="${c}">${c}</button>`).join("")}</div>`;
}
function bind(){
  document.querySelectorAll("[data-fav]").forEach(b=>b.onclick=e=>{e.stopPropagation();toggleFav(+b.dataset.fav)});
  document.querySelectorAll("[data-add]").forEach(b=>b.onclick=e=>{e.stopPropagation();addCart(+b.dataset.add)});
  document.querySelectorAll(".product").forEach(c=>c.onclick=()=>openProduct(+c.dataset.id));
  document.querySelectorAll("[data-cat]").forEach(b=>b.onclick=()=>{activeCat=b.dataset.cat;renderCatalog()});
}
function renderHome(){
  $("#view").innerHTML=`<section class="hero glass" id="home">
    <div class="hero-copy"><span class="eyebrow">Tashkent / bike lab / 2026</span><h1>ЕЗДИ.<br><span>ЛОМАЙ.</span><br>ПОВТОРЯЙ.</h1>
      <p>Велозапчасти, которые выдерживают скорость. Премиальные компоненты, аксессуары и всё для следующего выезда.</p>
      <div class="hero-actions"><a class="btn" href="#catalog">Открыть каталог →</a><a class="btn secondary" href="#catalog">Смотреть хиты</a></div></div>
    <div class="hero-visual"><div class="wheel"></div>${bikeSVG()}</div>
  </section>
  <section class="stats"><div class="stat glass"><strong>500+</strong><span>позиций в каталоге</span></div><div class="stat glass"><strong>24/7</strong><span>приём заказов</span></div><div class="stat glass"><strong>Ташкент</strong><span>доставка по городу</span></div><div class="stat glass"><strong>100%</strong><span>оригинальные бренды*</span></div></section>
  <section class="section"><div class="section-head"><div><h2>Свежий дроп</h2><p>То, что только приехало на склад.</p></div><a class="link" href="#catalog">Весь каталог →</a></div><div class="grid">${products.slice(0,4).map(productCard).join("")}</div></section>
  <section class="section"><div class="section-head"><div><h2>Выбери направление</h2><p>Быстрый вход в нужную категорию.</p></div></div><div class="category-grid">
    ${[["Трансмиссия","Цепи, кассеты, переключатели","⚙"],["Тормоза","Контроль скорости на максимум","◉"],["Шлемы","Защита без лишнего веса","◒"],["Аксессуары","Свет, грипсы и мелочи","✦"]].map(x=>`<a class="category glass" href="#catalog" data-category="${x[0]}"><b>${x[0]}</b><span>${x[1]}</span><i class="cat-icon">${x[2]}</i></a>`).join("")}
  </div></section>
  <section class="section promo glass"><div><h2>Готов к следующему выезду?</h2><p>Собери комплект — остальное оставь нам.</p></div><a class="btn" href="#catalog">Собрать →</a></section>`;
  bind();
  document.querySelectorAll("[data-category]").forEach(x=>x.onclick=()=>{activeCat=x.dataset.category;renderCatalog()});
}
function bikeSVG(){return `<svg class="bike-svg" viewBox="0 0 560 330"><g fill="none" stroke="#d8fff0" stroke-width="6"><circle cx="135" cy="235" r="76"/><circle cx="425" cy="235" r="76"/><path d="M135 235l85-105 65 105-150 0 85-105 65 105 55-105h90"/><path d="M220 130l-23-35M185 95h55M285 235l25-108M310 127h58M355 127l35-20"/><path d="M350 127l75 108"/></g><g fill="none" stroke="#17e58a" stroke-width="10"><path d="M220 130l65 105M220 130l-85 105M285 235l140 0"/></g><circle cx="285" cy="235" r="12" fill="#17e58a"/></svg>`}
function renderCatalog(){
  $("#view").innerHTML=`<section class="page"><span class="eyebrow">SHOP / 01</span><h1 class="page-title">Каталог</h1><p style="color:var(--muted)">Компоненты для городских, MTB и шоссейных велосипедов.</p>${categoriesHTML()}<div class="toolbar"><input class="select" id="catalogSearch" placeholder="Поиск по каталогу..." value="${query}"><select class="select" id="sort"><option value="default">Сортировка</option><option value="low">Сначала дешевле</option><option value="high">Сначала дороже</option></select></div><div class="grid" id="productGrid">${filtered().map(productCard).join("")}</div></section>`;
  bind();
  $("#catalogSearch").oninput=e=>{query=e.target.value;renderCatalog()};
  $("#sort").onchange=e=>{let a=filtered();if(e.target.value==="low")a.sort((x,y)=>x.price-y.price);if(e.target.value==="high")a.sort((x,y)=>y.price-x.price);$("#productGrid").innerHTML=a.map(productCard).join("");bind()};
}
function renderFavorites(){
  const list=products.filter(p=>favorites.includes(p.id));
  $("#view").innerHTML=`<section class="page"><span class="eyebrow">SAVED / 02</span><h1 class="page-title">Избранные</h1><p style="color:var(--muted)">Сохранил — значит вернёшься.</p>${list.length?`<div class="grid">${list.map(productCard).join("")}</div>`:`<div class="empty glass"><div class="empty-icon">♡</div><h2>Пока пусто</h2><p>Нажимай сердечко на товаре, чтобы сохранить его.</p><a class="btn" href="#catalog">В каталог</a></div>`}</section>`;bind();
}
function renderCart(){
  const items=cart.map(i=>({...products.find(p=>p.id===i.id),qty:i.qty}));
  const total=items.reduce((s,p)=>s+p.price*p.qty,0);
  $("#view").innerHTML=`<section class="page"><span class="eyebrow">CHECKOUT / 03</span><h1 class="page-title">Корзина</h1><p style="color:var(--muted)">Проверь комплект перед заказом.</p>${items.length?`<div class="cart-layout"><div class="cart-list glass">${items.map(p=>`<div class="cart-item"><div class="thumb">${svg(p.type)}</div><div><small>${p.brand} • ${p.cat}</small><h3>${p.name}</h3><strong>${money(p.price)}</strong></div><div><div class="qty"><button data-minus="${p.id}">−</button><b>${p.qty}</b><button data-plus="${p.id}">+</button></div><button class="link remove" data-remove="${p.id}" style="border:0;background:none;margin-top:8px">Удалить</button></div></div>`).join("")}</div><aside class="summary glass"><h2>Итого</h2><div class="sum-row"><span>Товары</span><b>${money(total)}</b></div><div class="sum-row"><span>Доставка</span><span>Рассчитаем при заказе</span></div><div class="sum-row sum-total"><span>К оплате</span><span>${money(total)}</span></div><button class="btn full" id="orderBtn">Оформить заказ →</button></aside></div>`:`<div class="empty glass"><div class="empty-icon">▱</div><h2>Корзина пуста</h2><p>Добавь что-нибудь для следующего апгрейда.</p><a class="btn" href="#catalog">Открыть каталог</a></div>`}</section>`;
  document.querySelectorAll("[data-plus]").forEach(b=>b.onclick=()=>changeQty(+b.dataset.plus,1));
  document.querySelectorAll("[data-minus]").forEach(b=>b.onclick=()=>changeQty(+b.dataset.minus,-1));
  document.querySelectorAll("[data-remove]").forEach(b=>b.onclick=()=>removeCart(+b.dataset.remove));
  const order=$("#orderBtn");if(order)order.onclick=()=>{toast("Заявка принята — менеджер свяжется с вами");};
}
function toggleFav(id){favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];save();toast(favorites.includes(id)?"Добавлено в избранные":"Удалено из избранных");route();}
function addCart(id){const x=cart.find(i=>i.id===id);x?x.qty++:cart.push({id,qty:1});save();toast("Товар добавлен в корзину");}
function changeQty(id,d){const x=cart.find(i=>i.id===id);if(!x)return;x.qty+=d;if(x.qty<=0)cart=cart.filter(i=>i.id!==id);save();renderCart()}
function removeCart(id){cart=cart.filter(i=>i.id!==id);save();renderCart()}
function openProduct(id){const p=products.find(x=>x.id===id);$("#productModal").innerHTML=`<button class="icon-btn modal-close" id="modalClose">×</button><div class="modal-content"><div class="modal-art">${svg(p.type)}</div><div><span class="eyebrow">${p.brand} / ${p.cat}</span><h2>${p.name}</h2><div class="price">${money(p.price)}</div><p class="modal-meta">Компонент для апгрейда велосипеда. Подходит для регулярной эксплуатации и активных выездов.</p><button class="btn full" id="modalAdd">Добавить в корзину →</button></div></div>`;$("#modalBackdrop").classList.add("open");$("#modalClose").onclick=closeModal;$("#modalAdd").onclick=()=>{addCart(id);closeModal()}}
function closeModal(){$("#modalBackdrop").classList.remove("open")}
function toast(t){const e=$("#toast");e.textContent=t;e.classList.add("show");clearTimeout(window.__toast);window.__toast=setTimeout(()=>e.classList.remove("show"),1800)}
function route(){
  const r=location.hash.replace("#","")||"home";
  document.querySelectorAll("[data-route]").forEach(x=>x.classList.toggle("active",x.dataset.route===r));
  if(r==="catalog")renderCatalog();else if(r==="favorites")renderFavorites();else if(r==="cart")renderCart();else renderHome();
  updateCounters();window.scrollTo({top:0,behavior:"smooth"});
}
$("#searchBtn").onclick=()=>{$("#searchPanel").classList.toggle("open");if($("#searchPanel").classList.contains("open"))$("#searchInput").focus()};
$("#closeSearch").onclick=()=>$("#searchPanel").classList.remove("open");
$("#searchInput").oninput=e=>{query=e.target.value;location.hash="catalog"};
$("#favBtn").onclick=()=>location.hash="favorites";$("#cartBtn").onclick=()=>location.hash="cart";
$("#mobileMenu").onclick=()=>document.querySelector(".desktop-nav").classList.toggle("mobile-open");
$("#modalBackdrop").onclick=e=>{if(e.target.id==="modalBackdrop")closeModal()};
window.addEventListener("keydown",e=>{if(e.key==="Escape"){$("#searchPanel").classList.remove("open");closeModal()}});
window.addEventListener("hashchange",route);
updateCounters();route();
