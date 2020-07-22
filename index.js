const express = require('express')
const exphbs = require('express-handlebars')
const Handlebars = require('handlebars')
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/coursesList')
const cartRoutes = require('./routes/cart')
const ordersRoutes = require('./routes/orders')
const authRoutes = require('./routes/auth')
const profileRoutes = require('./routes/profile')
const path = require('path')
const mongoose = require('mongoose')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const session = require('express-session')
const varMiddleware = require('./middleware/variables')
const MongoStore = require('connect-mongodb-session')(session) //возвращает функцию, в которую мы передали пакет, MongoStore - это класс
const userMiddleware = require('./middleware/user')
const csurf = require('csurf')
const flash = require('connect-flash')
const errorHandler = require('./middleware/errors')
const fileMiddleware = require('./middleware/file')
const keys = require('./keys')
const helmet = require('helmet')
const compression = require('compression')

const app = express()

const PORT = process.env.PORT || 3000

// @ts-ignore
const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGO_URL
})

async function start() {
    try {
        const url = keys.MONGO_URL
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })
        // @ts-ignore
        app.listen(PORT, () => {
            console.log(`Server is running on port ${ PORT }`)
        })
    } catch (err) {
        console.log(err)
    }
}

start()
// ────────────────────────────────────────────────────────────────────────────────

const hbs = exphbs.create({
    defaultLayout: 'main', //название дефолтного файла
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: require('./utils/hbs-helpers')
})

// @ts-ignore
app.engine('hbs', hbs.engine)//регистрируем в JS что есть такой движок
// @ts-ignore
app.set('view engine', 'hbs') //используем
// @ts-ignore
app.set('views', 'views') //где храним шаблоны

// @ts-ignore
app.use(express.static(path.join(__dirname, 'public')))
// @ts-ignore
app.use('/images', express.static(path.join(__dirname, 'images')))
// @ts-ignore
app.use(express.urlencoded({ extended: true }))

// @ts-ignore
app.use(session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false,
    store
}))

// @ts-ignore
app.use(fileMiddleware.single('avatar'))
// @ts-ignore
app.use(csurf())
// @ts-ignore
app.use(flash())
// @ts-ignore
app.use(helmet())
// @ts-ignore
app.use(compression())
// @ts-ignore
app.use(varMiddleware)
// @ts-ignore
app.use(userMiddleware)

// ────────────────────────────────────────────────────────────────────────────────
// @ts-ignore
app.use('/', homeRoutes)
// @ts-ignore
app.use('/add', addRoutes)
// @ts-ignore
app.use('/courses', coursesRoutes)
// @ts-ignore
app.use('/cart', cartRoutes)
// @ts-ignore
app.use('/orders', ordersRoutes)
// @ts-ignore
app.use('/auth', authRoutes)
// @ts-ignore
app.use('/profile', profileRoutes)
// @ts-ignore
app.use(errorHandler)
