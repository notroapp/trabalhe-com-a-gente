import "./pagination.component.css"

const Pagination = ({ page, total, perPage, onPageChange }) => {

    const totalPages = Math.ceil(total / perPage);

    return (
        <div className="pagination-container">
            <button disabled={page <= 1} onClick={() => onPageChange(page - 1)}><i className="bx bx-chevron-left"></i> Anterior</button>
            <span> Página {page} de {totalPages} </span>
            <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>  Próxima <i className="bx bx-chevron-right"></i></button>
        </div>
    );
};

export default Pagination;