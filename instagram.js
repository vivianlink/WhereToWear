const instagram_api = require('instagram-web-api');
const api_keys = require('./api_keys.json');
const mongo_access = require('./mongo_access.js');
const vision = require('@google-cloud/vision');

const client = new instagram_api({username:api_keys.instagram_login.username,password:api_keys.instagram_login.password});
client.login();

function quickstart(images) {
    // Imports the Google Cloud client library
    console.log("Quickstart started")
    // Creates a client
    const vision_client = new vision.ImageAnnotatorClient();

    let response = [];
    let found_count = 0;

    let queue = [];

    console.log("Quickstart started")

    return new Promise((resolve, reject) => {

        for (let i = 0; i < images.length; i++){
            let image = images[i];

            setTimeout(function(){
                console.log("Calling image " + i + " of " + images.length);
                vision_client.labelDetection(image.url).then(function(result){
                    let labels = result.labelAnnotations;
                    images[i].labels = labels;
                    found_count++;
                    console.log("Finished image " + i + " of " + images.length + ". Total at " + found_count);
                    if (found_count == (images.length - 1)) resolve(images);
                });
            }, Math.floor(i / 20) * 1000);

        }

    });

}


module.exports = {
    getPhotos: function(lat, lng){
        console.log("WTF");
        return new Promise((resolve, reject) => {
            mongo_access.getRecordsFromLocation(lat, lng).then(records => {
                console.log("Got a response from Mongoooooo with " + records.length + " records.");
                resolve(records);
            }, function(){
                console.log("Mongo miss. Making a call to Instagram API.");
                client.locationSearch({latitude: lat, longitude: lng}).then(data => {
                    console.log("Got here");
                    return new Promise((res, rej) => {
                        let to_ret = [];
                        for (let loc of data){
                            to_ret.push({
                                id: loc.external_id,
                                lat: loc.lat,
                                lng: loc.lng
                            });
                        }
                        res(to_ret);
                    });
                }).then(locations => {

                    return new Promise((resolve, reject) => {

                        let images = [];
                        let got_count = 0;
                        let total_count = locations.length;

                        for (let location of locations){
                            client.getMediaFeedByLocation({ locationId: location.id }).then(data => {
                                console.log(data);
                                for (let image of data.edge_location_to_media.edges){
                                    images.push({
                                        url: image.node.display_url,
                                        time: image.node.taken_at_timestamp
                                    });
                                }
                                got_count++;
                                if (got_count == (total_count - 1)){
                                    console.log("Finished getting images! Calling quickstart now");

                                    quickstart(images).then(function(new_images){
                                        console.log("Got everything!", new_images)
                                        mongo_access.addLocationWithRecords(lat, lng, new_images).then(() => {
                                            console.log("Inserted successfully.")
                                        });
                                        resolve(new_images);
                                    }).catch(console.error);



                                } else console.log(got_count + '/' + total_count);
                            });
                        }
                    });

                }).then((images) => {
                    // quickstart()
                    console.log("Got images!", images);
                    resolve(images);
                });
            });


        });
    }
};