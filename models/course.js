const { v4: uuidv4 } = require('uuid')
const { promises: fs } = require('fs')
const path = require('path')

class Course {

    constructor(title, price, img) {
        this.title = title
        this.price = price
        this.img = img
        this.id = uuidv4()
    }

    toJSON() {
        return ({
            title: this.title,
            price: this.price,
            img: this.img,
            id: this.id
        })
    }

    async save() {
        const courses = await Course.getAll()
        courses.push(this.toJSON())

        return fs.writeFile(
            path.join(__dirname, '..', 'data', 'courses.json'),
            JSON.stringify(courses))
    }

    static getAll() {
        return fs.readFile(
            path.join(__dirname, '../data/courses.json'),
            'utf-8'
        )
            .then(content => JSON.parse(content))
    }
}

module.exports = Course