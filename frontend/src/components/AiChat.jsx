import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { StoreContex } from "../contex/StoreContex";

const AiChat = () => {
  const { url, addToCart } = useContext(StoreContex);

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const defaultMessage = [
    {
      role: "assistant",
      content:
        "Hi! Tell me what you feel like eating and I'll suggest something from our menu.",
      items: [],
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ];

  const [messages, setMessages] = useState(defaultMessage);

  const suggestions = [
    "Spicy food",
    "Veg under ₹200",
    "Healthy salad",
    "Chicken dishes",
    "Best seller",
  ];

  // Load saved chat
  useEffect(() => {
    const saved = localStorage.getItem("food-ai-chat");

    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  // Save chat
  useEffect(() => {
    localStorage.setItem(
      "food-ai-chat",
      JSON.stringify(messages)
    );
  }, [messages]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const clearChat = () => {
    localStorage.removeItem("food-ai-chat");
    setMessages(defaultMessage);
  };

  const send = async (e) => {
    e.preventDefault();

    const text = input.trim();

    if (!text || loading) return;

    const history = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const userMessage = {
      role: "user",
      content: text,
      items: [],
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);

    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        url + "/api/ai/chat",
        {
          message: text,
          history,
        },
        {
          withCredentials: true,
        }
      );

      const botMessage = {
        role: "assistant",
        content: res.data.reply,
        items: res.data.items || [],
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error.response?.data);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, something went wrong. Please try again.",
          items: [],
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-7 right-6 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_35px_rgba(168,85,247,0.7)]"
      >
        <span className="animate-pulse text-lg">
          {open ? "✕" : "✨"}
        </span>
        {open ? "Close AI" : "Ask AI"}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[min(580px,calc(100vh-130px))] w-[min(380px,calc(100vw-40px))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#181818] shadow-2xl">

          {/* Header */}
          <div className="flex items-center gap-3 border-b border-white/10 bg-[#1c1c1c] px-4 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/15 text-xl text-orange-400">
              ✦
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white">
                Food Assistant
              </h3>

              <p className="text-xs text-gray-400">
                Find something delicious
              </p>
            </div>

            <button
              onClick={clearChat}
              className="text-xs text-orange-400 hover:text-orange-300"
            >
              Clear
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "text-right"
                    : "text-left"
                }
              >
                <p
                  className={`inline-block max-w-[90%] rounded-2xl px-3.5 py-2.5 text-sm ${m.role === "user"
                      ? "bg-orange-600 text-white rounded-br-sm"
                      : "bg-[#252525] text-gray-200 rounded-bl-sm"
                    }`}
                >
                  {m.content}
                </p>

                <p className="mt-1 text-[10px] text-gray-500">
                  {m.time}
                </p>

                {m.items?.map((item) => (
                  <div
                    key={item._id}
                    className="mt-3 flex items-center gap-3 rounded-xl border border-white/10 bg-[#222222] p-3"
                  >
                    <img
                      src={url + "/images/" + item.image}
                      alt={item.name}
                      className="h-14 w-14 rounded-lg object-cover"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-400 line-clamp-2">
                        {item.description}
                      </p>

                      <p className="mt-2 text-sm font-semibold text-orange-400">
                        ₹{item.price}
                      </p>
                    </div>

                    <button
                      onClick={() => addToCart(item._id)}
                      className="rounded-lg bg-orange-600 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-500"
                    >
                      Add +
                    </button>
                  </div>
                ))}
              </div>
            ))}

            {/* Typing Animation */}
            {loading && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-orange-500"></span>
                  <span className="h-2 w-2 animate-bounce rounded-full bg-orange-500 [animation-delay:150ms]"></span>
                  <span className="h-2 w-2 animate-bounce rounded-full bg-orange-500 [animation-delay:300ms]"></span>
                </div>

                <span>
                  Finding something delicious...
                </span>
              </div>
            )}

            <div ref={messagesEndRef}></div>
          </div>

          {/* Suggestions */}
          <div className="flex flex-wrap gap-2 px-4 pb-2">
            {suggestions.map((item) => (
              <button
                key={item}
                onClick={() => setInput(item)}
                className="rounded-full bg-[#252525] px-3 py-1 text-xs text-gray-300 hover:bg-orange-600 hover:text-white"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={send}
            className="flex gap-2 border-t border-white/10 bg-[#1c1c1c] p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey
                ) {
                  e.preventDefault();
                  send(e);
                }
              }}
              placeholder="e.g. spicy veg under ₹200"
              maxLength={500}
              className="flex-1 rounded-xl border border-white/10 bg-[#111111] px-3 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-orange-500"
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-xl bg-orange-600 px-4 text-sm font-semibold text-white hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AiChat;