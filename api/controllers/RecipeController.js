/**
 * RecipeController
 *
 * @description :: Server-side logic for managing recipes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  /**
   * `RecipeController.create()`
---
GET http://localhost:1337/create
---
POST http://my-fantastic-recipes-api.herokuapp.com/api/recipes
---
   */
  create: (req, res) => {
    if (req.method === 'GET') res.view()
    if (req.method === 'POST') ClientService.createRecipe(res, req.body)
  },


  /**
   * `RecipeController.index()`
---
GET http://localhost:1337/
---
GET http://my-fantastic-recipes-api.herokuapp.com/api/recipes
---
   */
  index: (req, res) => ClientService.getRecipes(res),


  /**
   * `RecipeController.show()`
---
GET http://localhost:1337/417
---
GET http://my-fantastic-recipes-api.herokuapp.com/api/recipes/417
---
   */
  show: (req, res) => ClientService.getRecipe(res, req.param('id')),


  /**
   * `RecipeController.update()`
   */
  update: (req, res) => ClientService.updateRecipe(res, req.param('id')),


  /**
   * `RecipeController.destroy()`
   */
  destroy: (req, res) => ClientService.deleteRecipe(res, req.param('id')),


};
