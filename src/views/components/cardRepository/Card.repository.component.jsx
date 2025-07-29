import "./card.repository.component.css";

const CardRepository = ({
    id,
    name,
    url,
    description,
    stars,
    watchers,
    forks,
    issues,
    language,
    license,
    date,
    isFavorited,
    toggleFavorite
}) => {

    return (
        <div className="card-repository" data-id={id}>
            <div className="container">
                <div className="name-repository">
                    <i className="bx bx-book"></i>
                    <h1>{name}</h1>
                </div>

                <a href={url} target="_blank" rel="noopener noreferrer" className="link-repository" > {url} </a>

                <p className="description">{description}</p>

                <div className="stats-repository">
                    <span><i className="bx bxs-star"></i> Estrelas: {stars} </span>
                    <span><i className="bx bx-eye"></i> Watchers: {watchers} </span>
                    <span><i className="bx bx-git-repo-forked"></i> Forks: {forks} </span>
                    <span><i className="bx bx-bug"></i> Issues: {issues} </span>
                </div>

                <div className="information-repository">
                    <span> <i className="bx bx-code"></i> Linguagem: {language} </span>
                    <span> <i className="bx bx-file"></i> Licença: {license} </span>
                    <span> <i className="bx bx-calendar"></i> Data: {new Date(date).toLocaleDateString("pt-BR")} </span>
                </div>

                <button className="favorite-repository" onClick={toggleFavorite}>
                    <i className={`bx ${isFavorited ? "bxs-star" : "bx-star"}`}></i>
                    {isFavorited ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
                </button>
            </div>
        </div>
    );
};

export default CardRepository;
