import { Link } from "react-router-dom";

const Pagination = ({
    postsPerPage,
    setPostsPerPage,
    totalPosts,
    paginate,
    previousPage,
    nextPage,
    currentPage,
    maxPageNumberLimit,
    minPageNumberLimit
}) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pageNumbers.push(i)
    }

    const renderPagesNumbers = pageNumbers.map(number => {
        if (number < maxPageNumberLimit + 1 && number >= minPageNumberLimit) {
            return (
                < Link onClick={() => paginate(number)} href=" " key={number} className={`page-link${number === currentPage ? '-active' : ''}`}>
                    {number}
                </Link>
            )
        } else {
            return null
        }
    })

    return (
        <nav>
            <div className="pagination">
                <Link onClick={() => previousPage()} href=" " key={0} className="page-link">
                    &lt;
                </Link>
                {renderPagesNumbers}
                <Link onClick={() => nextPage()} href=" " key={Math.ceil(totalPosts / postsPerPage) + 1} className="page-link">
                    &gt;
                </Link>
                <select
                    name="posts-per-page"
                    id="posts-per-page"
                    value={postsPerPage}
                    onChange={(e) => setPostsPerPage(e.target.value)}
                    style={{ width: 'auto', textAlign: 'start', marginLeft: 'auto' }}
                >
                    <option value={"5"}>5 / page</option>
                    <option value={"10"}>10 / page</option>
                    <option value={"25"}>25 / page</option>
                </select>
            </div>
        </nav >
    );
}

export default Pagination;