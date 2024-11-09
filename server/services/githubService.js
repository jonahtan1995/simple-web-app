const config = require("../config");

async function fetchGithubUsers(query, perPage, page) {
    const response = await fetch(
        `${config.GITHUB_API_URL}/search/users?q=${query}&per_page=${perPage}&page=${page}`, {
            method: "GET",
            headers: {
                Accept: "application/vnd.github.v3+json",
                Authorization: `Bearer ${config.GITHUB_TOKEN}`,
                "Content-Type": "application/json",
            },
        }
    );
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
    }
    return response.json();
}

async function fetchUserRepoCount(username) {
    const response = await fetch(`${config.GITHUB_API_URL}/users/${username}`, {
        method: "GET",
        headers: {
            Accept: "application/vnd.github.v3+json",
            Authorization: `Bearer ${config.GITHUB_TOKEN}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch repos for ${username}`);
    }
    const userData = await response.json();
    return userData.public_repos;
}

async function getUsersWithRepoCount(users) {
    return Promise.all(
        users.map(async(user) => {
            try {
                const repos = await fetchUserRepoCount(user.login);
                return {
                    username: user.login,
                    image: user.avatar_url,
                    html_url: user.html_url,
                    repos,
                };
            } catch (error) {
                console.error(
                    `Error fetching repos for user ${user.login}: ${error.message}`
                );
                return {
                    username: user.login,
                    image: user.avatar_url,
                    html_url: user.html_url,
                    repos: "N/A",
                };
            }
        })
    );
}

module.exports = { fetchGithubUsers, getUsersWithRepoCount };