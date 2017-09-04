/**
 * MeasureController
 *
 * @description :: Server-side logic for managing measures
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  /**
   * `MeasureController.create()`
---
GET http://localhost:1337/create/1/measurements
---
POST http://my-fantastic-recipes-api.herokuapp.com/api/ingredients/:ingredientId/measures
---
   */
  create: (req, res) => {
    if (req.method === 'GET') ClientService.getIngredients(res, req)
    if (req.method === 'POST') ClientService.createMeasures(res, req.body)
  }


};
