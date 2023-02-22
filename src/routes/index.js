

const authRouter = require('./Auth.route');
const postRouter = require('./Post.route');
const searchRouter = require('./Search.route');
function route(app) {
   
  
    app.use('/auth', authRouter);
    app.use('/posts', postRouter);
    app.use('/search', searchRouter)
}
module.exports = route;