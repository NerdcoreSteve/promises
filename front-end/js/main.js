const
    R = require('ramda'),
    $ = require('jquery'),
    tap = x => { console.log(x); return x }

//Callbacks
const takeCallback = (f) => f()

takeCallback(() => console.log('potatoes!!'))
//prints potatoes!!

//The old way to do AJAX
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

//You might need the babel polyfil for promises,
//https://babeljs.io/docs/usage/polyfill/
//but I didn't in Chrome, Firefox, or Safari

//Now This
$.ajax({
  url: '/heroes',
  success: results =>
    $.ajax({
        url: `/sidekicks/${
            R.pipe(
                R.prop('heroes'),
                R.find(hero => hero.name === 'Batman'),
                R.prop('id'))
                    (results)}`,
        success: results => $.ajax({
            url: `/firstappearance/${
                R.pipe(
                    R.prop('side_kicks'),
                    R.last,
                    R.prop('id'))
                        (results)}`,
            success: firstappearance => console.log(firstappearance),
            error: console.error
        }),
        error: console.error
    }),
  error: console.error
})

//Turns into this
//TODO show nice then chain with catch at the end
$get('/heroes')
    .then(results =>
        $get(`/sidekicks/${
            R.pipe(
                R.prop('heroes'),
                R.find(hero => hero.name === 'Batman'),
                R.prop('id'))
                    (results)}`))
    .then(results =>
        $get(`/firstappearance/${
            R.pipe(
                R.prop('side_kicks'),
                R.last,
                R.prop('id'))
                    (results)}`))
    .then(firstappearance => console.log(firstappearance))
    .catch(console.error)

//Show Promise .all, .reject, .resolve, .race

//Note that this is side-effect-y as heck and say that Tasks is an alternative to managing
//network calls
