const express = require('express')
const exphbs = require('express-handlebars')
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/coursesList')
const cartRoutes = require('./routes/cart')
const path = require('path')
const mongoose = require('mongoose')


const app = express()

const PORT = process.env.PORT || 3000

async function start() {
    try {
        const url = `mongodb+srv://elena:XYTr4gortpyiJYXK@cluster0-adeo3.mongodb.net/courses`
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useFindAndModify: false
        })
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
    extname: 'hbs'
})

app.engine('hbs', hbs.engine) //регистрируем в JS что есть такой движок
app.set('view engine', 'hbs') //используем
app.set('views', 'views') //где храним шаблоны

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
// ────────────────────────────────────────────────────────────────────────────────
app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/cart', cartRoutes)
