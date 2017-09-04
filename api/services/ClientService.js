const Rest = require('node-rest-client')
const client = new Rest.Client()

const base = 'http://my-fantastic-recipes-api.herokuapp.com/api'
const readableUnits = ['Cup', '&frac12; Cup', '&#8531; Cup', '&frac14; Cup', '&#8539; Cup', 'Tbsp.',      '&frac12; Tbsp.',  'Tsp.',     '&frac12; Tsp.', '&frac14; Tsp.',    'Ounce', 'Pint', 'Quart', 'Liter', 'Gallon', 'Pinch', 'Dash', 'Drop', 'Stick', 'Whole', 'Half']
const enumUnits     = ['CUP', 'HALF_CUP',     'THIRD_CUP',   'QUARTER_CUP',  'EIGHTH_CUP',  'TABLESPOON', 'HALF_TABLESPOON', 'TEASPOON', 'HALF_TEASPOON', 'QUARTER_TEASPOON', 'OUNCE', 'PINT', 'QUART', 'LITER', 'GALLON', 'PINCH', 'DASH', 'DROP', 'STICK', 'WHOLE', 'HALF']
const buildArgs = body => ({ data: body, headers: { 'Content-Type': 'application/json' }})

const ensureArray = array => array !== undefined ? [].concat(array) : []
const lastIndex = array => array.length - 1

const prettyPrint = (ident, obj) => sails.log(`${ident}: ${JSON.stringify(obj, null, 2)}`)
const stub = [ // TODO: Remove me
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

  getRecipe: (res, id, view = 'recipe/show') => client.get(`${base}/recipes/${id}`, recipeRes => {
    res.view(view, { recipe: recipeRes })
  }),

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

  updateRecipe: (res, id) => client.get(`${base}/recipes/${id}`, data => {
    res.view('recipe/update', { recipe: data })
  }),

  deleteRecipe: (res, id) => client.get(`${base}/recipes/${id}`, data => {
    res.view('recipe/destroy', { recipe: data })
  }),

  getIngredients: (res, req) => {
    client.get(`${base}/recipes/${req.params.id}/ingredients`, ingredientsRes => {
      prettyPrint('ingredientsRes', ingredientsRes)
      client.get(`${base}/recipes/${req.params.id}`, recipeRes => {
        prettyPrint('recipeRes', recipeRes)
        res.view('measure/create', {
          recipe: recipeRes,
          ingredients: ingredientsRes,
          units: readableUnits })
      })
    })
  },

/*
---
POST http://my-fantastic-recipes-api.herokuapp.com/api/ingredients/:ingredientId/measures
---
// /api/ingredients/:ingredientId/measures (accepts an object)
*/
  createMeasures: (res, req) => {
    req.body.forEach(function(ingredient, index) {
      const args = buildArgs({
        quantity: ingredient.measure.quantity,
        units: enumUnits[ingredient.measure.enumUnitsIndex]
      })
      prettyPrint('createMeasures POST args', args)
      client.post(`${base}/ingredients/${ingredient.id}/measures`, args, data => {
        if (index === lastIndex(req.body)) { // TODO: Use a promise instead
          client.get(`${base}/recipes/${req.params.id}`, recipeRes => {
            // return res.json({ link: '/' })
            return res.view({ 'instruction/create': { recipe: recipeRes } })
          })
        }
      })
    })
  },

  createInstructions: (res, req) => {
    const args = buildArgs(req.body)
    prettyPrint('createInstructions POST args', args)
    client.post(`${base}/recipes/${req.params.id}/instructions`, args, data => {
      client.get(`${base}/recipes/${req.params.id}`, recipeRes => {
        return res.view({ 'recipe/show': { recipe: recipeRes } })
      })
    })
  },

}
