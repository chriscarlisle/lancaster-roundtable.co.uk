document.addEventListener("DOMContentLoaded", () => {
    const DURATION = 5000; // explosion duration in ms
    const ITEM_COUNT = 40;  // number of items in the explosion

    const month = new Date().getMonth(); // 0=Jan, 3=Apr, 9=Oct, 11=Dec
    let items = [], messageSrc;

    if (month === 11) { // Christmas
        items = ["❄"];
        messageSrc = "images/merry-christmas.png";
    } else if (month === 9) { // Halloween
        items = ["🍬","🍭","🕸️","🦇","🎃"];
        messageSrc = "images/happy-halloween.png";
    } else if (month === 3) { // Easter
        items = ["🥚","🌸","🐣","🐰","💐"];
        messageSrc = "images/happy-easter.png";
    } else {
        return; // do nothing outside these months
    }

    // --- Add gradient overlay ---
    const overlay = document.createElement("div");
    overlay.className = "gradient-overlay";
    document.body.appendChild(overlay);

    // --- Add seasonal message ---
    const msg = document.createElement("img");
    msg.src = messageSrc;
    msg.className = "season-message";
    document.body.appendChild(msg);

    // --- Create explosion ---
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "50%";
    container.style.left = "50%";
    container.style.width = "0";
    container.style.height = "0";
    container.style.pointerEvents = "none";
    container.style.zIndex = 9999;
    document.body.appendChild(container);

    for (let i = 0; i < ITEM_COUNT; i++) {
        const el = document.createElement("div");
        el.textContent = items[Math.floor(Math.random() * items.length)];
        el.style.position = "absolute";
        el.style.top = "50%";
        el.style.left = "50%";
        el.style.fontSize = (40 + Math.random() * 60) + "px";
        el.style.opacity = 0;
        el.style.pointerEvents = "none";

        const angle = Math.random() * 2 * Math.PI;
        const radius = 100 + Math.random() * 200;
        const x = Math.cos(angle) * radius + "px";
        const y = Math.sin(angle) * radius + "px";
        const rotate = (Math.random() * 360 - 180) + "deg";

        el.style.setProperty("--x", x);
        el.style.setProperty("--y", y);
        el.style.setProperty("--rotate", rotate);
        el.style.animation = `explode ${DURATION}ms ease-out forwards`;

        container.appendChild(el);
    }

    // --- Cleanup after animation ---
    setTimeout(() => {
        container.remove();
        overlay.style.opacity = 0;
        msg.style.opacity = 0;
        setTimeout(() => overlay.remove(), 1000);
        setTimeout(() => msg.remove(), 1000);
    }, DURATION);
});
