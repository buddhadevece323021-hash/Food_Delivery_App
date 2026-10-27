import { GoogleGenAI } from "@google/genai";
import { foodModel } from "../models/foodModel.js";
import { orderModel } from "../models/orderModel.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const cache = new Map();
const CACHE_TTL = 10 * 60 * 1000;

const visibleOrders = { $or: [{ paymentMethod: "COD" }, { payment: true }] };

const getUserTaste = async (userId) => {
  const orders = await orderModel
    .find({ userId, ...visibleOrders })
    .sort({ date: -1 })
    .limit(10);

  const counts = {};
  orders.forEach((o) =>
    o.items.forEach((i) => {
      counts[i.name] = (counts[i.name] || 0) + Number(i.quantity || 1);
    })
  );

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, qty]) => `${name} (x${qty})`);
};

const toMenu = (foods) =>
  foods.map((f) => ({
    id: f._id.toString(),
    name: f.name,
    category: f.category,
    price: f.price,
    description: f.description,
  }));

// contents = [{ role: "user" | "model", parts: [{ text }] }]
const askModel = async (system, contents) => {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents,
    config: {
      systemInstruction: system,
      responseMimeType: "application/json",
      maxOutputTokens: 1024,
      temperature: 0.6,
    },
  });

  const text = response.text || "";
  try {
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch {
    return { reply: "Sorry, I couldn't find a good match.", itemIds: [] };
  }
};

// ---------- Free-text chat (floating button) ----------
export const aiChat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== "string" || message.length > 500) {
      return res.status(400).json({ success: false, message: "Invalid message" });
    }

    const foods = await foodModel.find({});
    const pastOrders = await getUserTaste(req.user.id);

    const system = `You are a friendly food assistant for a food delivery app.
Recommend ONLY items from the MENU below. Never invent items or prices.
If nothing fits, say so and suggest the closest options. Pick at most 4 items.

MENU (JSON):
${JSON.stringify(toMenu(foods))}

CUSTOMER'S PREVIOUS ORDERS (most ordered first):
${pastOrders.length ? pastOrders.join(", ") : "None yet"}

Respond with ONLY valid JSON:
{"reply": "short friendly message (max 2 sentences)", "itemIds": ["id1", "id2"]}`;

    // Gemini roles are "user" and "model"; conversation must start with a user turn
    let past = history
      .slice(-6)
      .filter((m) => ["user", "assistant"].includes(m.role) && typeof m.content === "string")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content.slice(0, 500) }],
      }));
    while (past.length && past[0].role !== "user") past.shift();

    const parsed = await askModel(system, [
      ...past,
      { role: "user", parts: [{ text: message }] },
    ]);

    const items = foods.filter((f) => (parsed.itemIds || []).includes(f._id.toString()));
    res.json({ success: true, reply: parsed.reply, items });
  } catch (error) {
    console.error("AI chat error:", error);
    res.status(500).json({ success: false, message: "AI assistant is unavailable right now" });
  }
};

// ---------- Home "Recommended for you" + Cart "You may also like" ----------
export const getRecommendations = async (req, res) => {
  try {
    const { mode, cartItemIds = [] } = req.body;
    if (!["home", "cart"].includes(mode)) {
      return res.status(400).json({ success: false, message: "Invalid mode" });
    }

    const ids = Array.isArray(cartItemIds) ? cartItemIds.slice(0, 30).map(String) : [];
    const userId = req.user.id;

    const cacheKey = `${userId}:${mode}:${[...ids].sort().join(",")}`;
    const hit = cache.get(cacheKey);
    if (hit && hit.expires > Date.now()) {
      return res.json({ success: true, ...hit.data });
    }

    const foods = await foodModel.find({});
    const pastOrders = await getUserTaste(userId);

    const inCart = foods.filter((f) => ids.includes(f._id.toString()));
    const candidates = mode === "cart" ? foods.filter((f) => !ids.includes(f._id.toString())) : foods;

    let system;
    let userMsg;

    if (mode === "home") {
      system = `You recommend food for a delivery app's home page.
Choose up to 4 items from the MENU that this customer will probably enjoy, based on their previous orders.
If they have no history, pick a varied mix across categories.
Prefer items they have NOT ordered before, but similar in taste. Never invent items.

MENU (JSON):
${JSON.stringify(toMenu(candidates))}

PREVIOUS ORDERS: ${pastOrders.length ? pastOrders.join(", ") : "None yet"}

Respond with ONLY valid JSON:
{"reply": "one short friendly line (max 12 words)", "itemIds": ["id1","id2"]}`;
      userMsg = "Recommend dishes for me.";
    } else {
      if (inCart.length === 0) {
        return res.json({ success: true, reply: "", items: [] });
      }
      system = `You suggest add-ons for a customer's cart in a food delivery app.
Choose up to 3 items from the MENU that go well with what is already in the cart
(for example a drink, side, or dessert). Never suggest items already in the cart. Never invent items.

CART: ${inCart.map((f) => f.name).join(", ")}

MENU (JSON):
${JSON.stringify(toMenu(candidates))}

PREVIOUS ORDERS: ${pastOrders.length ? pastOrders.join(", ") : "None yet"}

Respond with ONLY valid JSON:
{"reply": "one short line (max 12 words)", "itemIds": ["id1","id2"]}`;
      userMsg = "What goes well with my cart?";
    }

    const parsed = await askModel(system, [{ role: "user", parts: [{ text: userMsg }] }]);

    const allowed = new Set(candidates.map((f) => f._id.toString()));
    const items = foods
      .filter((f) => (parsed.itemIds || []).includes(f._id.toString()) && allowed.has(f._id.toString()))
      .slice(0, mode === "home" ? 4 : 3);

    const data = { reply: parsed.reply || "", items };
    cache.set(cacheKey, { data, expires: Date.now() + CACHE_TTL });

    res.json({ success: true, ...data });
  } catch (error) {
    console.error("AI recommend error:", error);
    res.status(500).json({ success: false, message: "Recommendations unavailable" });
  }
};