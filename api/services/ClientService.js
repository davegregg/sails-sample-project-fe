const Rest = require('node-rest-client')
const client = new Rest.Client()
const RestWithPromises = require('node-rest-client-promise')
const plient = new RestWithPromises.Client()
const base = 'http://my-fantastic-recipes-api.herokuapp.com/api'
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
const prettyPrint = (ident, obj) => sails.log(`${ident}: ${JSON.stringify(obj, null, 2)}`)

// const get = (endpoint, entity, res) => {
//   client.get(base + endpoint, data => res.view({[entity]: data}))
// }


module.exports = {

  getRecipes: res => client.get(`${base}/recipes`, data => {
    res.view('recipe/index', { recipes: data })
  }),

  getRecipe: (res, id) => client.get(`${base}/recipes/${id}`, data => {
    res.view('recipe/show', { recipe: data })
  }),

  // /api/recipes/:recipeId/ingredients (accepts an array of objects)
  // /api/ingredients/:ingredientId/measures (accepts an object)
  createRecipe: (res, body) => {
    const picture = body.recipePicture.match(/\.(gif|jpg|jpeg|tiff|png)$/i) ?
      body.recipePicture : ''
    const args = {
      data: {
        name: body.name,
        description: body.description,
        recipePicture: picture
      },
      headers: { 'Content-Type': 'application/json' }
    }

    client.post(`${base}/recipes`, args, data => {
      for (let ingredient of body.ingredients) {
        prettyPrint('ingredient', ingredient)
        const args = {
          data: [
            { name: ingredient }
          ],
          headers: { 'Content-Type': 'application/json' }
        }
        prettyPrint('data.id', data.id)
        prettyPrint('args', args)
        client.post(`${base}/recipes/${data.id}/ingredients`, args, data => prettyPrint('ingredients data', data))
      }
      return data
    })

    return res.view('recipe/create')
  },

  updateRecipe: (res, id) => client.get(`${base}/recipes/${id}`, data => {
    res.view('recipe/update', { recipe: data })
  }),

  deleteRecipe: (res, id) => client.get(`${base}/recipes/${id}`, data => {
    res.view('recipe/destroy', { recipe: data })
  }),

}
