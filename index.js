const express = require('express');
const app = express(); //returns an object type express
const Joi = require('joi');

app.use(express.json()); //adding a peace of middleware

const courses = [
    { id: 1, name: 'course 1' },
    { id: 2, name: 'course 2' },
    { id: 3, name: 'course 3' },
]

app.get('/', (req, res)=> {
    res.send('hello world');
}); //takes two arguments, first argument is the path or url, the second is a callback function, that would be called when we call this HTTP, it has two arguments, req and respones.

app.get('/api/courses', (req, res)=>{
    res.send(courses);
})

//api/courses/1
app.get('/api/courses/:id', (req,res)=>{
    const course= courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send('The course with the given ID was not found')
    res.send(course);
    });

app.post('/api/courses', (req, res)=> {
    const { error } = valdateCourse(req.body);
    if(error) {
        //400 Bad Request
        res.status(400).send(error.details[0].message)
        return;
    }
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res)=>{
    //Look up the course
    //if not existing, return 404
    const course= courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found')
    
    

    //validate
    //if invalid, return 400 Bad Request
    
    const { error } = valdateCourse(req.body);
    if(error) {
        //400 Bad Request
        res.status(400).send(error.details[0].message)
        return;
    }

    //update course
    course.name= req.body.name;
    //return the updated course
    res.send(course);

});

function valdateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}


app.get('/api/posts/:year/:month', (req, res)=> {
    res.send(req.query);//are stored in an object that stores key and values
});

app.delete('/api/courses/:id', (req, res)=>{
    //Look up the course
    //not existing return 404
    const course= courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send('The course with the given ID was not found')

    //delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    //return the same course
    res.send(course);
})


//PORT
const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`Listening on port ${port}...`));