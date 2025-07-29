
import "./favorites.bar.containers.css";

export default function FavoritesBarView({ favorites }) {

    const list = Object.values(favorites || {});

    return (
        <section id="FavoritesBar" className="favorites-bar">
            <div className="container-bar-favorites">
                <h1> Meus Repositórios Favoritos</h1>

                {list.length === 0 ? (
                    <p>Você ainda não favoritou nenhum repositório.</p>
                ) : (
                    <ul className="container-list-favorites">
                        {list.map(repo => (
                            <li className="item-list-favorites" key={repo.id}>
                                <a href={repo.url} target="_blank" rel="noopener noreferrer" className="link-favorites">
                                    {repo.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}