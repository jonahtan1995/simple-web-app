const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { resolve } = require('path');

const app = express();
const port = 3010;

app.use(cors());

app.get('/api/getGithubUsers', async (req, res) => {
    const query = req.query.q || '';
    const perPage = parseInt(req.query.per_page, 10) || 30;
    let requestedPage = parseInt(req.query.page, 10) || 1;

    const maxAllowedPage = Math.ceil(1000 / perPage);

    if (requestedPage > maxAllowedPage) {
        requestedPage = maxAllowedPage;
    }

    try {
        const response = await fetch(
            `https://api.github.com/search/users?q=${query}&per_page=${perPage}&page=${requestedPage}`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'Authorization': `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(JSON.stringify(errorData));
        }

        const data = await response.json();
        const usersWithRepoCount = await Promise.all(
            data.items.map(async (item) => {
                try {
                    const userResponse = await fetch(
                        `https://api.github.com/users/${item.login}`,
                        {
                            method: 'GET',
                            headers: {
                                'Accept': 'application/vnd.github.v3+json',
                                'Authorization': `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
                                'Content-Type': 'application/json',
                            },
                        }
                    );

                    if (!userResponse.ok) {
                        throw new Error(`Failed to fetch repos for ${item.login}`);
                    }

                    const userData = await userResponse.json();
                    return {
                        username: item.login,
                        image: item.avatar_url,
                        html_url: item.html_url,
                        repos: userData.public_repos,
                    };
                } catch (err) {
                    console.error(`Error fetching repos for user ${item.login}:`, err.message);
                    return {
                        username: item.login,
                        image: item.avatar_url,
                        html_url: item.html_url,
                        repos: 'N/A',
                    };
                }
            })
        );

        const paginationData = {
            total_count: data.total_count,
            per_page: perPage,
            page: requestedPage,
            total_pages: Math.min(Math.ceil(data.total_count / perPage), maxAllowedPage),
            capped_at_1000: true,
        };

        res.status(200).json({
            users: usersWithRepoCount,
            pagination: paginationData,
            message: requestedPage === maxAllowedPage
                ? `Results are capped at 1,000. Showing page ${requestedPage} of ${maxAllowedPage}.`
                : undefined,
        });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: JSON.parse(error.message) });
    }
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
