import axios from "axios";

const API = "http://astraval.com:8085/api/persons";

export const getAllPersons = () => axios.get(API);

export const createPerson = (data) => axios.post(API + "/create", data);

export const updatePerson = (id, data) =>
  axios.put(API + `/update/${id}`, data);

export const deletePersonById = (id) =>
  axios.delete(API + `/delete/${id}`);
