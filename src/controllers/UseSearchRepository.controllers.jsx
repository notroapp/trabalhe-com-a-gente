import { useState, useEffect } from 'react';
import { fetchGitHubRepositories } from '../models/GitHubAPI.model.jsx';

export const UseSearchRepository = (query, option, page, perPage) => {
    const [data, setData] = useState({ items: [], total_count: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!query) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await fetchGitHubRepositories(query, option, page, perPage);
                setData(result);
            } catch (err) {
                setError(err.message || 'Erro ao buscar dados');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [query, option, page, perPage]);

    return { data, loading, error };
};
