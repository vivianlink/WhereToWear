const instagram_api = require('instagram-web-api');
const api_keys  = require('./api_keys.json');

const client = new instagram_api({username:api_keys.instagram_login.username,password:api_keys.instagram_login.password});
client.login();


module.exports = {
    getPhotos: function(lat, lng){
        return new Promise((resolve, reject) => {
            client.login().then(() => {
                console.log("Got here")
                return client.locationSearch({latitude: lat, longitude: lng});
            }).then(data => {
                console.log("Got here")
                return new Promise((a, b) => {
                    let to_ret = [];
                    for (let loc of data){
                        to_ret.push({
                            id: loc.external_id,
                            lat: loc.lat,
                            lng: loc.lng
                        });
                    }
                    a(to_ret);
                });
            }).then(locations => {

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
                            console.log("Finished!", images);
                            resolve(images);
                        } else console.log(got_count + '/' + total_count);
                    });
                }
            });
        });
    }
};