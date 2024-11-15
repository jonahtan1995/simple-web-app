// server/index.js
const express = require("express");
const cors = require("cors");
const {
    fetchGithubUsers,
    getUsersWithRepoCount,
} = require("./services/githubService");
const config = require("./config");

const app = express();
const port = config.LOCAL_API_URL.split(":").pop();

app.use(cors());

app.get("/api/getGithubUsers", async(req, res) => {
    const query = req.query.q || "";
    const perPage = parseInt(req.query.per_page, 10) || 30;
    let page = parseInt(req.query.page, 10) || 1;
    const maxAllowedPage = Math.ceil(1000 / perPage);

    if (page > maxAllowedPage) page = maxAllowedPage;

    try {
        // Fetch GitHub users
        const data = await fetchGithubUsers(query, perPage, page);
        const usersWithRepoCount = await getUsersWithRepoCount(data.items);

        // Calculate pagination data
        const paginationData = {
            total_count: data.total_count,
            per_page: perPage,
            page,
            total_pages: Math.min(
                Math.ceil(data.total_count / perPage),
                maxAllowedPage
            ),
            capped_at_1000: true,
        };

        res.status(200).json({
            users: usersWithRepoCount,
            pagination: paginationData,
            message: page === maxAllowedPage ?
                `Results are capped at 1,000. Showing page ${page} of ${maxAllowedPage}.` : undefined,
        });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: JSON.parse(error.message) });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});