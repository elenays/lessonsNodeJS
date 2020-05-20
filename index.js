const express = require('express')
const exphbs = require('express-handlebars')

const app = express()

// ────────────────────────────────────────────────────────────────────────────────
const hbs = exphbs.create({
    defaultLayout: 'main', //название дефолтного файла
    extname: 'hbs'
})

app.engine('hbs', hbs.engine) //регистрируем в JS что есть такой движок
app.set('view engine', 'hbs') //используем
app.set('views', 'views') //где храним шаблоны
// ────────────────────────────────────────────────────────────────────────────────

app.get('/', (rec, res) => {
    res.render('index')
})

app.get('/about', (rec, res) => {
    res.render('about')
})

// ────────────────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${ PORT }`)
})

