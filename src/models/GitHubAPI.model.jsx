import axios from 'axios';

const GITHUB_API_URL = import.meta.env.VITE_GITHUB_API_URL;

export const fetchGitHubRepositories = async (query, option, page = 1, perPage = 5) => {
    try {
        const response = await axios.get(GITHUB_API_URL, {
            params: {
                q: query,
                page,
                per_page: perPage,
                sort: option,
                order: 'desc',
            },
            headers: {
                'Accept': 'application/vnd.github.v3+json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Erro ao buscar repositórios do GitHub:', error.message);
        throw error;
    }
};