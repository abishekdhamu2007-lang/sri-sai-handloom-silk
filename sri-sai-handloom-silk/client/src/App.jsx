import { useEffect, useMemo, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const WA = import.meta.env.VITE_WHATSAPP || "916381530958";
const PHONE = "+91 63815 30958";
const ADDRESS = "Dharapuram Pudhur, Kadayampatti (Tk), Salem (Dt), Tamil Nadu";

const FALLBACK = [
  {
    _id: "1",
    name: "Temple Border Kanchipuram",
    fabric: "Kanchipuram",
    price: 18500,
    colors: ["#7a1230", "#c9a24b"],
    note: "Pure mulberry silk, real zari border",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Model wearing a deep purple saree with a gold border",
  },
  {
    _id: "2",
    name: "Peacock Arani Silk",
    fabric: "Arani",
    price: 9800,
    colors: ["#0f5c5a", "#d9b45a"],
    note: "Light drape, woven in Arani",
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Model wearing a red saree with a gold border",
  },
  {
    _id: "3",
    name: "Salem Soft Silk Checks",
    fabric: "Salem",
    price: 6400,
    colors: ["#23305e", "#e8d9b0"],
    note: "Everyday silk, easy to care for",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/01/Full-body_photograph_of_Vaishnavi_Chouhan_in_saree%2C_Jaipur_%282025%29.jpg/960px-Full-body_photograph_of_Vaishnavi_Chouhan_in_saree%2C_Jaipur_%282025%29.jpg",
    imageAlt: "Model wearing a purple saree with a pink and gold border",
    imageCredit: "Vikas Tanwar",
    imageLicense: "CC BY-SA 4.0",
    imageLicenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    imageCreditUrl: "https://commons.wikimedia.org/wiki/File:Full-body_photograph_of_Vaishnavi_Chouhan_in_saree,_Jaipur_(2025).jpg",
  },
  {
    _id: "4",
    name: "Mango Motif Kanchipuram",
    fabric: "Kanchipuram",
    price: 22000,
    colors: ["#b3541e", "#f0c75e"],
    note: "Bridal weight, contrast pallu",
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/64/Side_profile_of_Vaishnavi_Chouhan_in_traditional_Indian_attire%2C_Jaipur_%282025%29.jpg/960px-Side_profile_of_Vaishnavi_Chouhan_in_traditional_Indian_attire%2C_Jaipur_%282025%29.jpg",
    imageAlt: "Model wearing a blue saree with a silver border",
    imageCredit: "Vikas Tanwar",
    imageLicense: "CC BY-SA 4.0",
    imageLicenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    imageCreditUrl: "https://commons.wikimedia.org/wiki/File:Side_profile_of_Vaishnavi_Chouhan_in_traditional_Indian_attire,_Jaipur_(2025).jpg",
  },
];

const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");
const itemKey = (product) => String(product._id || product.name);

function getWhatsAppAppUrl(text) {
  return `whatsapp://send?phone=${WA}&text=${encodeURIComponent(text)}`;
}

function getWhatsAppWebUrl(text) {
  return `https://web.whatsapp.com/send?phone=${WA}&text=${encodeURIComponent(text)}`;
}

function getWhatsAppUniversalUrl(text) {
  return `https://api.whatsapp.com/send?phone=${WA}&text=${encodeURIComponent(text)}`;
}

function WhatsAppIcon({ size = 18, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle" }}
      aria-hidden="true"
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm0 18.17c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 01-1.26-4.4c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 012.41 5.83c0 4.54-3.7 8.25-8.23 8.25zm4.52-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.35-.77-1.85c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.78 2.72 4.31 3.81.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.18-.47-.3z" />
    </svg>
  );
}

function formatCartWhatsAppMessage({
  cart,
  customerName = "",
  customerPhone = "",
  address = "",
  city = "",
  pincode = "",
  paymentMethod = "Google Pay / PhonePe / UPI",
  notes = "",
}) {
  const total = cart.reduce((sum, entry) => sum + Number(entry.product.price) * entry.quantity, 0);
  const totalItems = cart.reduce((sum, entry) => sum + entry.quantity, 0);
  const divider = "━━━━━━━━━━━━━━━━━━━━━━";

  const lines = [
    "🛍️ *NEW ORDER - SRI SAI HANDLOOM SILK*",
    divider,
  ];

  if (customerName.trim()) {
    lines.push(`👤 *Customer:* ${customerName.trim()}`);
  }
  if (customerPhone.trim()) {
    lines.push(`📞 *Phone:* ${customerPhone.trim()}`);
  }
  if (address.trim() || city.trim() || pincode.trim()) {
    const loc = [address.trim(), city.trim(), pincode.trim() ? `PIN: ${pincode.trim()}` : ""].filter(Boolean).join(", ");
    lines.push(`📍 *Delivery Address:* ${loc}`);
  }
  if (paymentMethod) {
    lines.push(`💳 *Payment Preference:* ${paymentMethod}`);
  }

  lines.push("", `📦 *Ordered Sarees (${totalItems} items):*`);
  cart.forEach(({ product, quantity }, idx) => {
    const lineTotal = Number(product.price) * quantity;
    lines.push(`${idx + 1}. *${product.name}* (${product.fabric || "Pure Silk"})`);
    lines.push(`   Qty: ${quantity} × ${inr(product.price)} = ${inr(lineTotal)}`);
  });

  lines.push(divider);
  lines.push(`💰 *Total Amount:* ${inr(total)}`);

  if (notes.trim()) {
    lines.push(`📝 *Customization / Note:* ${notes.trim()}`);
  }

  lines.push("", "🙏 Please confirm saree availability & share payment details. Thank you!");
  return lines.join("\n");
}

function formatSingleSareeWhatsApp(product, quantity = 1, note = "") {
  const total = Number(product.price) * quantity;
  const divider = "━━━━━━━━━━━━━━━━━━━━━━";
  const lines = [
    "🛍️ *DIRECT SAREE ORDER - SRI SAI HANDLOOM SILK*",
    divider,
    `🥻 *Saree:* ${product.name}`,
    `🧵 *Fabric:* ${product.fabric || "Pure Silk"}`,
    `🔢 *Quantity:* ${quantity}`,
    `💰 *Price:* ${inr(product.price)} ${quantity > 1 ? `(Total: ${inr(total)})` : ""}`,
  ];
  if (product.note) {
    lines.push(`ℹ️ *Details:* ${product.note}`);
  }
  if (note.trim()) {
    lines.push(`📝 *Custom Request:* ${note.trim()}`);
  }
  lines.push(divider);
  lines.push("Please confirm if this saree is in stock and share UPI / payment details to proceed. Thank you!");
  return lines.join("\n");
}

function formatVideoCallMessage(sareeName = "") {
  const divider = "━━━━━━━━━━━━━━━━━━━━━━";
  const lines = [
    "📹 *WHATSAPP VIDEO CALL REQUEST - SRI SAI HANDLOOM SILK*",
    divider,
  ];
  if (sareeName) {
    lines.push(`Hello! I would like to view the *${sareeName}* saree live over WhatsApp video call.`);
  } else {
    lines.push("Hello! I would like to schedule a live WhatsApp Video Call to view your handloom sarees and real zari work.");
  }
  lines.push("Please let me know a suitable time for the live showcase. Thank you!");
  return lines.join("\n");
}

function WhatsAppConnectModal({ data, onClose }) {
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  if (!data) return null;

  const { title = "Order on WhatsApp", message = "" } = data;
  const encodedMsg = encodeURIComponent(message);
  
  const webUrl = `https://web.whatsapp.com/send?phone=${WA}&text=${encodedMsg}`;
  const apiUrl = `https://api.whatsapp.com/send?phone=${WA}&text=${encodedMsg}`;
  const appUrl = `whatsapp://send?phone=${WA}&text=${encodedMsg}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(apiUrl)}`;

  function copyText() {
    navigator.clipboard?.writeText(message).then(() => {
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2500);
    });
  }

  function copyNumber() {
    navigator.clipboard?.writeText("6381530958").then(() => {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2500);
    });
  }

  return (
    <div className="dialog-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section className="dialog wa-connect-modal" role="dialog" aria-modal="true" aria-labelledby="wa-modal-title">
        <button className="dialog-close" type="button" aria-label="Close" onClick={onClose}>×</button>
        
        <div className="wa-modal-header">
          <div className="wa-modal-badge">
            <WhatsAppIcon size={20} />
            <span>Sri Sai Handloom Silk · WhatsApp Orders</span>
          </div>
          <h2 id="wa-modal-title">{title}</h2>
          <p className="wa-modal-number">WhatsApp &amp; Call: <strong>{PHONE}</strong></p>
        </div>

        <div className="wa-modal-body">
          {/* Option 1: Mobile Phone Scan (100% Guaranteed to work on every computer) */}
          <div className="wa-qr-card">
            <div className="wa-qr-image-wrap">
              <img
                src={qrUrl}
                alt={`QR code to order on WhatsApp with ${PHONE}`}
                className="wa-qr-code"
                loading="eager"
              />
            </div>
            <div className="wa-qr-info">
              <span className="wa-pill-recommend">⭐ 100% Working on Phone</span>
              <h3>Scan with Your Phone Camera or WhatsApp</h3>
              <p>
                Point your mobile phone camera or WhatsApp scanner at this QR code. It instantly opens this chat on your phone with the saree details ready to send!
              </p>
            </div>
          </div>

          {/* Option 2: Browser & Desktop App Direct Links */}
          <div className="wa-links-card">
            <h3>Or Open on this Computer:</h3>
            
            <div className="wa-action-grid">
              <a
                className="btn btn-whatsapp wa-action-card-btn"
                href={webUrl}
                target="_blank"
                rel="noreferrer"
              >
                <WhatsAppIcon size={18} />
                <span>Open in <strong>WhatsApp Web</strong></span>
              </a>

              <a
                className="btn btn-whatsapp-outline wa-action-card-btn"
                href={apiUrl}
                target="_blank"
                rel="noreferrer"
              >
                🔗 <span>Open <strong>wa.me</strong> Link</span>
              </a>

              <a
                className="btn outline wa-action-card-btn"
                href={appUrl}
                onClick={() => {
                  window.location.href = appUrl;
                }}
              >
                🖥️ <span>Open in <strong>Desktop App</strong></span>
              </a>
            </div>

            <a
              className="btn btn-store-install"
              href="ms-windows-store://pdp/?productid=9NKSQGP7F2NH"
              target="_blank"
              rel="noreferrer"
            >
              📥 <span>Need WhatsApp on your PC? <strong>Install WhatsApp for Windows</strong> (Free from Microsoft Store)</span>
            </a>

            {/* Note about the Chrome 'Update Chrome' error */}
            <div className="wa-chrome-notice">
              <span className="notice-icon">💡</span>
              <div>
                <strong>Notice about your screenshot ("Download Chrome"):</strong>
                <p>
                  The "Update Chrome" page downloads Google Chrome browser, <strong>not WhatsApp</strong>. To use WhatsApp on your PC, click <strong>"Install WhatsApp for Windows"</strong> above, or simply <strong>scan the QR code above with your mobile phone</strong> to order instantly!
                </p>
              </div>
            </div>
          </div>

          {/* Option 3: Manual Message & Phone Copy */}
          <div className="wa-copy-card">
            <div className="wa-copy-header">
              <span>Order Details Preview:</span>
              <div className="copy-btn-group">
                <button type="button" className="btn copy-order-btn" onClick={copyText}>
                  {copiedMessage ? "✓ Order Copied!" : "📋 Copy Order Slip"}
                </button>
                <button type="button" className="btn copy-order-btn" onClick={copyNumber}>
                  {copiedPhone ? "✓ Number Copied!" : "📞 Copy Number (6381530958)"}
                </button>
              </div>
            </div>
            <pre className="wa-message-preview">{message}</pre>
          </div>
        </div>
      </section>
    </div>
  );
}

