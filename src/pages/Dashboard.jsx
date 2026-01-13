import { useEffect, useState } from "react";
import api from "../api/axios";
import socket from "../socket";

export default function Dashboard() {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-lg text-gray-500">Please login again</h1>
      </div>
    );
  }

  const [gigs, setGigs] = useState([]);
  const [bids, setBids] = useState([]);
  const [selectedGig, setSelectedGig] = useState(null);

  /* ================= SOCKET ================= */
  useEffect(() => {
    socket.emit("join", userId);
    socket.on("hired", (data) => alert(data.message));

    return () => socket.off("hired");
  }, [userId]);

  /* ================= LOAD MY GIGS ================= */
  useEffect(() => {
    api.get("/gigs")
      .then((res) => {
        // only gigs created by me
        const myGigs = res.data.filter(
          (gig) => gig.owner === userId
        );
        setGigs(myGigs);
      })
      .catch(console.error);
  }, [userId]);

  /* ================= LOAD BIDS ================= */
  const loadBids = async (gig) => {
    setSelectedGig(gig);
    try {
      const res = await api.get(`/bids/${gig._id}`);
      setBids(res.data);
    } catch {
      setBids([]);
    }
  };

  /* ================= HIRE ================= */
  const hireBid = async (bidId) => {
    if (!selectedGig || selectedGig.status !== "open") return;

    await api.patch(`/bids/${bidId}/hire`);
    alert("Freelancer hired successfully ✅");

    // refresh bids + gig status
    const gigRes = await api.get(`/gigs/${selectedGig._id}`);
    setSelectedGig(gigRes.data);
    loadBids(gigRes.data);
  };

  return (
    <div className="min-h-screen bg-green-50 p-8">
      <h1 className="text-3xl font-bold text-green-800 mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ================= MY GIGS ================= */}
        <div>
          <h2 className="text-xl font-semibold text-green-700 mb-4">
            My Gigs
          </h2>

          {gigs.length === 0 && (
            <p className="text-gray-500">No gigs posted yet.</p>
          )}

          {gigs.map((gig) => (
            <div
              key={gig._id}
              onClick={() => loadBids(gig)}
              className={`p-4 mb-3 rounded-xl border cursor-pointer transition
                ${
                  selectedGig?._id === gig._id
                    ? "bg-green-100 border-green-400"
                    : "bg-white hover:bg-green-50"
                }`}
            >
              <h3 className="font-semibold text-gray-800">
                {gig.title}
              </h3>
              <p className="text-sm text-gray-500">
                ₹{gig.budget}
              </p>
              <span
                className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${
                  gig.status === "open"
                    ? "bg-green-200 text-green-800"
                    : "bg-blue-200 text-blue-800"
                }`}
              >
                {gig.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>

        {/* ================= BIDS ================= */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-green-700 mb-4">
            {selectedGig
              ? `Bids for "${selectedGig.title}"`
              : "Select a gig to view bids"}
          </h2>

          {selectedGig && bids.length === 0 && (
            <p className="text-gray-500">No bids yet.</p>
          )}

          {bids.map((bid) => (
            <div
              key={bid._id}
              className="bg-white border rounded-xl p-5 mb-3 flex justify-between items-center"
            >
              <div>
                <p className="text-gray-700">{bid.message}</p>
                <p className="text-green-700 font-semibold">
                  ₹{bid.amount}
                </p>

                <span
                  className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${
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

              {bid.status === "pending" &&
                selectedGig.status === "open" && (
                  <button
                    onClick={() => hireBid(bid._id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                  >
                    Hire
                  </button>
                )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
