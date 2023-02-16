import * as modal from "./modal.js";
import { MODAL_CLOSE_SEC } from "./config.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import "core-js/stable";
import "regenerator-runtime/runtime";
import { async } from "regenerator-runtime";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";

///////////////////////////////////////

async function controlRecipes() {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    //update results view to mark selected search result
    resultsView.update(modal.getSearchResultsPage());
    //updating bookmarks view;

    bookmarksView.update(modal.state.bookmark);

    //load recipe
    await modal.loadRecipe(id);

    //rendering recipe
    recipeView.render(modal.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
}

async function controlSearchResults() {
  try {
    resultsView.renderSpinner();
    //get search query
    const query = searchView.getQuery();
    if (!query) {
      return;
    }

    //load search query
    await modal.loadSearchResults(query);

    //render results
    // resultsView.render(modal.state.search.results);
    resultsView.render(modal.getSearchResultsPage());

    //render initial pagination buttons
    paginationView.render(modal.state.search);
  } catch (error) {
    console.log(error);
  }
}

function controlPagination(goToPage) {
  //render  new results

  resultsView.render(modal.getSearchResultsPage(goToPage));

  //render new pagination buttons
  paginationView.render(modal.state.search);
}

function controlServings(newServings) {
  //Update the recipe servings(in state)
  modal.updateServings(newServings);
  //Update the recipe view

  recipeView.update(modal.state.recipe);
}

function controlAddBookmark() {
  //Add or remove bookmarks
  if (!modal.state.recipe.bookmarked) {
    modal.addBookmark(modal.state.recipe);
  } else {
    modal.deleteBookmark(modal.state.recipe.id);
  }

  //update recipe view
  recipeView.update(modal.state.recipe);

  //render bookmark
  bookmarksView.render(modal.state.bookmark);
}

function controlBookmarks() {
  bookmarksView.render(modal.state.bookmark);
}

async function controlAddRecipe(newRecipe) {
  try {
    //Show spinner
    addRecipeView.renderSpinner();

    //Upload new recipe data
    await modal.uploadRecipe(newRecipe);
    console.log(modal.state.recipe);

    //render recipe
    recipeView.render(modal.state.recipe);

    //Display success message
    addRecipeView.renderMessage();

    //Render bookmark view
    bookmarksView.render(modal.state.bookmark);

    //Change ID in URL
    window.history.pushState(null, "", `#${modal.state.recipe.id}`);
    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
}
function init() {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addhandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}

init();
