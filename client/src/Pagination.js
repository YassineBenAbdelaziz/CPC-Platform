import { Link } from "react-router-dom";

const Pagination = ({ postsPerPage, setPostsPerPage, totalPosts, paginate, previousPage, nextPage, currentPage }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pageNumbers.push(i)
    }

    return (
        <nav>
            <div className="pagination">
                <Link onClick={() => previousPage()} href=" " key={0} className="page-link">
                    &lt;
                </Link>
                {pageNumbers.map(number => (
                    <Link onClick={() => paginate(number)} href=" " key={number} className={`page-link${number === currentPage ? '-active' : ''}`}>
                        {number}
                    </Link>
                ))}
                <Link onClick={() => nextPage()} href=" " key={Math.ceil(totalPosts / postsPerPage)} className="page-link">
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
        </nav>
    );
}

export default Pagination;