const express = require('express');
const app = express();
const port = 3000;
app.use(express.urlencoded({extended:true}))
app.use(express.json());


// Criando a rota
const router = express.Router();
router.get('/',(req,res) => res.json({message:'Funcionando!'}));
app.use('/', router);

//
router.get('/clientes', async function(req,res,next){
    try{
        const db = await connect();
        res.json(await db.collection("customers").find().toArray());
    }
    catch(ex){
        console.log(ex);
        res.status(400).json({erro: `${ex}`});
    }
})

// Iniciando o servidor
app.listen(port);
console.log('API funcionando!');