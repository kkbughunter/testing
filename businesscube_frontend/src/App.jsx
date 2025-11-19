import React, { useEffect, useState } from "react";
import PersonForm from "./components/PersonForm";
import PersonCard from "./components/PersonCard";
import {
  getAllPersons,
  createPerson,
  updatePerson,
  deletePersonById,
} from "./api/persons";

export default function App() {
  const [persons, setPersons] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);

  // Fetch all persons from API
  const fetchPersons = async () => {
    try {
      const response = await getAllPersons();
      const personsArray = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];
      setPersons(personsArray);
    } catch (error) {
      console.error("Error fetching persons:", error);
      setPersons([]);
    }
  };

  useEffect(() => {
    fetchPersons();
  }, []);

  // Handle form submit for create/update
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("name", name);
    fd.append("age", age);
    if (image) fd.append("image", image);

    try {
      if (editId === null) {
        await createPerson(fd);
      } else {
        await updatePerson(editId, fd);
        setEditId(null);
      }

      setName("");
      setAge("");
      setImage(null);
      fetchPersons();
    } catch (error) {
      console.error("Error saving person:", error);
    }
  };

  // Populate form for editing
  const editPerson = (p) => {
    setEditId(p?.id);
    setName(p?.name || "");
    setAge(p?.age || "");
  };

  // Delete person by ID
  const deletePerson = async (id) => {
    try {
      await deletePersonById(id);
      fetchPersons();
    } catch (error) {
      console.error("Error deleting person:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-10">
      <h1 className="text-5xl font-extrabold text-center mb-16 text-indigo-700">
        Astraval Person Manager
      </h1>

      <div className="max-w-xl mx-auto mb-16">
        <PersonForm
          name={name}
          age={age}
          setName={setName}
          setAge={setAge}
          setImage={setImage}
          editId={editId}
          handleSubmit={handleSubmit}
        />
      </div>

      <h2 className="text-3xl font-bold text-gray-800 mb-8">All Persons</h2>

      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(persons) && persons.length > 0 ? (
          persons.map((p) => (
            <PersonCard
              key={p?.id}
              p={{
                ...p,
                imageUrl: p?.imageUrl.slice(1)
  ? `${import.meta.env.VITE_API_URL}${p.imageUrl.slice(1)}`
  : null
              }}
              // script={console.log(`${import.meta.env.VITE_API_URL}${p.imageUrl.slice(1)}`)}
              editPerson={editPerson}
              deletePerson={deletePerson}
            />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No persons found.
          </p>
        )}
      </div>
    </div>
  );
}
