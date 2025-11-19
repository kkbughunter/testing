import React from "react";
import { PlusCircle, Edit3, Upload } from "lucide-react";

export default function PersonForm({
  name,
  age,
  setName,
  setAge,
  setImage,
  editId,
  handleSubmit
}) {
  return (
    <form
      onSubmit={handleSubmit}
      className="backdrop-blur-xl bg-white/80 shadow-2xl rounded-3xl p-8 border border-gray-200 space-y-6"
    >
      <h2 className="text-2xl font-bold text-center text-gray-700 flex items-center justify-center gap-3">
        {editId ? (
          <>
            <Edit3 className="text-yellow-600" /> Update Person
          </>
        ) : (
          <>
            <PlusCircle className="text-indigo-600" /> Create New Person
          </>
        )}
      </h2>

      <div>
        <label className="font-semibold text-gray-700">Full Name</label>
        <input
          type="text"
          value={name}
          placeholder="Enter full name"
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full mt-2 px-4 py-3 border rounded-xl bg-gray-50"
        />
      </div>

      <div>
        <label className="font-semibold text-gray-700">Age</label>
        <input
          type="number"
          value={age}
          placeholder="Enter age"
          onChange={(e) => setAge(e.target.value)}
          required
          className="w-full mt-2 px-4 py-3 border rounded-xl bg-gray-50"
        />
      </div>

      <div>
        <label className="font-semibold text-gray-700">Profile Image</label>
        <div className="mt-2 flex items-center gap-3 p-3 bg-gray-100 rounded-xl border cursor-pointer">
          <Upload className="text-indigo-600" />
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="flex-1"
          />
        </div>
      </div>

      <button
        className={`w-full py-3 text-white font-semibold text-lg rounded-2xl shadow-lg transition-all ${
          editId ? "bg-yellow-500" : "bg-indigo-600"
        }`}
      >
        {editId ? "Save Changes" : "Create Person"}
      </button>
    </form>
  );
}
