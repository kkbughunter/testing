import React from "react";

export default function PersonForm({
  name,
  age,
  setName,
  setAge,
  setImage,
  editId,
  handleSubmit,
}) {
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-lg flex flex-col gap-4"
    >
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-3 border rounded"
        required
      />
      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        className="p-3 border rounded"
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        className="p-3 border rounded"
      />
      <button
        type="submit"
        className="bg-indigo-600 text-white p-3 rounded hover:bg-indigo-700"
      >
        {editId ? "Update Person" : "Add Person"}
      </button>
    </form>
  );
}
