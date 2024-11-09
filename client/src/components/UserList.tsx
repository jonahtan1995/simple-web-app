import { useEffect, useState } from "react";
import Pagination from "./Pagination.tsx";
import { PacmanLoader } from "react-spinners";
import "./UserList.css";
import { API_URL } from "../config.ts";

interface User {
  username: string;
  image: string;
  repos: number;
  profileUrl: string;
}

interface UserListProps {
  searchQuery: string;
}

const UserList = ({ searchQuery }: UserListProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [paginationData, setPaginationData] = useState({
    total_count: 0,
    per_page: 30,
    page: 1,
    total_pages: 1,
    capped_at_1000: false,
  });
  const [page, setPage] = useState(1);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (searchQuery && page) {
        setLoader(true);
        try {
          const response = await fetch(
            `${API_URL}/getGithubUsers?q=${searchQuery}&page=${page}`,
            { method: "GET" }
          );
          const { users, pagination } = await response.json();

          const userList = users.map((user: User) => ({
            ...user,
            profileUrl: `https://github.com/${user.username}`, 
          }));
          setUsers(userList);
          setPaginationData(pagination);
        } catch (error) {
          console.log(error);
        } finally {
          setLoader(false);
        }
      }
    };

    fetchUsers();
  }, [searchQuery, page]);

  return (
    <div className="user-list-container">
      {loader ? (
         <div className="loader-container">
        <div className="loading-text">Loading...</div> {}
          <PacmanLoader
            color={"#000"}
            loading={loader}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <>
          {users.length > 0 && (
            <h2 className="results-header">Search Results</h2>
          )}
          <div className="user-grid">
            {users.map((user) => (
              <a
                href={user.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                key={user.username}
                className="user-card"
                style={{ pointerEvents: "auto" }} 
              >
                <img
                  src={user.image}
                  alt="user avatar"
                  className="user-avatar"
                />
                <div className="user-info">
                  <div className="user-name">{user.username}</div>
                  <div className="user-repos">{user.repos} repositories</div>
                </div>
              </a>
            ))}
          </div>
          <Pagination
            paginationData={paginationData}
            setPage={setPage}
            page={page}
          />
        </>
      )}
    </div>
  );
};

export default UserList;
