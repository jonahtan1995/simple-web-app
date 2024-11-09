interface PaginationProps {
    paginationData: {
        total_count: number;
        per_page: number;
        page: number;
        total_pages: number;
        capped_at_1000: boolean;
    },
    setPage: (arg0: number) => void;
    page: number;
}

const Pagination = ({ paginationData, setPage, page } : PaginationProps) => {

    function HandlePagination(value: number) {
        setPage(page + value);
    }
    return (
        <div>
            {page > 1 && <button onClick={() => HandlePagination(-1)}>Previous</button>}
            {page < paginationData.total_pages && <button onClick={() => HandlePagination(1)}>Next</button>}
        </div>
    );
}

export default Pagination;
