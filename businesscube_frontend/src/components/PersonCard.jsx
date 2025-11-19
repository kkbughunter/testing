import React from "react";
import { Trash2, Edit3 } from "lucide-react";

export default function PersonCard({ p, editPerson, deletePerson }) {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-gray-200
                    hover:shadow-2xl transition-all hover:-translate-y-1 hover:bg-white/90 duration-300">

      {/* Image Section */}
      <div className="w-full h-48 mb-5 rounded-2xl overflow-hidden shadow-inner relative">
        {p.imageUrl ? (
          <img
            src={`http://astraval.com:8085${p.imageUrl}`}
            className="w-full h-full object-cover transform hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200
                          flex items-center justify-center text-gray-500 text-lg">
            No Image
          </div>
        )}
      </div>

      {/* Details */}
      <div className="space-y-2">
        <p className="text-gray-500 text-sm tracking-wide">
          <strong className="text-gray-700">ID:</strong> {p.id}
        </p>

        <p className="text-2xl font-extrabold text-gray-900 tracking-tight">
          {p.name}
        </p>

        <p className="text-gray-700 text-md font-medium">
          Age: <span className="text-gray-900 font-semibold">{p.age}</span>
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => editPerson(p)}
          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-green-600 
                     text-white font-semibold shadow hover:shadow-lg
                     hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2"
        >
          <Edit3 size={18} /> Edit
        </button>

        <button
          onClick={() => deletePerson(p.id)}
          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600
                     text-white font-semibold shadow hover:shadow-lg
                     hover:from-red-600 hover:to-red-700 transition-all flex items-center justify-center gap-2"
        >
          <Trash2 size={18} /> Delete
        </button>
      </div>
    </div>
  );
}
