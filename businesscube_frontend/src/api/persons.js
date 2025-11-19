import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL.endsWith("/")
  ? import.meta.env.VITE_API_URL + "api/persons"
  : import.meta.env.VITE_API_URL + "/api/persons";

const API = axios.create({ baseURL });

export const getAllPersons = () => API.get(""); // fetch all persons
export const createPerson = (data) => API.post("/create", data);
export const updatePerson = (id, data) => API.put(`/update/${id}`, data);
export const deletePersonById = (id) => API.delete(`/delete/${id}`);
