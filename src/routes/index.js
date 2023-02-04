

const authRouter = require('./Auth.route');
const postRouter = require('./Post.route')
function route(app) {
   
  
    app.use('/auth', authRouter);
    app.use('/posts', postRouter);
}
module.exports = route;