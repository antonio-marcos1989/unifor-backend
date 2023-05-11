//app.js
const {MongoClient, ObjectId} = require("mongodb");
async function connect(){
  if(global.db) return global.db;
    const conn = await MongoClient.connect("mongodb+srv://antonio:<password>@cluster0.6uzzeth.mongodb.net/?retryWrites=true&w=majority");
  if(!conn) return new Error("Can't connect");
    global.db = await conn.db("unifor");
  return global.db;
}

const express = require('express');
const app = express();         
const port = 3000; //porta padrão

app.use(require('cors')());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//definindo as rotas
const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'Funcionando!' }));

// GET dog
router.get('/dog', async function(req, res, next) {
  try{
    const apidog = await fetch('https://dog.ceo/api/breed/hound/list');
    res.json(await apidog.json());
  }
  catch(ex){
    console.log(ex);
    res.status(400).json({erro: `${ex}`});
  }
}) 

/* GET aluno */
router.get('/aluno/:id?', async function(req, res, next) {
    try{
      const db = await connect();
      if(req.params.id)
        res.json(await db.collection("aluno").findOne({_id: new ObjectId(req.params.id)}));
      else
        res.json(await db.collection("aluno").find().toArray());
    }
    catch(ex){
      console.log(ex);
      res.status(400).json({erro: `${ex}`});
    }
})

// POST /aluno
router.post('/aluno', async function(req, res, next){
    try{
      const aluno = req.body;
      const db = await connect();
      res.json(await db.collection("aluno").insertOne(aluno));
    }
    catch(ex){
      console.log(ex);
      res.status(400).json({erro: `${ex}`});
    }
})

// PUT /aluno/{id}
router.put('/aluno/:id', async function(req, res, next){
    try{
      const aluno = req.body;
      const db = await connect();
      res.json(await db.collection("aluno").updateOne({_id: new ObjectId(req.params.id)}, {$set: aluno}));
    }
    catch(ex){
      console.log(ex);
      res.status(400).json({erro: `${ex}`});
    }
})

// DELETE /aluno/{id}
router.delete('/aluno/:id', async function(req, res, next){
    try{
      const db = await connect();
      res.json(await db.collection("aluno").deleteOne({_id: new ObjectId(req.params.id)}));
    }
    catch(ex){
      console.log(ex);
      res.status(400).json({erro: `${ex}`});
    }
})

app.use('/', router);

//inicia o servidor
app.listen(port);
console.log('API funcionando!');