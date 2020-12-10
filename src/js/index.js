//main controller//
import Search from './models/Search';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import {elements, renderLoader, clearLoader} from './views/base';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';


//global state of app//

const state = {};


const controlSearch = async () => {
    //1) get query from view
    const query = searchView.getInput();
  
   
    if (query) {
        //2) new search obj & add to state
        state.search = new Search(query);
        //3) prepare UI for details
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {

        //4) search for recipes
        await state.search.getResults();

        //5)render results on UI
            clearLoader();
        searchView.renderResults(state.search.result);

        } catch (err) {
            alert ('Error')
            clearLoader();
        }
        
    }
}
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});


elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage =parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

//Recipe Controller *****

const controlRecipe = async () => {
    // Get ID from URL
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
        //Prepare ui for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Highlight selected
       if(state.search)searchView.highlightSelected(id);

        //Create new Recipe object
        state.recipe = new Recipe(id)
        
        try {

        //Get Recipe data & parse ingredients
        
        await state.recipe.getRecipe();
        state.recipe.parseIngredients();

        //Calculate servings and time
        state.recipe.calcTime();
        state.recipe.calcServings();

        //Render recipe
        clearLoader();
        recipeView.renderRecipe(
            state.recipe,
            state.likes.isLiked(id)
            );

        } catch (err) {
            console.log(err);
            alert ('Error processing Recipe!');
        }
        
    }

}


window.addEventListener('hashchange', controlRecipe);
window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

//List Controller *****

const controlList = () => {
    //Create a new list if there is none
    if (!state.list) state.list = new List();

    //Add each ingredient to the list & UI
    state.recipe.ingredients.forEach(el => {
      const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

//Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    //Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')){
        //Delete from state
        state.list.deleteItem(id);

        //Delete from UI
        listView.deleteItem(id);

        //Handle the count
    } else if (el.target.matches('.shopping__count-value')){
        const val =  parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

        state.likes = new Likes();
        likesView.toggleLikesMenu(state.likes.getNumLikes);
        //Like Controller ****
    


        const controlLike = () => {
            if (!state.likes) state.likes = new Likes();
            const currentID = state.recipe;

            //User has not liked current recipe
            if (!state.likes.isLiked(currentID)){

            //Add like to the state
                const newLike= state.likes.addLike(
                    currentID,
                    state.recipe.title,
                    state.recipe.author,
                    state.recipe.img,
                );

            //Toggle the like button


            //Add like to the UI list
                    console.log(state.likes);

                //User has liked current recipe

            } else {
                //Remove like from the state
                state.likes.deleteLike(currentID);

                //Toggle the like button
                likesView.toggleLikesBtn(true);
                //Remove the like from UI list
                likesView.toggleLikesBtn(false);
            }
            likesView.toggleLikesMenu(state.likes.getNumLikes)
        };

//Handling recipe button clicks
elements.recipe.addEventListener('click', e =>{
    if (e.target.matches('.btn-decrease, .btn-decrease *')){
        //Decrease button is clicked
        if(state.recipe.servings > 1)
        state.recipe.updateServings('dec');
        recipeView.updateServingsIngredients(state.recipe);
        
    } else if (e.target.matches('.btn-increase, .btn-increase *')){
        //Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        //Add ingredients to list
        controlList();
     } else if (e.target.matches('.recipe__love, .recipe__love *')){
            //Like Controller
            controlLike();
        }
});

 window.l = new List();