const products={
  "hot-6":{name:"Hot Honey-Style Gochujang · Six-pack",price:29.99},
  "lime-6":{name:"Sea Salt + Lime · Six-pack",price:29.99},
  "mix-6":{name:"First Crunch Mix · Six-pack",price:29.99}
};

let cart={};
try{cart=JSON.parse(localStorage.getItem("legumio-cart"))||{}}catch{cart={}}

const cartPanel=document.querySelector("[data-cart]");
const backdrop=document.querySelector("[data-cart-backdrop]");
const cartItems=document.querySelector("[data-cart-items]");
const cartCount=document.querySelector("[data-cart-count]");
const cartTotal=document.querySelector("[data-cart-total]");
const checkout=document.querySelector("[data-checkout]");
let lastFocus=null;

function money(value){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(value)}
function saveCart(){localStorage.setItem("legumio-cart",JSON.stringify(cart))}
function renderCart(){
  const entries=Object.entries(cart).filter(([,qty])=>qty>0);
  const count=entries.reduce((sum,[,qty])=>sum+qty,0);
  const total=entries.reduce((sum,[id,qty])=>sum+products[id].price*qty,0);
  cartCount.textContent=count;
  cartTotal.textContent=money(total);
  checkout.disabled=!entries.length;
  if(!entries.length){cartItems.innerHTML='<p class="empty-cart">Your bag is waiting for something bold.</p>';return}
  cartItems.innerHTML=entries.map(([id,qty])=>`<article class="cart-item"><div><h3>${products[id].name}</h3><span>${money(products[id].price)}</span></div><strong>${money(products[id].price*qty)}</strong><div class="quantity" aria-label="Quantity controls for ${products[id].name}"><button type="button" data-qty="${id}" data-change="-1" aria-label="Decrease quantity">−</button><span>${qty}</span><button type="button" data-qty="${id}" data-change="1" aria-label="Increase quantity">+</button></div><button class="remove-item" type="button" data-remove="${id}">Remove</button></article>`).join("");
}
function openCart(){lastFocus=document.activeElement;cartPanel.classList.add("is-open");cartPanel.setAttribute("aria-hidden","false");backdrop.hidden=false;document.body.classList.add("cart-open");document.querySelector("[data-cart-close]").focus()}
function closeCart(){cartPanel.classList.remove("is-open");cartPanel.setAttribute("aria-hidden","true");backdrop.hidden=true;document.body.classList.remove("cart-open");lastFocus?.focus()}
document.querySelectorAll("[data-add]").forEach(button=>button.addEventListener("click",()=>{const id=button.dataset.add;cart[id]=(cart[id]||0)+1;saveCart();renderCart();openCart()}));
document.querySelector("[data-cart-open]").addEventListener("click",openCart);
document.querySelector("[data-cart-close]").addEventListener("click",closeCart);
backdrop.addEventListener("click",closeCart);
cartItems.addEventListener("click",event=>{const qty=event.target.closest("[data-qty]");const remove=event.target.closest("[data-remove]");if(qty){const id=qty.dataset.qty;cart[id]=Math.max(0,(cart[id]||0)+Number(qty.dataset.change));if(!cart[id])delete cart[id]}if(remove)delete cart[remove.dataset.remove];saveCart();renderCart()});

const modal=document.querySelector("[data-modal]");
const modalContent=document.querySelector("[data-modal-content]");
function showModal(html){modalContent.innerHTML=html;modal.showModal();document.querySelector("[data-modal-close]").focus()}
document.querySelector("[data-modal-close]").addEventListener("click",()=>modal.close());
checkout.addEventListener("click",()=>showModal(`<p class="eyebrow">Simulation complete</p><h2>No payment taken.</h2><p>Your prototype cart contains ${cartCount.textContent} bundle${cartCount.textContent==='1'?'':'s'} totaling ${cartTotal.textContent}. A production store still needs payment, tax, inventory, fulfilment and order-management integrations.</p><button class="button button-dark" type="button" onclick="document.querySelector('[data-modal]').close()">Return to prototype</button>`));

const legal={privacy:`<p class="eyebrow">Placeholder</p><h2>Privacy notice</h2><p>This prototype does not transmit form entries or connect to analytics. Cart data is stored only in your browser using localStorage.</p><h3>Production requirements</h3><p>Before launch, add the operating company, contact details, data categories, purposes, cookies, processors, retention, consumer rights, state disclosures and effective date. Obtain qualified legal review.</p>`,terms:`<p class="eyebrow">Placeholder</p><h2>Terms of use</h2><p>This prototype does not offer products for sale. Prices, inventory, checkout and promotions are demonstrations only.</p><h3>Production requirements</h3><p>Add the legal entity, purchase terms, shipping, returns, subscriptions, intellectual property, disclaimers, limitations, dispute terms and governing law. Obtain qualified legal review.</p>`};
document.querySelectorAll("[data-legal]").forEach(button=>button.addEventListener("click",()=>showModal(legal[button.dataset.legal])));

document.querySelectorAll("[data-simulated-form]").forEach(form=>form.addEventListener("submit",event=>{event.preventDefault();const status=form.querySelector(".form-status");status.textContent=`Thanks—your ${form.dataset.simulatedForm} was validated locally but not submitted.`;form.reset()}));

const menuButton=document.querySelector("[data-menu-button]");
const nav=document.querySelector("[data-nav]");
menuButton.addEventListener("click",()=>{const open=menuButton.getAttribute("aria-expanded")==="true";menuButton.setAttribute("aria-expanded",String(!open));nav.classList.toggle("is-open",!open)});
nav.addEventListener("click",event=>{if(event.target.matches("a")){nav.classList.remove("is-open");menuButton.setAttribute("aria-expanded","false")}});
document.addEventListener("keydown",event=>{if(event.key==="Escape"){if(cartPanel.classList.contains("is-open"))closeCart();if(modal.open)modal.close()}});
renderCart();
