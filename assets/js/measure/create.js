/**
 * Use the jQuery Validate plugin to add validation to the form
 *
 * Here's what this you will need to do:
 *
 * 1. Include the following jQuery Validate JavaScript in layout.ejs
 *    <script type="text/javascript" src="http://ajax.aspnetcdn.com/ajax/jquery.validate/1.15.0/jquery.validate.min.js"></script>
 *
 * 2. Use jQuery validate and add validation to the form with the following requirements
 *    First Name - required, at least 2 characters
 *    Last Name  - required, at least 2 characters
 *    start_date - make sure date is yyyy-mm-dd
 *    ADD any other validation that makes you happy
 *
 * 3. Use a custom message for one validation
 *
 * 4. Make the color of the error text red
 *
 *
 *
 * Here's the documentation you need:
 * https://jqueryvalidation.org/validate/
 * https://jqueryvalidation.org/documentation/#link-list-of-built-in-validation-methods
 *
 */

(function(){
  $(function(){

    function submitForm(event) {
      event.preventDefault()

      const ingredients = []
      $('#createMeasureForm .quantity').each(function() {
        const quantity = $(this).val() || 1
        const ingredientId = $(this).data('ingredient-id')
        const selectedUnit = $(`#ingredient${ingredientId} .selectedUnitName`)
        const selectedUnitIndex = selectedUnit.data('selected-unit-index')

        ingredients.push({
          id: ingredientId,
          measure: {
            quantity: quantity,
            enumUnitsIndex: selectedUnitIndex
          }
        })
      })

      $.ajax({
        url: window.location.pathname,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(ingredients)
      }).done(response => window.location.href = response.link)
    }

    $('#createMeasureForm').submit(submitForm)

    $('.units').click(function() {
      const thisUnit = $(this)
      const id = thisUnit.data('ingredient-id')

      const selectedUnit = $(`#ingredient${id} .selectedUnitName`)
      selectedUnit.html(thisUnit.html())
      selectedUnit.data('selected-unit-index', thisUnit.data('unit-index'))

      const selectedUnitBadge = $(`#ingredient${id} .badge`)
      selectedUnitBadge.html('&#10004;')
      selectedUnitBadge.css({
        'background-color': '#5cb85c'
      })
    })

  })

})();
