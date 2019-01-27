let MongoClient = require('mongodb').MongoClient;
let db;


MongoClient.connect('mongodb://localhost:27017', function (err, client) {
    if (err) throw err;
    db = client.db('LOCATIONS');
});

module.exports = {
    addLocationWithRecords: function(lat, lng, records){
        return new Promise((resolve, reject) => {
            db.collection('locations').insertOne({ lat: lat, lng: lng, response: records }, function(err, res) {
                if (err) reject(err);

                console.log("1 document inserted");
                console.log(res);
                resolve(res);
            });
        })

    },
    getRecordsFromLocation: function(lat, lng){
        return new Promise((resolve, reject) => {
            db.collection('locations').find({ lat: lat.toString(), lng: lng.toString() }).toArray(function (err, result) {
                if (err) reject(err);
                console.log(result);

                if (result && Array.isArray(result) && result.length > 0){
                    let images = [];
                    for (let i in result){
                        for (let j in result.response){
                            images.push(result[i].response[j]);
                        }
                    }
                    resolve(result[0].response);
                }
                else reject("No data found.");
            });
        });
    }
};


return;

// Test code or templates beyond here

MongoClient.connect('mongodb://localhost:27017', function (err, client) {
    if (err) throw err;

    db = client.db('LOCATIONS');

    db.collection('locations').find({lat:49}).toArray(function (err, result) {
        if (err) throw err;

        console.log(result)
    });

});