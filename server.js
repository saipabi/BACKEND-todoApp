require('dotenv').config();

   const express = require('express');
    const mongoose = require('mongoose');

    const app = express();

    app.use(express.json())
    const cors = require("cors");
    app.use(cors());


    
    // mongoose.connect('mongodb://localhost:27017/mern-todos')

    
    // ODBABOxOOPSqkH5z_
    // mongoose.connect("mongodb+srv://Rajesh:uW9zx2QCPFjKfiw6@cluster0.br0zagv.mongodb.net/foodcartretryWrites=true&w=majority&appName=Cluster0")
    mongoose.connect(process.env.MONGO_URI)

    .then(()=>{
        console.log("DB is connected")
    })
    .catch((err)=>{
        console.log(err);
    })
    // creating schema:
    const todoSchema = new mongoose.Schema({
        title:{
            required: true,
            type:String},
        description:String
    })
    // create model
    const todoModel = mongoose.model('todo', todoSchema);
    // let todos = [];

    // creating newtodo
    app.post('/todos', async(req,res)=>{
        const{title, description} = req.body;
        // since we setting mongo db we dont want these down line
        // const newTodo = {
        //     id:todos.length+1,
        //     title,
        //     description
        // };
        // todos.push(newTodo);
        // console.log(todos);
        try {
            const newTo = new todoModel({title, description});
        await newTo.save();
        res.status(201).json(newTo)
            
        } catch (error) {
            console.log(error)
            res.status(500).json({message:error.message});
            
        }
        
        
    });
    app.get('/todos', async (req,res)=>{
        try {
            const todos =await todoModel.find();
            res.json(todos)
        } catch (error) {
            res.status(500).json({message:error.message});
            
        }
    })
    // update a todo item
    app.put('/todos/:id', async(req,res)=>{
        try {
            const {title, description}= req.body;
        const id = req.params.id;
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            {title, description},
            {new: true}
        )
        if(!updatedTodo){
            return res.status(404).json({message:'Todo not found'})
        }
        res.json(updatedTodo)

        } catch (error) {
            res.status(500).json({message:error.message});
            
        }
    })
    // delete items
    app.delete('/todos/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const deletedTodo = await todoModel.findByIdAndDelete(id);
            
            if (!deletedTodo) {
                return res.status(404).json({ message: 'Todo not found' });
            }
            
            res.status(204).end(); // No content response
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    // start the server
    // const port = 3000;
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));