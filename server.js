var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var path = require('path');

mongoose.connect('mongodb://localhost/restaurants_db');

var RestaurantSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3 },
    cuisine: { type: String, required: true, minlength: 3 },
    customer: { type: String },
    stars: { type: Number },
    description: { type: String },
});

var Restaurant = mongoose.model('Restaurant', RestaurantSchema);
var Restaurant = mongoose.model('Restaurant');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public/dist/public'));


app.get('/restaurants', function (req, res) {
    Restaurant.find({}, function (err, restaurants) {
        if (err) {
            console.log("Errors!", err);
            res.json({ message: "Error", error: err });
        } else {
            res.json({ message: "Success", restaurants: restaurants })
            console.log("Success! Here are the listed restaurants:")
            console.log(restaurants)
        }
    })
})


app.post('/restaurants/new', function (req, res) {
    var restaurant = new Restaurant({ name: req.body.name, cuisine: req.body.cuisine });
    restaurant.save(function (err) {
        if (err) {
            console.log("Errors!", err);
            res.json({ message: "These are your errors:", error: err });
        } else {
            console.log("Success! You added a restaurant:");
            res.json({ message: "Success", restaurant: restaurant })
        }
    })
})


app.get('/restaurants/:id', function (req, res) {
    var id = req.params.id;
    Restaurant.findOne({ _id: id }, function (err, restaurant) {
        res.json({ restaurant:restaurant });
    })
})


app.put('/restaurants/:id/edit', function (req, res) {
    var id = req.params.id;
    Restaurant.findById({_id: id}, function (err, restaurant) {
        if (err) {
            console.log('Errors!');
        } else {
            if (req.body.name) {
                restaurant.name = req.body.name;
            }
            if (req.body.cuisine) {
                restaurant.type = req.body.type;
            }
            restaurant.save(function (err) {
                if (err) {
                    console.log("Errors!", err);
                    res.json({ message: "Error", error: err });
                } else {
                    console.log('Successfully edited a restaurant!');
                    res.json(restaurant)
                }
            })
        }
    })
})


app.delete('/restaurants/:id/delete', function(req, res) {
    var id = req.params.id;
    Restaurant.remove({_id: id}, function(err) {
      if (err){
        console.log("Returned error", err);
        res.json({message: "Error", error: err});
      } else {
        console.log('Restaurant deleted!');
        res.json({message: "Success"})
      }
    })
})


app.all("*", (req, res, next) => {
    res.sendFile(path.resolve("./public/dist/public/index.html"))
});


app.listen(8000, function () {
    console.log("Listening on port 8000");
})
