import { useEffect, useState } from "react";
import Pagination from "./Pagination.tsx";
import { PacmanLoader } from "react-spinners";
import './UserList.css';

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
    const [paginationData, setPaginationData] = useState({});
    const [page, setPage] = useState(undefined);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        if (searchQuery && !page) {
            setPage(1);
        }
        if (searchQuery && page) {
            setLoader(true);
            fetch(`http://localhost:3010/api/getGithubUsers?q=${searchQuery}&page=${page}`, {
                method: 'GET',
            })
                .then((response) => response.json())
                .then(({ users, pagination }) => {
                    const userList = users.map((user: any) => ({
                        ...user,
                        profileUrl: `https://github.com/${user.username}`, 
                    }));
                    setUsers(userList);
                    setPaginationData(pagination);
                    setLoader(false);
                })
                .catch((error) => console.log(error));
        }
    }, [searchQuery, page]);

    return (
        <div className="user-list-container">
            {loader ? (
                <div className="loader-container">
                    Loading...
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
                            >
                                <img src={user.image} alt="user avatar" className="user-avatar" />
                                <div className="user-info">
                                    <div className="user-name">{user.username}</div>
                                    <div className="user-repos">{user.repos} repositories</div>
                                </div>
                            </a>
                        ))}
                    </div>
                    <Pagination paginationData={paginationData} setPage={setPage} page={page} />
                </>
            )}
        </div>
    );
}

export default UserList;
