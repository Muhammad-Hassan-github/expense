let deferredPrompt;

// Listen for install prompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  // Show popup
  const popup = document.getElementById('install-popup');
  if (popup) popup.style.display = 'flex';
});

// Handle install confirm
document.addEventListener("DOMContentLoaded", () => {
  const installConfirm = document.getElementById("install-confirm");
  const installCancel = document.getElementById("install-cancel");
  const popup = document.getElementById("install-popup");

  if (installConfirm) {
    installConfirm.addEventListener("click", async () => {
      popup.style.display = "none";
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;
      }
    });
  }

  if (installCancel) {
    installCancel.addEventListener("click", () => {
      popup.style.display = "none";
    });
  }
});


// Share button logic
const shareBtn = document.getElementById("shareBtn");
shareBtn.addEventListener("click", async () => {
  const qty = qtyInput.value;
  const total = qty * productPrice;
  const shareData = {
    title: "JTM Hand Feeding Formula",
    text: `Check out JTM Hand Feeding Formula 🐦\nI want to order ${qty} pack(s). Total = Rs ${total}`,
    url: window.location.href
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      console.log("Product shared successfully!");
    } catch (err) {
      console.error("Error sharing:", err);
    }
  } else {
    alert("Sharing is not supported in this browser. Copy this link: " + window.location.href);
  }
});
