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
 *	  start_date - make sure date is yyyy-mm-dd
 *	  ADD any other validation that makes you happy
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

    const form = $('#createRecipeForm')
    const ingredients = $('#ingredientsTokenfield')

    ingredients.tokenfield()

    function submitForm(event) {
      event.preventDefault()

      const formData = form.serializeArray()
      const ingredientsTokens = ingredients.tokenfield('getTokens')
      for (let obj of ingredientsTokens) {
        formData.push({ name: 'ingredients', value: obj.value })
      }

      $.post('http://localhost:1337/create', formData)
    }

    // TODO: const submitFormOnEnter = event => if (event.keyCode === 13) event.preventDefault()
    // $('#searchtext').keypress(submitFormOnEnter)
    form.submit(submitForm)

  })

})();
