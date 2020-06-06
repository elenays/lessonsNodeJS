const express = require('express')
const exphbs = require('express-handlebars')
const Handlebars = require('handlebars')
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/coursesList')
const cartRoutes = require('./routes/cart')
const ordersRoutes = require('./routes/orders')
const authRoutes = require('./routes/auth')
const path = require('path')
const mongoose = require('mongoose')
const User = require('./models/user')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const session = require('express-session')
const varMiddleware = require('./middleware/variables')
const MongoStore = require('connect-mongodb-session')(session) //возвращает функцию, в которую мы передали пакет, MongoStore - это класс
const userMiddleware = require('./middleware/user')

const app = express()

const PORT = process.env.PORT || 3000
const MONGO_URL = `mongodb://localhost:27017/cources`

const store = new MongoStore({
    collection: 'sessions',
    uri: MONGO_URL
})

async function start() {
    try {
        const url = MONGO_URL
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useFindAndModify: false
        })
        const candidate = await User.findOne()

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
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

app.engine('hbs', hbs.engine)//регистрируем в JS что есть такой движок
app.set('view engine', 'hbs') //используем
app.set('views', 'views') //где храним шаблоны

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))

app.use(session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false,
    store
}))

app.use(varMiddleware)
app.use(userMiddleware)
// ────────────────────────────────────────────────────────────────────────────────
app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)
