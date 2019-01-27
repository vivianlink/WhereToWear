const instagram_api = require('instagram-web-api');
const api_keys = require('./api_keys.json');
const mongo_access = require('./mongo_access.js');
const vision = require('@google-cloud/vision');

const client = new instagram_api({username:api_keys.instagram_login.username,password:api_keys.instagram_login.password});
client.login();

async function quickstart(images) {
    // Imports the Google Cloud client library

    // Creates a client
    const vision_client = new vision.ImageAnnotatorClient();

    let response = [];

    for (let i=0; i<images.length; i++){
        let image = images[i].url;
        const [result] = await vision_client.labelDetection(image);
        const labels = result.labelAnnotations;

        for (let i=0; i<labels.length; i++){
            console.log(labels[i].description);
            if (response.length >= 2){
                return response;
            }
            if (labels[i].description === 'People' || ((labels[i].description).toLowerCase()).includes('human') ){
                response.push(image);
                break;
            }
        }
    }

    return peopleImg
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
                client.login().then(() => {
                    console.log("Got here");
                    return client.locationSearch({latitude: lat, longitude: lng});
                }).then(data => {
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
                                if (got_count == total_count){
                                    // console.log("Finished!", images);

                                    quickstart(images).then(function(peopleImg){ console.log(peopleImg)}).catch(console.error);

                                    mongo_access.addLocationWithRecords(lat, lng, images).then(() => {
                                        console.log("Inserted successfully.")
                                    });
                                    resolve(images);
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