import { Link } from "react-router-dom";

const Pagination = ({ postsPerPage, totalPosts, paginate }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pageNumbers.push(i)
    }

    return (
        <nav>
            <div className="pagination">
                {pageNumbers.map(number => (
                    <Link onClick={() => paginate(number)} href="/problemset" key={number} className="page-link">
                        {number}
                    </Link>
                ))}
            </div>
        </nav>
    );
}

export default Pagination;