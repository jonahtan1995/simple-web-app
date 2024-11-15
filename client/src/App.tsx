import { useEffect, useState } from "react";
import "./App.css";
import SearchInput from "./components/SearchInput.tsx";
import UserList from "./components/UserList.tsx";
import { API_URL } from "./config.ts";

function App() {
  const [beatles, setBeatles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchBeatles = async () => {
      try {
        const response = await fetch(`${API_URL}/beatles`, { method: "GET" });
        const { data } = await response.json();
        setBeatles(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBeatles();
  }, []);

  return (
    <>
      <SearchInput setSearchQuery={setSearchQuery} />
      <UserList searchQuery={searchQuery} />
    </>
  );
}

export default App;