function LoginPage({ mode, onModeChange, onSubmit, onGuest, busy, checking, error }) {
  const isRegister = mode === "register";

  return (
    <main className="login-page">
      <section className="login-photo">
        <img
          src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1400&q=85"
          alt="Model wearing a beautiful purple silk saree with gold zari"
        />
        <div className="login-photo-copy">
          <p className="eyebrow">Woven with love in Tamil Nadu</p>
          <h1>Every thread tells a story.</h1>
          <p>Find a saree that makes your special moments unforgettable.</p>
        </div>
      </section>

      <section className="login-panel" aria-labelledby="login-title">
        <a className="login-brand" href="#home">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/52/Shirdi_Sai_Baba_portrait.jpg"
            alt="Portrait of Shirdi Sai Baba"
          />
          <span className="login-brand-name">Sri Sai</span>
          <span className="login-brand-subtitle">Handloom Silk</span>
        </a>
        <div className="login-form-wrap">
          <p className="eyebrow">{isRegister ? "Join our handloom family" : "Welcome to our store"}</p>
          <h2 id="login-title">{isRegister ? "Create your account" : "Sign in to your account"}</h2>
          <p className="login-intro">A little tradition, a lot of elegance.</p>

          <div className="auth-tabs" role="group" aria-label="Account options">
            <button type="button" className={!isRegister ? "active" : ""} onClick={() => onModeChange("login")}>Sign in</button>
            <button type="button" className={isRegister ? "active" : ""} onClick={() => onModeChange("register")}>Create account</button>
          </div>

          <form className="auth-form" onSubmit={onSubmit}>
            {isRegister && (
              <label>
                Your name
                <input name="name" type="text" autoComplete="name" maxLength="80" required />
              </label>
            )}
            <label>
              Email address
              <input name="email" type="email" autoComplete="email" maxLength="254" required />
            </label>
            <label>
              Password
              <input
                name="password"
                type="password"
                autoComplete={isRegister ? "new-password" : "current-password"}
                minLength="8"
                maxLength="72"
                required
              />
              {isRegister && <span className="field-hint">Use at least 8 characters.</span>}
            </label>
            {error && <p className="auth-message" role="alert">{error}</p>}
            <button className="btn auth-submit" type="submit" disabled={busy || checking}>
              {checking ? "Checking your account…" : busy ? "Please wait…" : isRegister ? "Create account" : "Sign in"}
            </button>
          </form>

          <div className="guest-option">
            <span>Just looking?</span>
            <button type="button" onClick={onGuest}>Browse the sarees as a guest</button>
          </div>
        </div>
        <p className="login-footer">Handwoven with care · Salem, Tamil Nadu · WhatsApp: {PHONE}</p>
      </section>
    </main>
  );
}

