import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function Gigs() {
  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    api.get("/gigs").then((res) => setGigs(res.data));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Available Gigs</h1>
        <Link
          to="/create-gig"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Post Gig
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {gigs.map((gig) => (
          <Link
            key={gig._id}
            to={`/gigs/${gig._id}`}
            className="border p-4 rounded hover:shadow"
          >
            <h2 className="font-bold">{gig.title}</h2>
            <p className="text-sm text-gray-600">{gig.description}</p>
            <p className="text-green-600 mt-2">₹{gig.budget}</p>
            <p className="text-xs mt-1">Status: {gig.status}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
