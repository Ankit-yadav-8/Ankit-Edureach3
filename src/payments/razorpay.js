
import { API_BASE } from "../auth/api.js";

/* Lazy-load the Razorpay checkout script once. */
let scriptPromise = null;
export function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve(true);
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => { scriptPromise = null; resolve(false); };
    document.body.appendChild(s);
  });
  return scriptPromise;
}

async function post(path, body) {
  const res = await fetch(API_BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
  return data;
}

/* Full payment flow:
   1. create an order on our server (amount is fixed server-side)
   2. open the Razorpay checkout
   3. verify the signature on our server
   Resolves with { paymentId } on success, rejects/cancels otherwise. */
export async function startPayment(details) {
  const ok = await loadRazorpay();
  if (!ok) throw new Error("Could not load the payment gateway. Check your connection.");

  const order = await post("/api/payment/order", details);

  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      order_id: order.orderId,
      name: "College Parichay",
      description: order.planLabel,
      image: `${window.location.origin}/cp-pay-logo.png`,
      prefill: {
        name: details.name || "",
        email: details.email || "",
        contact: details.phone || "",
      },
      notes: { plan: details.plan },
      theme: {
        color: "#FF693D",
        backdrop_color: "#1c1c28",
      },
      handler: async (response) => {
        try {
          // Send the student details too — the enrolment row is created here,
          // server-side, only after the signature is verified as genuine.
          await post("/api/payment/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            ...details,
          });
          resolve({ paymentId: response.razorpay_payment_id });
        } catch (e) {
          reject(e);
        }
      },
      modal: {
        ondismiss: () => reject(new Error("CANCELLED")),
      },
    });
    rzp.on("payment.failed", (resp) => {
      reject(new Error(resp?.error?.description || "Payment failed. Please try again."));
    });
    rzp.open();
  });
}