function Hero({ cartCount, onCart, user, onLogin, onLogout, onWhatsApp }) {
  const heroMsg = "Hello Sri Sai Handloom Silk! I am browsing your website and would like to order pure silk sarees.";

  return (
    <header className="hero">
      <img
        className="hero-image"
        src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1800&q=85"
        alt="Model wearing a traditional silk saree"
      />
      
      <div className="top-nav-bar">
        <button
          type="button"
          onClick={() => onWhatsApp(heroMsg, "WhatsApp Quick Contact")}
          className="header-wa-badge"
          title={`Order on WhatsApp: ${PHONE}`}
        >
          <WhatsAppIcon size={16} />
          <span>WhatsApp Orders: <strong>{PHONE}</strong></span>
        </button>

        <div className="header-actions">
          <button className="cart-trigger" type="button" onClick={onCart}>
            Cart <span className="cart-count">{cartCount}</span>
          </button>
          <div className="account-actions">
            {user ? (
              <>
                <span className="account-greeting">Namaste, {user.name}</span>
                <button className="account-button" type="button" onClick={onLogout}>Sign out</button>
              </>
            ) : (
              <button className="account-button" type="button" onClick={onLogin}>Sign in</button>
            )}
          </div>
        </div>
      </div>

      <div className="hero-text">
        <img
          className="hero-sai-image"
          src="https://upload.wikimedia.org/wikipedia/commons/5/52/Shirdi_Sai_Baba_portrait.jpg"
          alt="Shirdi Sai Baba"
        />
        <span className="hero-brand-name">Sri Sai</span>
        <span className="hero-brand-subtitle">Handloom Silk</span>
        <p className="eyebrow">Tradition, woven with love</p>
        <h1>Handwoven with devotion</h1>
        <p>Discover authentic handwoven Kanchipuram, Arani and Salem silk sarees directly from our master weavers in Salem.</p>
        
        <div className="hero-cta-group">
          <a className="btn" href="#collection">Explore Collection</a>
          <button
            type="button"
            className="btn btn-whatsapp"
            onClick={() => onWhatsApp("Hello Sri Sai Handloom Silk! I would like to order pure silk sarees on WhatsApp.", "Order on WhatsApp")}
          >
            <WhatsAppIcon size={18} /> Order on WhatsApp ({PHONE})
          </button>
        </div>
      </div>
    </header>
  );
}

