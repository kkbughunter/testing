import React, { useEffect, useState } from "react";
import PersonForm from "./components/PersonForm";
import PersonCard from "./components/PersonCard";

import {
  getAllPersons,
  createPerson,
  updatePerson,
  deletePersonById
} from "./api/persons";

export default function App() {

  const [persons, setPersons] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);

  const loadPersons = async () => {
    const res = await getAllPersons();
    setPersons(res.data);
  };

  useEffect(() => {
    loadPersons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();

    fd.append("name", name);
    fd.append("age", age);
    if (image) fd.append("image", image);

    if (editId === null) {
      await createPerson(fd);
    } else {
      await updatePerson(editId, fd);
      setEditId(null);
    }

    setName("");
    setAge("");
    setImage(null);
    loadPersons();
  };

  const editPerson = (p) => {
    setEditId(p.id);
    setName(p.name);
    setAge(p.age);
  };

  const deletePerson = async (id) => {
    await deletePersonById(id);
    loadPersons();
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
        {persons.map((p) => (
          <PersonCard
            key={p.id}
            p={p}
            editPerson={editPerson}
            deletePerson={deletePerson}
          />
        ))}
      </div>

    </div>
  );
}
