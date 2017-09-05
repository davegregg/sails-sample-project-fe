const Rest = require('node-rest-client')
const client = new Rest.Client()

const base = 'http://my-fantastic-recipes-api.herokuapp.com/api'
const readableUnits = ['Cup', '&frac12; Cup', '&#8531; Cup', '&frac14; Cup', '&#8539; Cup', 'Tbsp.',      '&frac12; Tbsp.',  'Tsp.',     '&frac12; Tsp.', '&frac14; Tsp.',    'Ounce', 'Pint', 'Quart', 'Liter', 'Gallon', 'Pinch', 'Dash', 'Drop', 'Stick', 'Whole', 'Half']
const enumUnits     = ['CUP', 'HALF_CUP',     'THIRD_CUP',   'QUARTER_CUP',  'EIGHTH_CUP',  'TABLESPOON', 'HALF_TABLESPOON', 'TEASPOON', 'HALF_TEASPOON', 'QUARTER_TEASPOON', 'OUNCE', 'PINT', 'QUART', 'LITER', 'GALLON', 'PINCH', 'DASH', 'DROP', 'STICK', 'WHOLE', 'HALF']
const buildArgs = body => ({ data: body, headers: { 'Content-Type': 'application/json' }})

const ensureArray = array => array !== undefined ? [].concat(array) : []
const lastIndex = array => array.length - 1

const prettyPrint = (ident, obj) => sails.log(`${ident}: ${JSON.stringify(obj, null, 2)}`)
const stub = [
  {
    "id": 1,
    "name": "The good stuff",
    "description": "A great recipe",
    "instructions": [
      {
        "id": 101,
        "instructionText": "Brown some hamburger"
      }
    ],
    "ingredients": [
      {
        "id": 201,
        "name": "Gouda Cheese",
        "preparation": "Cubed",
        "measure": {
          "id": 1,
            "quantity": 2,
            "units": "OUNCE"
        }
      }
    ],
    "recipePicture": "http://via.placeholder.com/200x200"
  }
]


module.exports = {

  getRecipes: res => client.get(`${base}/recipes`, recipesRes => {
    res.view('recipe/index', { recipes: recipesRes })
  }),

  getRecipe: (res, id) => client.get(`${base}/recipes/${id}`, recipeRes => {
    res.view('recipe/show', { recipe: recipeRes })
  }),

  getIngredients: (res, req) => {
    client.get(`${base}/recipes/${req.params.id}/ingredients`, ingredientsRes => {
      prettyPrint('ingredientsRes', ingredientsRes)
      res.view('measure/create', { ingredients: ingredientsRes, units: readableUnits })
    })
  },

  createRecipe: (res, body) => {
    prettyPrint('createRecipe body (clientservice)', body)
    const args = buildArgs({
      name: body.name,
      description: body.description,
      recipePicture:
        body.recipePicture.match(/\.(gif|jpg|jpeg|tiff|png)$/i) && body.recipePicture
    })

    client.post(`${base}/recipes`, args, recipeRes => {
      prettyPrint('Response to recipe POST', recipeRes)
      const ingredients = ensureArray(body.ingredients)
      ingredients.forEach((ingredient, index) => {
        prettyPrint('ingredient', ingredient)
        const args = buildArgs([{ name: ingredient }])
        client.post(`${base}/recipes/${recipeRes.id}/ingredients`, args, ingredientRes => {
          prettyPrint('Response to ingredient POST', ingredientRes)
          if (index === lastIndex(ingredients)) { // TODO: Use a promise instead
            return res.json({ link: `create/${recipeRes.id}/measurements` })
          }
        })
      })
    })
  },

/*
---
POST http://my-fantastic-recipes-api.herokuapp.com/api/ingredients/:ingredientId/measures
---
// /api/ingredients/:ingredientId/measures (accepts an object)
*/
  createMeasures: (res, body) => {
    body.forEach(function(ingredient, index) {
      const args = buildArgs({
        quantity: ingredient.measure.quantity,
        units: enumUnits[ingredient.measure.enumUnitsIndex]
      })
      prettyPrint('createMeasures POST args', args)
      client.post(`${base}/ingredients/${ingredient.id}/measures`, args, data => {
        if (index === lastIndex(body)) { // TODO: Use a promise instead
          return res.json({ link: '/' })
        }
      })
    })
  },

  updateRecipe: (res, id) => client.get(`${base}/recipes/${id}`, data => {
    res.view('recipe/update', { recipe: data })
  }),

  
/*
---
DELETE http://my-fantastic-recipes-api.herokuapp.com/api/recipes/:recipeId
---
// /api/recipes/:recipeId (Does not accept an object)
*/

  deleteRecipe: function (res, req) {

    if (req.method === "GET") {
      
      client.get(`${base}/recipes/${req.params.id}`, data => {
        return res.view('recipe/destroy', {recipes: data});
      })
      
    } else if (req.method === "POST") {
      
      client.delete(`${base}/recipes/${req.params.id}`, function (data) {
        return res.redirect('recipe/destroy');
      })

    }
  
  },

}
