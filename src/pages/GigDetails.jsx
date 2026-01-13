import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function GigDetails() {
  const { id } = useParams();

  const [gig, setGig] = useState(null);
  const [bids, setBids] = useState([]);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  /* ================= FETCH GIG ================= */
  useEffect(() => {
    api
      .get(`/gigs/${id}`)
      .then((res) => {
        setGig(res.data);

        const userId = localStorage.getItem("userId");
        if (userId && res.data.owner === userId) {
          setIsOwner(true);
        } else {
          setIsOwner(false);
        }
      })
      .catch(() => setError("Gig not found"));
  }, [id]);

  /* ================= FETCH BIDS (OWNER ONLY) ================= */
  const fetchBids = async () => {
    try {
      const res = await api.get(`/bids/${id}`);
      setBids(res.data);
    } catch {
      // non-owner → ignore
    }
  };

  useEffect(() => {
    if (isOwner) fetchBids();
  }, [isOwner]);

  /* ================= PLACE BID ================= */
  const handleBidSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !message) return;

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await api.post("/bids", {
        gig: id,
        amount,
        message,
      });

      setSuccess("Bid placed successfully ✅");
      setAmount("");
      setMessage("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place bid");
    } finally {
      setLoading(false);
    }
  };

  /* ================= HIRE ================= */
  const handleHire = async (bidId) => {
    try {
      await api.patch(`/bids/${bidId}/hire`);
      alert("Freelancer hired successfully ✅");

      const gigRes = await api.get(`/gigs/${id}`);
      setGig(gigRes.data);

      fetchBids();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to hire");
    }
  };

  /* ================= REJECT ================= */
  const handleReject = async (bidId) => {
    try {
      await api.patch(`/bids/${bidId}/reject`);
      alert("Bid rejected ❌");
      fetchBids();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject");
    }
  };

  if (!gig) {
    return (
      <p className="p-6 text-center text-gray-600">
        {error || "Loading gig..."}
      </p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* ================= GIG INFO ================= */}
      <div className="bg-white border border-green-100 rounded-xl p-6 mb-8">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-3xl font-bold text-green-800">{gig.title}</h1>

          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${
              gig.status === "open"
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {gig.status.toUpperCase()}
          </span>
        </div>

        <p className="text-gray-600 mb-4">{gig.description}</p>

        <p className="text-lg font-semibold text-green-700">
          Budget: ₹{gig.budget}
        </p>
      </div>

      {/* ================= BID FORM (NON-OWNER) ================= */}
      {gig.status === "open" && !isOwner && (
        <div className="bg-white border border-green-100 rounded-xl p-6 mb-10">
          <h2 className="text-xl font-semibold text-green-800 mb-4">
            Place Your Bid
          </h2>

          {success && (
            <p className="text-sm text-green-700 bg-green-50 px-4 py-2 rounded mb-3">
              {success}
            </p>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded mb-3">
              {error}
            </p>
          )}

          <form onSubmit={handleBidSubmit} className="space-y-4">
            <input
              type="number"
              placeholder="Bid Amount (₹)"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            <textarea
              rows="4"
              placeholder="Short proposal message"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />

            <button
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white font-medium ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Submitting..." : "Place Bid"}
            </button>
          </form>
        </div>
      )}

      {/* ================= BIDS LIST (OWNER ONLY) ================= */}
      {isOwner && (
        <div>
          <h2 className="text-2xl font-semibold text-green-800 mb-5">
            Bids Received
          </h2>

          {bids.length === 0 && (
            <p className="text-gray-500 italic">No bids yet.</p>
          )}

          <div className="space-y-4">
            {bids.map((bid) => (
              <div
                key={bid._id}
                className="bg-white border rounded-xl p-5 flex justify-between"
              >
                <div>
                  <p className="text-lg font-semibold">₹{bid.amount}</p>
                  <p className="text-gray-600 text-sm mt-1">{bid.message}</p>

                  <span
                    className={`inline-block mt-3 px-3 py-1 text-xs font-semibold rounded-full ${
                      bid.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : bid.status === "hired"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {bid.status.toUpperCase()}
                  </span>
                </div>

                {gig.status === "open" && bid.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleHire(bid._id)}
                      className="px-4 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700"
                    >
                      Hire
                    </button>
                    <button
                      onClick={() => handleReject(bid._id)}
                      className="px-4 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
