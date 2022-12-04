import React, { useState, useEffect } from 'react';

import { BlogCard } from '../elements';
import blogData from '../../utils/blogData.json';

export default function Blog() {
  const numberPerPage = 3;
  const [pageNumbers, setPageNumbers] = useState([]);

  useEffect(() => {
    const list = [];

    /* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
    for (let i = 0; i < Math.ceil(blogData.length / numberPerPage); i++) {
      list.push(i + 1);
    }

    setPageNumbers(list);
  }, []);

  // const [pageList, setPageList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  function nextPage() {
    const next = currentPage + 1;
    if (next > pageNumbers.length) return;

    setCurrentPage(next);
  }

  function previousPage() {
    const previous = currentPage - 1;
    if (previous < 1) return;

    setCurrentPage(previous);
  }

  // function setPage(page) {
  //   setCurrentPage(page);
  //   console.log(currentPage, page);
  // }

  return (
    <div className="col-md-9 mx-auto">
      {blogData.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
      <nav className="col-12" style={{ marginLeft: '20px' }} aria-label="Page navigation example">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button type="button" className="page-link" onClick={previousPage}>
              Previous
            </button>
          </li>
          {pageNumbers.map((page) => (
            <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
              <button type="button" className="page-link">
                {page}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === pageNumbers.length ? 'disabled' : ''}`}>
            <button type="button" className="page-link" onClick={nextPage}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
