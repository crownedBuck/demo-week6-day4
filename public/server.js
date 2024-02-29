const express = require('express')
const app = express()
const path = require('path')

app.use(express.json())

const students = ['Jimmy', 'Timothy', 'Jimothy']

var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '534d91ebb92246b3aaf0ba152a857ecf',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

app.get('/', (req, res) => {
    rollbar.info("someone used this")
    res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/api/students', (req, res) => {
    res.status(200).send(students)
})

app.post('/api/students', (req, res) => {
   let {name} = req.body

   const index = students.findIndex(student => {
       return student === name
   })

   try {
       if (index === -1 && name !== '') {
           students.push(name)
           res.status(200).send(students)
       } else if (name === ''){
            rollbar.warning('someone tried to add an empy string')
           res.status(400).send('You must enter a name.')
       } else {
            rollbar.error('someone tried to duplicate a student')
           res.status(400).send('That student already exists.')
       }
   } catch (err) {
       console.log(err)
   }
})

app.delete('/api/students/:index', (req, res) => {
    const targetIndex = +req.params.index
    
    students.splice(targetIndex, 1)
    rollbar.critical('someone deleted a studentrs')
    res.status(200).send(students)
})

const port = process.env.PORT || 5050

app.listen(port, () => console.log(`Server listening on ${port}`))
