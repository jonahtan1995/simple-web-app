import { useEffect, useState } from 'react';
import './App.css';
import SearchInput from "./components/SearchInput.tsx";
import UserList from "./components/UserList.tsx";

function App() {
  const [beatles, setBeatles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('http://localhost:3010/api/beatles', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then(({ data }) => {
        console.log(data);
        setBeatles(data);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
      <>
        <SearchInput setSearchQuery={setSearchQuery}/>
        <UserList searchQuery={searchQuery} />
      </>
  );
}

export default App;
