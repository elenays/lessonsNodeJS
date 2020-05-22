const express = require('express')
const exphbs = require('express-handlebars')
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')

const app = express()

// ────────────────────────────────────────────────────────────────────────────────
const hbs = exphbs.create({
    defaultLayout: 'main', //название дефолтного файла
    extname: 'hbs'
})

app.engine('hbs', hbs.engine) //регистрируем в JS что есть такой движок
app.set('view engine', 'hbs') //используем
app.set('views', 'views') //где храним шаблоны

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
// ────────────────────────────────────────────────────────────────────────────────
app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
// ────────────────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${ PORT }`)
})

