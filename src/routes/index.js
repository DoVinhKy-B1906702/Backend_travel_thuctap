

const authRouter = require('./Auth.route');
const postRouter = require('./Post.route');
const searchRouter = require('./Search.route');
const likeRouter = require('./Like.route');

function route(app) {
   
  
    app.use('/auth', authRouter);
    app.use('/posts', postRouter);
    app.use('/search', searchRouter);
    app.use('/like', likeRouter);
  
}
module.exports = route;