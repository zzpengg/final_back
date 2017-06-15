/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    view: 'homepage'
  },
  '/success':{
    view: 'success'
  },
  
  'post /user/login': 'UserController.login',
  'post /user/register': 'UserController.register',
  'get /user/islogin': 'UserController.checkAuth',
  'get /user/checkIdRepeat':'UserController.checkIdRepeat',
  'post /user/test':'UserController.test',
  'get /user/getMyInfo': 'UserController.getMyInfo',
  'post /user/updateMyName': 'UserController.updateMyName',
  'post /user/updateMyPhone': 'UserController.updateMyPhone',
  'post /user/FBLogin': 'UserController.FBLogin',
  'post /user/FBRegister': 'UserController.FBRegister',
  'post /user/emailvalidation': 'UserController.emailvalidation',
  'post /user/upload': 'UserController.upload',
  
  'post /student/login': 'StudentController.login',
  'post /student/register': 'StudentController.register',
  'get /student/islogin': 'StudentController.checkAuth',
  'get /student/getMyInfo': 'StudentController.getMyInfo',
  'post /student/updateMyInfo': 'StudentController.updateMyInfo',
  'post /student/emailvalidation': 'StudentController.emailvalidation',
  'post /student/upload': 'StudentController.upload',
  'post /student/FBLogin': 'StudentController.FBLogin',
  'post /student/FBRegister': 'StudentController.FBRegister',

  'get /house/index': 'HouseController.index',
  'get /house/findMyHouse': 'HouseController.findMyHouse',
  'post /house/createMyHouse': 'HouseController.createMyHouse',
  'post /house/updateMyhouse': 'HouseController.updateMyHouse',
  'post /house/findFilterHouse': 'HouseController.findFilterHouse',
  'get /house/findTheHouse': 'HouseController.findTheHouse',
  'get /house/findHouseData': 'HouseController.findHouseData',
  'post /house/findTheUserHouse': 'HouseController.findTheUserHouse',
  'post /house/deleteMyHouse': 'HouseController.deleteMyHouse',
  'post /house/uploadhouse': 'HouseController.uploadhousephoto',
  'post /house/deletehousephoto':'HouseController.deletehousephoto',
  
  'post /comment/createMyComment': 'CommentController.createMyComment',
  'post /comment/findHouseComment': 'CommentController.findHouseComment',
  'post /comment/findBestComment': 'CommentController.findBestComment',
  'post /comment/createLandlordComment': 'CommentController.createLandlordComment',
  
  'post /like/addLike': 'LikeController.addLike',
  'post /like/addDislike': 'LikeController.addDislike',
  
  'post /love/addLove': 'LoveController.addLove',
  'post /love/findLove': 'LoveController.findLove',
  

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
