import axios from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe(){
        try {
            const res = await axios (`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            console.log(error);
            alert('Something went wrong');
        }
    }
    calcTime(){
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods *15;
    }
    calcServings(){
        this.servings = 4;
    }
    parseIngredients(){
        const unitLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoon', 'teaspoons', 'cups', 'pounds'];
        const unitShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tbsp', 'tbsp', 'cup', 'pound' ];
        const units = [... unitLong, 'kg', 'g'];

        const newIngredients = this.ingredients.map(el => {
        //Uniform units
        let ingredient = el.toLowerCase();
        unitLong.forEach((unit, i) => {
            ingredient = ingredient.replace(unit, unitShort[i])
        });
        //Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

        //Parse ingredients into count, unit and ingredient

            const arrIng = ingredient.split (' ');
            const unitIndex = arrIng.findIndex(el2 => unitLong.includes(el2));

            let objIng;

            if (unitIndex > -1) {
                //There is a unit
                // Ex.4 1/2 cups, arrCount is [4, 1/2]
                //Ex. 4 cups, arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex);
                let count;

                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-'), ('+'));
                } else {
                    count = eval (arrIng.slice(0, unitIndex).join ('+'));
                }
                objIng = {
                    count,
                    unit: arrIng(unitIndex),
                    ingredient: arrIng.slice(unitIndex + 1).join (' ')
                };

            } else if (parseInt(arrIng[0], 10)) {
                //There is No unit, but first element is a number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                //There is NO unit
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

        return objIng;
        });
        this.ingredients = newIngredients
    }
updateServings(type){
    //Servings
    const newServings = type === 'dec' ? this.servings - 1 : this.servings +1;

    //ingredients
    this.ingredients.forEach(ing => {
        ing.count = ing.count *= (newServings / this.servings);
    });

    this.servings = newServings;
}

}
