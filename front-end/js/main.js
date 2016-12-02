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

//Also, this uses the keyword new, I've not blogged about it,
//but just know you need it to create a new promise.
//Normally I avoid new like the plague

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
/*
prints:
{
    'id': 11,
    'name': 'Robin',
    'real_name': 'Carrie Kelly',
    'first_appearance': {
        'title': 'Batman: The Dark Knight Returns',
        'year': 1986
    }
}
*/

//Turns into this
//Note any errors (from front-end code or network response)
//will bubble down to the catch method call
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
/*
also prints:
{
    'id': 11,
    'name': 'Robin',
    'real_name': 'Carrie Kelly',
    'first_appearance': {
        'title': 'Batman: The Dark Knight Returns',
        'year': 1986
    }
}
*/

//Promise.reject is sometimes useful for a function that needs to return a promise,
//but will always fail on some branch of code
const failure = Promise.reject('This always fails!')

failure
    .then(() => console.log('this function is never called'))
    .catch(error => console.log(error))

//We've got Promise.resolve for a similar reason
const success = Promise.resolve('This always succeeds!')

success
    .then(success => console.log(success))
    .catch(() => console.log('this function is never called'))

//TODO Show Promise .all
//If we want to wait until a bunch of promises are fulfilled
//Promise.all returns a promise that only resolves 
Promise.all([
    $get('/firstappearance/9'),
    $get('/firstappearance/10'),
    $get('/firstappearance/11')
])
    .then(
        R.pipe(
            R.map(sidekick => ({
                name: sidekick.name,
                real_name: sidekick.real_name,
                title: sidekick.first_appearance.title,
                year: sidekick.first_appearance.year
            })),
            console.log
        ))
/*
prints:
[
    {
        'name': 'Robin',
        'real_name': 'Damian Wayne',
        'title': 'Batman #655',
        'year': 2006
    },
    {
        'name': 'Robin',
        'real_name': 'Stephanie Brown',
        'title': 'Detective Comics #647',
        'year': 1992
    },
    {
        'name': 'Robin',
        'real_name': 'Carrie Kelly',
        'title': 'Batman: The Dark Knight Returns',
        'year': 1986
    }
]
*/

//Promise.race returns a promise that resolves
//as soon as one of any of the promises you
//give it resolves
Promise.race([
    new Promise((resolve, reject) => setTimeout(resolve, 100, "This promise wins")),
    new Promise((resolve, reject) => setTimeout(resolve, 200, "This promise loses"))
])
    .then(result => console.log(result))
//prints This promise wins

//Weirdly, you can .then a catch
Promise
    .reject('failure')
    .then(() => console.log('this never prints'))
    .catch(() => Promise.resolve('returned from catch!'))
    .then(fromCatch => console.log(fromCatch))
// prints returned from catch!

//Also, you can throw a standard error and it'll get handled by .catch
Promise
    .resolve('potatoes are my friends')
    .then(function () { throw 'It\'s my party and I\'ll cry if I want to!' })
    .then(() => console.log('this never executes'))
    .catch(complaint => console.log(complaint))

//Note: promises are side-effect-y as heck. Not very functional.
//See Tasks for a more functional alternative to promises: https://github.com/folktale/data.task