function Card({ p, onOpen, onAdd, onWhatsApp }) {
  const sareeMsg = formatSingleSareeWhatsApp(p, 1);

  return (
    <article className="card">
      <button
        className="product-image-button"
        type="button"
        aria-label={`Open ${p.name} details`}
        onClick={() => onOpen(p)}
      >
        <img className="product-image" src={p.image} alt={p.imageAlt || `${p.name} saree`} loading="lazy" />
        <span className="fabric-tag">{p.fabric}</span>
        <span className="image-hint">View details</span>
      </button>
      <div className="card-body">
        <h3>{p.name}</h3>
        <p className="muted">{p.note}</p>
        <div className="row">
          <strong className="price-tag">{inr(p.price)}</strong>
          {p.colors && p.colors.length > 0 && (
            <div className="color-dots" title="Available shades">
              {p.colors.map((c, i) => (
                <span key={i} className="color-dot" style={{ backgroundColor: c }} />
              ))}
            </div>
          )}
        </div>
        <div className="card-actions">
          <button className="btn ghost" type="button" onClick={() => onOpen(p)} title="View saree details">
            Details
          </button>
          <button className="btn outline" type="button" onClick={() => onAdd(p)} title="Add to shopping cart">
            + Cart
          </button>
          <button
            type="button"
            className="btn btn-whatsapp btn-card-wa"
            onClick={() => onWhatsApp(sareeMsg, `Order: ${p.name}`)}
            title="Order this saree on WhatsApp"
          >
            <WhatsAppIcon size={15} /> Order
          </button>
        </div>
      </div>
    </article>
  );
}

