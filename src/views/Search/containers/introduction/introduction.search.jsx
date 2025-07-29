import "./introduction.search.css";

import { useState, useEffect } from "react";

import { useLocation } from "react-router-dom";
import { UseSearchRepository } from "../../../../controllers/UseSearchRepository.controllers.jsx";

import Dropdown from "../../../components/dropdown/Dropdown.component.jsx";
import Pagination from "../../../components/pagination/Pagination.component.jsx"
import FavoritesBar from "../../../components/favoritesBar/Favorites.bar.containers.jsx"
import CardRepository from "../../../components/cardRepository/Card.repository.component.jsx";

export default function IntroductionSearch() {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("q") || "node";
    const option = queryParams.get("option") || "stars";

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const perPage = 5;

    useEffect(() => {
        setSearch(query)
        setPage(1);
    }, [query]);

    const { data, loading, error } = UseSearchRepository(search, option, page, perPage);

    const FAVORITES_KEY = import.meta.env.VITE_FAVORITES_KEY;
    const [favorites, setFavorites] = useState({});

    useEffect(() => {
        const savedFavs = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || {};
        setFavorites(savedFavs);
    }, [FAVORITES_KEY]);

    const handleToggleFavorite = (repo) => {
        setFavorites((prevFavs) => {
            const newFavs = { ...prevFavs };
            if (newFavs[repo.id]) {
                delete newFavs[repo.id];
            } else {
                newFavs[repo.id] = {
                    id: repo.id,
                    name: repo.full_name,
                    url: repo.html_url,
                };
            }
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavs));
            return newFavs;
        });
    };

    return (
        <>
            <section id="IntroductionSearch" className="introduction-search">
                <div className="container-introduction">

                    <FavoritesBar favorites={favorites} />

                    <div className="container-card">
                        {loading && <p className="text-loading">Carregando...</p>}
                        {error && <p className="text-erro">Carregando... Aguarde um momento e atualize a página!</p>}

                        {!loading && data.items.length > 0 && (
                            <>
                                <div className="title-results">
                                    <p>{data.total_count} Resultados</p>
                                    <Dropdown />
                                </div>

                                {data.items.map(repo => (
                                    <CardRepository
                                        key={repo.id}
                                        id={repo.id}
                                        name={repo.full_name}
                                        url={repo.html_url}
                                        description={repo.description}
                                        stars={repo.stargazers_count}
                                        watchers={repo.watchers_count}
                                        forks={repo.forks_count}
                                        issues={repo.open_issues_count}
                                        language={repo.language || "Não informado"}
                                        license={repo.license?.name || "Não informado"}
                                        date={repo.created_at}
                                        isFavorited={!!favorites[repo.id]}
                                        toggleFavorite={() => handleToggleFavorite(repo)}
                                    />
                                ))}

                                <Pagination page={page} total={data.total_count} perPage={perPage} onPageChange={setPage} />
                            </>
                        )}

                        {!loading && data.items.length === 0 && (
                            <p className="text-null-result">Nenhum repositório encontrado para "{search}".</p>
                        )}

                        {!loading && !data && !error && <p>Nenhum dado disponível.</p>}
                    </div>
                </div>
            </section>
        </>
    );
}