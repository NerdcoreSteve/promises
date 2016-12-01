//Callbacks
const takeCallback = (f) => f()

takeCallback(() => console.log('potatoes!!'))
//prints potatoes!!

//The old way to do AJAX
const $ = require('jquery')
$.ajax({
  url: '/ajax',
  success: data => console.log(data),
  error: console.error
})
//prints { message: "This comes from an AJAX call!" }

//Now with promises
const $get = path =>
    new Promise(
        (resolve, reject) =>
            $.ajax({
              url: path,
              success: resolve,
              error: reject
            }))

$get('/ajax').then(data => console.log(data))
//prints { message: "This comes from an AJAX call!" }

//Now This
//TODO show pyramid of doom with some try catches thrown in
//

//Turns into this
//TODO show nice then chain with catch at the end