function ProductDialog({ product, onClose, onAdd, onWhatsApp }) {
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");

  if (!product) return null;

  const orderMsg = formatSingleSareeWhatsApp(product, qty, note);
  const videoMsg = formatVideoCallMessage(product.name);

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="dialog product-dialog" role="dialog" aria-modal="true" aria-labelledby="product-dialog-title">
        <button className="dialog-close" type="button" aria-label="Close product details" onClick={onClose}>×</button>
        <img className="dialog-image" src={product.image} alt={product.imageAlt || `${product.name} saree`} />
        <div className="dialog-content">
          <p className="eyebrow">{product.fabric} Handloom Silk</p>
          <h2 id="product-dialog-title">{product.name}</h2>
          <p className="muted">{product.note}</p>
          
          <div className="dialog-price-row">
            <span className="dialog-price">{inr(Number(product.price) * qty)}</span>
            {qty > 1 && <span className="unit-price">({inr(product.price)} each)</span>}
          </div>

          <div className="saree-options-box">
            <label className="qty-label">
              <span>Quantity:</span>
              <div className="quantity-control">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
                <span>{qty}</span>
                <button type="button" onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">+</button>
              </div>
            </label>

            <label className="custom-note-label">
              <span>Custom requests (e.g. Falls &amp; Pico, blouse cutting, gift box):</span>
              <input
                type="text"
                placeholder="Any special requests for the weaver..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </label>
          </div>

          {product.imageCredit && (
            <p className="photo-credit">
              Photo: {product.imageCredit} ·{" "}
              <a href={product.imageLicenseUrl} target="_blank" rel="noreferrer">{product.imageLicense}</a> ·{" "}
              <a href={product.imageCreditUrl} target="_blank" rel="noreferrer">image source</a>
            </p>
          )}

          <div className="dialog-action-buttons">
            <button
              type="button"
              className="btn btn-whatsapp full-width"
              onClick={() => {
                onClose();
                onWhatsApp(orderMsg, `Order: ${product.name}`);
              }}
            >
              <WhatsAppIcon size={18} /> Order on WhatsApp ({PHONE})
            </button>

            <div className="dialog-secondary-buttons">
              <button
                className="btn ghost full-width"
                type="button"
                onClick={() => {
                  for (let i = 0; i < qty; i++) {
                    onAdd(product);
                  }
                  onClose();
                }}
              >
                + Add {qty > 1 ? `${qty} Sarees` : "to Cart"}
              </button>
              <button
                type="button"
                className="btn video-call-btn"
                onClick={() => {
                  onClose();
                  onWhatsApp(videoMsg, `Live Video Call: ${product.name}`);
                }}
              >
                📹 Video Call Showcase
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function CartDialog({ cart, onClose, onChange, onClear, user, onWhatsApp }) {
  const [customerName, setCustomerName] = useState(user?.name || "");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Google Pay / PhonePe / UPI");
  const [notes, setNotes] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(true);
  const [copied, setCopied] = useState(false);

  if (!cart) return null;

  const total = cart.reduce((sum, entry) => sum + Number(entry.product.price) * entry.quantity, 0);
  const totalItems = cart.reduce((sum, entry) => sum + entry.quantity, 0);

  const fullMessage = formatCartWhatsAppMessage({
    cart,
    customerName,
    customerPhone,
    address,
    city,
    pincode,
    paymentMethod,
    notes,
  });

  const quickOrderText = cart.map(({ product, quantity }) => `${product.name} (Qty: ${quantity})`).join(", ");
  const quickMessage = `Hello Sri Sai Handloom Silk! I want to order from WhatsApp: ${quickOrderText}. Total: ${inr(total)}. Please confirm availability.`;

  function handleCopy() {
    navigator.clipboard?.writeText(fullMessage).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="dialog cart-dialog" role="dialog" aria-modal="true" aria-labelledby="cart-dialog-title">
        <button className="dialog-close" type="button" aria-label="Close cart" onClick={onClose}>×</button>
        <div className="cart-header-row">
          <h2 id="cart-dialog-title">Your Saree Cart</h2>
          {cart.length > 0 && (
            <button className="clear-cart-link" type="button" onClick={onClear}>Clear cart</button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart-wrap">
            <p className="muted empty-cart">Your cart is empty. Explore our handwoven collection to find a saree you love.</p>
            <button
              type="button"
              className="btn btn-whatsapp"
              onClick={() => {
                onClose();
                onWhatsApp("Hello Sri Sai Handloom Silk! Can you suggest the best sarees currently available?", "Enquiry on WhatsApp");
              }}
            >
              <WhatsAppIcon size={16} /> Chat on WhatsApp ({PHONE})
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map(({ product, quantity }) => (
                <article className="cart-item" key={itemKey(product)}>
                  <img src={product.image} alt={product.name} />
                  <div className="cart-item-info">
                    <h3>{product.name}</h3>
                    <p className="muted">{product.fabric} Silk · {inr(product.price)} each</p>
                    <div className="quantity-control" aria-label={`Quantity for ${product.name}`}>
                      <button type="button" aria-label={`Remove one ${product.name}`} onClick={() => onChange(product, -1)}>−</button>
                      <span>{quantity}</span>
                      <button type="button" aria-label={`Add one ${product.name}`} onClick={() => onChange(product, 1)}>+</button>
                    </div>
                  </div>
                  <strong className="cart-item-total">{inr(Number(product.price) * quantity)}</strong>
                </article>
              ))}
            </div>

            <div className="cart-total-box">
              <div className="cart-total-row">
                <span>Items ({totalItems})</span>
                <span>{inr(total)}</span>
              </div>
              <div className="cart-total-row shipping-row">
                <span>Shipping</span>
                <span className="free-tag">Free Across India</span>
              </div>
              <div className="cart-total-row grand-total">
                <span>Total Amount</span>
                <strong>{inr(total)}</strong>
              </div>
            </div>

            <div className="whatsapp-checkout-card">
              <div className="wa-checkout-header">
                <div className="wa-brand-pill">
                  <WhatsAppIcon size={18} />
                  <span>Direct WhatsApp Checkout ({PHONE})</span>
                </div>
                <button
                  type="button"
                  className="toggle-form-btn"
                  onClick={() => setShowAddressForm(!showAddressForm)}
                >
                  {showAddressForm ? "Hide address fields" : "+ Add delivery address"}
                </button>
              </div>

              {showAddressForm && (
                <div className="wa-address-fields">
                  <div className="form-grid-2">
                    <label>
                      <span>Your Name</span>
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                      />
                    </label>
                    <label>
                      <span>Contact Number</span>
                      <input
                        type="tel"
                        placeholder="WhatsApp / Phone"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                      />
                    </label>
                  </div>

                  <label>
                    <span>Delivery Address</span>
                    <input
                      type="text"
                      placeholder="Door no., Street, Area"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </label>

                  <div className="form-grid-2">
                    <label>
                      <span>City / Town</span>
                      <input
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </label>
                    <label>
                      <span>Pincode</span>
                      <input
                        type="text"
                        placeholder="e.g. 636001"
                        maxLength="10"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                      />
                    </label>
                  </div>

                  <div className="form-grid-2">
                    <label>
                      <span>Payment Method</span>
                      <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                        <option value="Google Pay / PhonePe / UPI">Google Pay / PhonePe / UPI (Fastest)</option>
                        <option value="Bank Transfer (NEFT/IMPS)">Bank Transfer (NEFT / IMPS)</option>
                        <option value="Cash on Delivery">Cash on Delivery (Advance token)</option>
                      </select>
                    </label>
                    <label>
                      <span>Special Request</span>
                      <input
                        type="text"
                        placeholder="Falls &amp; Pico / Gift wrap"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </label>
                  </div>
                </div>
              )}

              <div className="wa-submit-group">
                <button
                  type="button"
                  className="btn btn-whatsapp checkout-btn"
                  onClick={() => {
                    onClose();
                    onWhatsApp(fullMessage, "Complete Saree Order");
                  }}
                >
                  <WhatsAppIcon size={20} />
                  <span>Send Complete Order to WhatsApp ({PHONE})</span>
                </button>

                <div className="secondary-wa-actions">
                  <button
                    type="button"
                    className="btn ghost checkout-quick-btn"
                    onClick={() => {
                      onClose();
                      onWhatsApp(quickMessage, "Quick WhatsApp Order");
                    }}
                  >
                    ⚡ Quick Order
                  </button>
                  <button
                    type="button"
                    className="btn copy-order-btn"
                    onClick={handleCopy}
                    title="Copy full order details to paste into WhatsApp manually"
                  >
                    {copied ? "✓ Copied!" : "📋 Copy Order Slip"}
                  </button>
                </div>
              </div>

              <div className="wa-help-tip">
                <span>💬 Orders are sent to our master weaver in Salem at <strong>{PHONE}</strong>. You can scan with your phone or open in WhatsApp Web.</span>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function FloatingWhatsApp({ onWhatsApp }) {
  const [open, setOpen] = useState(false);
  const defaultMsg = "Hello Sri Sai Handloom Silk! I want to order handloom sarees. Please share your catalog.";
  const videoMsg = formatVideoCallMessage();

  return (
    <aside className="floating-whatsapp-container" aria-label="WhatsApp quick order & assistance">
      {open && (
        <div className="floating-whatsapp-popup">
          <div className="popup-header">
            <div className="popup-brand">
              <span className="online-indicator" />
              <strong>Sri Sai Handloom Silk</strong>
            </div>
            <button
              type="button"
              className="popup-close-btn"
              onClick={() => setOpen(false)}
              aria-label="Close WhatsApp widget"
            >
              ×
            </button>
          </div>
          <div className="popup-body">
            <p className="popup-text">
              👋 <strong>Namaste!</strong> Connect directly with our handloom weavers in Salem.
            </p>
            <div className="popup-number-badge">
              <WhatsAppIcon size={16} /> <strong>{PHONE}</strong>
            </div>
            <div className="popup-quick-links">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onWhatsApp(defaultMsg, "Order on WhatsApp");
                }}
                className="popup-action-btn primary"
              >
                <WhatsAppIcon size={16} /> Place Saree Order on WhatsApp
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onWhatsApp(videoMsg, "Book Live Video Call Saree Inspection");
                }}
                className="popup-action-btn secondary"
              >
                📹 Book Video Call Saree Showing
              </button>
              <a
                href={getWhatsAppWebUrl(defaultMsg)}
                target="_blank"
                rel="noreferrer"
                className="popup-action-btn ghost"
              >
                🌐 Open WhatsApp Web Directly
              </a>
            </div>
          </div>
          <div className="popup-footer">
            Salem Handlooms · WhatsApp: {PHONE}
          </div>
        </div>
      )}

      <button
        type="button"
        className="floating-whatsapp-button"
        onClick={() => setOpen(!open)}
        aria-label="Open WhatsApp ordering and chat"
        title={`Order on WhatsApp ${PHONE}`}
      >
        <WhatsAppIcon size={28} />
        <span className="floating-btn-pulse" />
      </button>
    </aside>
  );
}

