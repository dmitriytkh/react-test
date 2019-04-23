import React from 'react';

class Pagination extends React.Component {
  /**
   * Constructor
   *
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = {
      init: 1,
      pager: {
        pageSize: 10
      },
      change: false
    };
  }

  /**
   * Set pagination when component did mount
   */
  componentDidMount() {
    if (this.props.items && this.props.items.length) {
      this.setPage(this.state.init);
    }
  }

  /**
   * Set pagination when component did update
   *
   * @param prevProps
   * @param prevState
   */
  componentDidUpdate(prevProps, prevState) {
    if (this.props.items !== prevProps.items || this.props.items.length !== prevState.pager.totalItems) {
      this.setPage(this.state.pager.currentPage);
    }
  }

  /**
   * Set pagination
   *
   * @param page
   */
  setPage = page => {
    let { items } = this.props;
    let { pageSize } = this.state.pager;
    if (page < 1) {
      page = this.state.init;
    } else if (page > this.state.pager.totalPages) {
      page = this.state.pager.totalPages;
    }
    let pager = this.getPager(items.length, page, pageSize);
    let pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);
    this.setState({
      pager: pager,
    });
    this.props.onChangePage(pageOfItems, pager);
  };

  /**
   * Get pagination
   *
   * @param totalItems
   * @param currentPage
   * @param pageSize
   * @returns {{totalItems: *, startPage: number, startIndex: number, pages: number[], endIndex: number, totalPages: number, pageSize: *, endPage: number, currentPage: (*|number)}}
   */
  getPager(totalItems, currentPage, pageSize) {
    currentPage = currentPage || 1;
    let totalPages = Math.ceil(totalItems / pageSize);

    let startPage, endPage;
    if (totalPages <= 5) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 3) {
        startPage = 1;
        endPage = 5;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
    let pages = [...Array((endPage + 1) - startPage).keys()].map(i => startPage + i);
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }

  /**
   * Render pagination
   *
   * @returns {null|*}
   */
  render() {
    let { pager } = this.state;

    if (!pager.pages || pager.pages.length <= 1) {
      return null;
    }

    return (
      <ul className="pagination">
        <li className={`${pager.currentPage === 1 && 'disabled'} page-item`}>
          <a onClick={() => this.setPage(1)} className='page-link'>First</a>
        </li>
        <li className={`${pager.currentPage === 1 && 'disabled'} page-item`}>
          <a onClick={() => this.setPage(pager.currentPage - 1)} className='page-link'>
            <span aria-hidden="true">&laquo;</span>
            <span className="sr-only">Previous</span>
          </a>
        </li>
        {pager.pages.map((page, index) =>
          <li key={index} className={pager.currentPage === page ? 'active page-item' : 'page-item'}>
            <a onClick={() => this.setPage(page)} className='page-link'>{page}</a>
          </li>
        )}
        <li className={`${pager.currentPage === pager.totalPages && 'disabled'} page-item`}>
          <a onClick={() => this.setPage(pager.currentPage + 1)} className='page-link'>
            <span aria-hidden="true">&raquo;</span>
            <span className="sr-only">Next</span>
          </a>
        </li>
        <li className={`${pager.currentPage === pager.totalPages && 'disabled'} page-item`}>
          <a onClick={() => this.setPage(pager.totalPages)} className='page-link'>Last</a>
        </li>
      </ul>
    );
  }
}

export default Pagination;
