import View from "./View";
import icons from "url:../../img/icons.svg";

class paginationView extends View {
  _parentElement = document.querySelector(".pagination");

  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--inline");
      if (!btn) {
        return;
      }
      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _pagesArray(numPages) {
    const pages = [];
    for (let i = 0; i < numPages + 1; i++) {
      pages.push(i);
    }
    const pagesArr = pages.slice(1);
    return pagesArr;
  }
  #generateMarkupBtns(curPage, numPages) {
    const nextPage = `
    <button data-goto="${
      curPage + 1
    }" class="btn--inline pagination__btn--next">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
        <span>Page ${curPage + 1}</span>
      </svg>
    </button>
  `;

    // const numBtn = this._pagesArray(numPages).forEach((page) => {
    //   let btn = document.createElement("button");
    //   btn.innerText = page;
    //   if (curPage === page) btn.classList.add("active");
    //   this._parentElement.appendChild(btn);

    // });

    const prevPage = `
    <button data-goto="${
      curPage - 1
    }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${curPage - 1}</span>
    </button>
  `;

    //Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return nextPage;
    }
    //Last page
    if (curPage === numPages && numPages > 1) {
      return prevPage;
    }
    //Other pages
    if (curPage < numPages) {
      return prevPage + nextPage;
    }
    //Page 1, and there are no other pages
    return "";
  }

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    const curPage = this._data.page;
    return this.#generateMarkupBtns(curPage, numPages);
  }
}

export default new paginationView();
