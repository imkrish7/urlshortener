
const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const mongodb = require("mongodb");

var shortUrl = require('./models/shorturl.js');

const app = express();

const PORT = 3000;

mongoose.connect('mongodb+srv://kamal:kamal123@learning-oxyrk.mongodb.net/test?retryWrites=true', {
    useNewUrlParser: true
});

app.use(express.static('public'))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:false}));

app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/views/index.html')
})

app.post('/api/shorturl/new',(req,res)=>{
  var url = req.body.url;
  var pattern = /(https?:\/\/(www.)?[a-z0-9]+.com)$/;

//   console.log(process.env);

  if(pattern.test(url)===true){
       var random = Math.floor(Math.random()*10000).toString();
       var data = new shortUrl({
                    original_url:url,
                    short_url:random
                    });
        
        data.save((error)=>{
            if(error){
                res.send(error);
            }
        }) 
        
        return res.send({data});
  }
return res.send({'error':"invalid url"})
})

app.get('/api/shorturl/:shorturl',(req,res,next)=>{
    if ((shortUrl.findOne({short_url: req.params.shorturl}))===null){
    
    shortUrl.findOne({short_url:req.params.shorturl},(error,data)=>{
        if(error)
           return res.send(error);


        return res.redirect(301,data["original_url"]);   
    })  
}
     return res.send({
         "error": "No short url found for given input"
     })
})
app.use((req, res) => {
    res.send("404 Page Not found")
})
app.listen(PORT,()=>{
    console.log("app is running on port no " + PORT);
})
