import React from "react";

export default function PersonCard({ p, editPerson, deletePerson }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center gap-4">
      {p.imageUrl && (
        <img
          src={p.imageUrl}
          alt={p.name}
          className="w-32 h-32 object-cover rounded-full"
        />
      )}
      <h3 className="text-xl font-bold">{p.name}</h3>
      <p>Age: {p.age}</p>
      <div className="flex gap-4">
        <button
          onClick={() => editPerson(p)}
          className="bg-yellow-400 text-white p-2 rounded hover:bg-yellow-500"
        >
          Edit
        </button>
        <button
          onClick={() => deletePerson(p.id)}
          className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
