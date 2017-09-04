/**
 * InstructionController
 *
 * @description :: Server-side logic for managing instructions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  /**
   * `InstructionController.create()`
---
GET http://localhost:1337/create/1/instructions
---
POST http://my-fantastic-recipes-api.herokuapp.com/api/recipes/:recipeId/instructions
---
   */
  create: (req, res) => {
    if (req.method === 'GET') ClientService.getRecipe(res, req, 'instruction/create')
    if (req.method === 'POST') ClientService.createInstructions(res, req)
  }


};
