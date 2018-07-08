const express = require('express');
const app = express();
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'Users';
let db;

MongoClient.connect(url, function(error,client){
    if(error) throw error;
    console.log("Connected to Database.");
    db = client.db(dbName);
});

app.listen('3000', function(){
    console.log("Server is running on port 3000.");
});

// main page
app.get('/', function(req, res){
    res.send('Hello, go to the "/users" page to see all the users.');
});

// create db
app.get('/create', function(req, res){
    createDatabase(
        function(error, result){
            console.log("Database Made.");
            res.send(result);
        }

    );
})

//all users page
app.get('/users', (req, res)=>{
    fetchUsers({}, function(err,result){
        if (err) throw err;
        var singleUser = '';
        result.forEach((user)=>{
            console.log(user)
            singleUser += user.name + ',' + 'ID: ' + user._id + '<br>';
        });
        res.send('Take the ID of the user to continue the search by using "/user/(ID here)".');
    })
})

// single user page
//all users page
app.get('/users/:id',(req,res)=>{
    fetchUsers({'_id': new mongo.ObjectID(req.params.id)},
        function(err,result){
            if(err) throw err;
            res.send(
                'User: ' + result[0].name + '</br>' + 
                'Password: ' + result[0].lastname + '</br>' + 
                'Email:' + result[0].email)
            }
    )

})


function fetchUsers(arg, callback){
    const users = db.collection('users');
    users.find(arg).toArray(callback);
}


function createDatabase(data, callback){
    const users = db.collection('users');
    users.insertMany(
        [
            {"name":"Veljko", "lastname": "Ilic","email":"velja@gmail.com"},
            {"name":"Hazel", "lastname": "Harris","email":"hazel@gmail.com"},
            {"name":"Dave", "lastname": "Miles","email":"dave@gmail.com"},
            {"name":"Sandra", "lastname": "Brooks","email":"Sandra@gmail.com"},
            {"name":"Eva", "lastname": "Morrison","email":"eva@gmail.com"},
        ],
        callback
    );
}

