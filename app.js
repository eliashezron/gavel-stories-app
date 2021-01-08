const path = require ('path')
const express = require ('express')
const morgan = require ('morgan')
const helmet = require('helmet')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const connectDB = require('./config/db')
const middleware = require('./middleware')



//load config
dotenv.config({path:'./config/config.env'})
// passport config
require('./config/passport')(passport)

// connect database  

connectDB()

//express
const app = express()

//body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// middlewares
app.use(helmet())


// logging
app.use(morgan('dev'))

// handlebar helpers
const {formatDate,
   stripTags,
  truncate,
  editIcon,
select} = require('./helpers/hbs')

//handlebars
app.engine('.hbs', exphbs({helpers:{
  formatDate,
  stripTags,
  truncate, 
  editIcon,
  select
},
  defaultLayout:'main',
   extname: '.hbs'}));
app.set('view engine', '.hbs')

// express-session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection:mongoose.connection})
  }))

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// // set globar variable
app.use(function(req, res, next){
  res.locals.user=req.user|| null
  next()
})

// static folders
app.use(express.static(path.join( __dirname, 'public')))

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))
// error handlers
app.use(middleware.notFound);
app.use(middleware.errorHandler);

//port
const port = process.env.PORT||3000
app.listen(port, console.log(`live on http://localhost:${port}`))