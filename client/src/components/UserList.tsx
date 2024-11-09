import { useEffect, useState } from "react";
import Pagination from "./Pagination.tsx";
import { PacmanLoader } from "react-spinners";

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
                    // Assuming API returns `profileUrl` for each user. If not, construct it as shown below
                    const userList = users.map((user: any) => ({
                        ...user,
                        profileUrl: `https://github.com/${user.username}`, // Adjust if needed
                    }));
                    setUsers(userList);
                    setPaginationData(pagination);
                    setLoader(false);
                })
                .catch((error) => console.log(error));
        }
    }, [searchQuery, page]);

    return (
        <div>
            {loader ? (
                <div>
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
                    {users.map((user) => (
                        <a
                            href={user.profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            key={user.username}
                            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
                        >
                            <img src={user.image} alt="user avatar" style={{ width: '50px', borderRadius: '50%' }} />
                            <div style={{ marginLeft: '10px' }}>
                                <div>{user.username}</div>
                                <div>{user.repos} repositories</div>
                            </div>
                        </a>
                    ))}
                    <Pagination paginationData={paginationData} setPage={setPage} page={page} />
                </>
            )}
        </div>
    );
}

export default UserList;
