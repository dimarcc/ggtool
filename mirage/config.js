export default function() {

  // These comments are here to help you get started. Feel free to delete them.

  /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */

  // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
<<<<<<< HEAD
   this.namespace = 'api';    // make this `/api`, for example, if your API is namespaced
=======
  this.namespace = 'api';    // make this `/api`, for example, if your API is namespaced
>>>>>>> f1546c626d438f8f8fe5c932b249864580d84608
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing

  /*
    Shorthand cheatsheet:

    this.get('/posts');
    this.post('/posts');
    this.get('/posts/:id');
    this.put('/posts/:id'); // or this.patch
    this.del('/posts/:id');

    http://www.ember-cli-mirage.com/docs/v0.3.x/shorthands/
  */

  this.get('/psus');
  this.get('/ldrs');
  this.get('/jmps');
  this.get('/wpxes');
}