export default function App() {
  const [items, setItems] = useState(FALLBACK);
  const [fabric, setFabric] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [pick, setPick] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authMode, setAuthMode] = useState("login");
  const [showLogin, setShowLogin] = useState(false);
  const [waModalData, setWaModalData] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/auth/me`, { credentials: "include" })
      .then(async (response) => {
        if (response.status === 401) return null;
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "Could not check your sign-in.");
        return body.user;
      })
      .then((user) => {
        if (user) {
          setAuthUser(user);
          setShowLogin(false);
        }
      })
      .catch((error) => {
        setAuthError(error instanceof Error ? error.message : "Could not connect to sign-in.");
      })
      .finally(() => setAuthLoading(false));
  }, []);

  useEffect(() => {
    fetch(`${API}/api/products`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => d.length && setItems(d.map((product, index) => {
        const fallback = FALLBACK.find((item) => item.name === product.name) || FALLBACK[index % FALLBACK.length];
        return {
          ...product,
          image: product.image || fallback.image,
          imageAlt: product.imageAlt || fallback.imageAlt,
          imageCredit: product.imageCredit || fallback.imageCredit,
          imageLicense: product.imageLicense || fallback.imageLicense,
          imageLicenseUrl: product.imageLicenseUrl || fallback.imageLicenseUrl,
          imageCreditUrl: product.imageCreditUrl || fallback.imageCreditUrl,
        };
      })))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedProduct && !cartOpen && !waModalData) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setSelectedProduct(null);
        setCartOpen(false);
        setWaModalData(null);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedProduct, cartOpen, waModalData]);

  const fabrics = useMemo(() => ["All", ...new Set(items.map((i) => i.fabric))], [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchFabric = fabric === "All" || item.fabric === fabric;
      
      let matchPrice = true;
      if (priceFilter === "under10k") matchPrice = Number(item.price) < 10000;
      else if (priceFilter === "10kto20k") matchPrice = Number(item.price) >= 10000 && Number(item.price) <= 20000;
      else if (priceFilter === "above20k") matchPrice = Number(item.price) > 20000;

      let matchSearch = true;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        matchSearch =
          item.name.toLowerCase().includes(q) ||
          item.fabric.toLowerCase().includes(q) ||
          (item.note && item.note.toLowerCase().includes(q));
      }

      return matchFabric && matchPrice && matchSearch;
    });
  }, [items, fabric, priceFilter, searchQuery]);

  const cartCount = cart.reduce((count, entry) => count + entry.quantity, 0);

  function openProduct(product) {
    setPick(product);
    setSelectedProduct(product);
  }

  function addToCart(product) {
    setCart((current) => {
      const key = itemKey(product);
      const existing = current.find((entry) => itemKey(entry.product) === key);
      return existing
        ? current.map((entry) => itemKey(entry.product) === key ? { ...entry, quantity: entry.quantity + 1 } : entry)
        : [...current, { product, quantity: 1 }];
    });
    setCartOpen(true);
  }

  function changeCartQuantity(product, amount) {
    const key = itemKey(product);
    setCart((current) => current
      .map((entry) => itemKey(entry.product) === key ? { ...entry, quantity: entry.quantity + amount } : entry)
      .filter((entry) => entry.quantity > 0));
  }

  function clearCart() {
    setCart([]);
  }

  function handleOpenWhatsApp(message, title = "Order on WhatsApp") {
    // If mobile phone, open direct native URL
    const isMobile = /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = getWhatsAppUniversalUrl(message);
      return;
    }
    // On desktop: directly launch the installed WhatsApp Desktop application!
    window.location.href = getWhatsAppAppUrl(message);
    // Also display the connect modal with backup QR code & copy options
    setWaModalData({ message, title });
  }

  async function authenticate(event) {
    event.preventDefault();
    setAuthBusy(true);
    setAuthError("");
    const formData = new FormData(event.currentTarget);
    const body = {
      email: formData.get("email"),
      password: formData.get("password"),
      ...(authMode === "register" ? { name: formData.get("name") } : {}),
    };

    try {
      const response = await fetch(`${API}/api/auth/${authMode}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not sign in.");
      setAuthUser(result.user);
      setShowLogin(false);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Could not connect to sign-in.");
    } finally {
      setAuthBusy(false);
    }
  }

  async function logout() {
    setAuthError("");
    try {
      const response = await fetch(`${API}/api/auth/logout`, { method: "POST", credentials: "include" });
      if (!response.ok) throw new Error("Could not sign out. Please try again.");
      setAuthUser(null);
      setAuthMode("login");
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Could not connect to sign out.");
    }
  }

  async function send(e) {
    e.preventDefault();
    const form = e.target;
    const f = new FormData(form);
    const name = f.get("name");
    const phone = f.get("phone");
    const message = f.get("message");
    const body = { name, phone, message, product: pick?.name };
    setStatus("Sending…");
    try {
      const r = await fetch(`${API}/api/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error();
      setStatus("Enquiry saved! We will call you soon. You can also chat on WhatsApp.");
      form.reset();
    } catch {
      setStatus("Saved locally. You can also send directly via WhatsApp below.");
    }
  }

  return (
    <>
      {showLogin && !authUser ? (
        <LoginPage
          mode={authMode}
          onModeChange={(mode) => { setAuthMode(mode); setAuthError(""); }}
          onSubmit={authenticate}
          onGuest={() => { setShowLogin(false); setAuthError(""); }}
          busy={authBusy}
          checking={authLoading}
          error={authError}
        />
      ) : (
        <>
          <Hero
            cartCount={cartCount}
            onCart={() => setCartOpen(true)}
            user={authUser}
            onLogin={() => { setAuthMode("login"); setShowLogin(true); }}
            onLogout={logout}
            onWhatsApp={handleOpenWhatsApp}
          />

          <main id="collection" className="wrap">
            <div className="collection-header">
              <div>
                <h2>Handwoven Saree Collection</h2>
                <p className="muted">Order pure silk sarees directly with our weavers on WhatsApp: <strong>{PHONE}</strong></p>
              </div>
              <div className="search-filter-controls">
                <div className="search-input-wrap">
                  <span className="search-icon">🔍</span>
                  <input
                    type="search"
                    placeholder="Search saree name, fabric, motif..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="saree-search-input"
                  />
                  {searchQuery && (
                    <button type="button" className="clear-search" onClick={() => setSearchQuery("")}>×</button>
                  )}
                </div>

                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="price-select-filter"
                >
                  <option value="All">All Prices</option>
                  <option value="under10k">Under ₹10,000</option>
                  <option value="10kto20k">₹10,000 - ₹20,000</option>
                  <option value="above20k">Above ₹20,000</option>
                </select>
              </div>
            </div>

            <div className="filter-summary-row">
              <div className="chips">
                {fabrics.map((f) => (
                  <button key={f} className={f === fabric ? "on" : ""} onClick={() => setFabric(f)}>{f}</button>
                ))}
              </div>
              <span className="results-counter">
                Showing {filteredItems.length} {filteredItems.length === 1 ? "saree" : "sarees"}
              </span>
            </div>

            {filteredItems.length === 0 ? (
              <div className="no-sarees-found">
                <p>No sarees found matching your search.</p>
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => { setFabric("All"); setPriceFilter("All"); setSearchQuery(""); }}
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="grid">
                {filteredItems.map((p) => (
                  <Card
                    key={p._id}
                    p={p}
                    onOpen={openProduct}
                    onAdd={addToCart}
                    onWhatsApp={handleOpenWhatsApp}
                  />
                ))}
              </div>
            )}

            {/* Video Call Showcase Feature Banner */}
            <section className="video-call-banner">
              <div className="video-call-content">
                <span className="eyebrow">Personalized Saree Experience</span>
                <h3>Want to inspect our sarees on a live WhatsApp Video Call?</h3>
                <p>
                  Experience the genuine drape, pallu contrast, and rich gold zari in natural light before ordering. Our weavers in Salem are happy to show you sarees live over WhatsApp.
                </p>
                <div className="video-call-cta">
                  <button
                    type="button"
                    className="btn btn-whatsapp"
                    onClick={() => handleOpenWhatsApp(formatVideoCallMessage(), "WhatsApp Video Call Appointment")}
                  >
                    <WhatsAppIcon size={18} /> Schedule Video Call ({PHONE})
                  </button>
                  <span className="timing-note">Available 9:00 AM – 8:30 PM IST</span>
                </div>
              </div>
            </section>

            <section className="enquire" aria-live="polite">
              <h2>{pick ? `Enquire about: ${pick.name}` : "Custom Weaver Enquiry"}</h2>
              <p className="muted">Looking for a specific color combination, bridal set, or bulk wedding orders? Reach out directly.</p>
              
              <form onSubmit={send}>
                <input name="name" placeholder="Your name" required defaultValue={authUser?.name || ""} />
                <input name="phone" placeholder="Your phone number / WhatsApp" inputMode="tel" required />
                <textarea
                  name="message"
                  rows="3"
                  placeholder="Tell us your preferred colour, occasion, budget, or custom request..."
                  defaultValue={pick ? `I am interested in ${pick.name} (${pick.fabric} silk, ${inr(pick.price)}).` : ""}
                />
                
                <div className="enquiry-actions-row">
                  <button className="btn" type="submit">Submit Enquiry</button>
                  <button
                    type="button"
                    className="btn btn-whatsapp"
                    onClick={() => handleOpenWhatsApp(`Hello Sri Sai Handloom Silk! I would like to enquire about ${pick ? pick.name : "your silk sarees"}.`, "Weaver Enquiry")}
                  >
                    <WhatsAppIcon size={16} /> Order / Chat on WhatsApp ({PHONE})
                  </button>
                </div>
                {status && <p className="muted enquiry-status">{status}</p>}
              </form>
            </section>
          </main>

          <footer id="contact" className="site-footer">
            <h2>Sri Sai Handloom Silk</h2>
            <p className="footer-tagline">Pure Handwoven Silk Sarees · Salem, Tamil Nadu</p>
            
            <div className="footer-wa-highlight">
              <WhatsAppIcon size={20} />
              <span>WhatsApp Orders &amp; Inquiries:</span>
              <button
                type="button"
                className="footer-wa-link"
                onClick={() => handleOpenWhatsApp("Hello Sri Sai Handloom Silk! I am reaching out from your website.", "Contact on WhatsApp")}
              >
                {PHONE}
              </button>
            </div>

            <p className="footer-contact-label">Voice Call: <a href={`tel:+${WA}`}>{PHONE}</a></p>
            <address>{ADDRESS}</address>
            <p className="footer-copyright">© {new Date().getFullYear()} Sri Sai Handloom Silk. All rights reserved.</p>
          </footer>

          <ProductDialog
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAdd={addToCart}
            onWhatsApp={handleOpenWhatsApp}
          />

          {cartOpen && (
            <CartDialog
              cart={cart}
              onClose={() => setCartOpen(false)}
              onChange={changeCartQuantity}
              onClear={clearCart}
              user={authUser}
              onWhatsApp={handleOpenWhatsApp}
            />
          )}

          <FloatingWhatsApp onWhatsApp={handleOpenWhatsApp} />

          {/* Dedicated WhatsApp Connect Modal (QR Code + Web Links + Copy) */}
          <WhatsAppConnectModal
            data={waModalData}
            onClose={() => setWaModalData(null)}
          />
        </>
      )}
    </>
  );
}
