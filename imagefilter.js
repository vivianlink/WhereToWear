/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

let peopleImg = [];
let img = "https://scontent-sea1-1.cdninstagram.com/vp/41655379f7851befa26ec4550f3e5550/5CF50B92/t51.2885-15/e35/40196752_1078216332353835_2667629686766436352_n.jpg?_nc_ht=scontent-sea1-1.cdninstagram.com";
// [START vision_quickstart]

async function quickstart() {
    // Imports the Google Cloud client library
    const vision = require('@google-cloud/vision');

    // Creates a client
    const client = new vision.ImageAnnotatorClient();

    // Performs label detection on the image file

    const [result] = await client.labelDetection('https://scontent-sea1-1.cdninstagram.com/vp/41655379f7851befa26ec4550f3e5550/5CF50B92/t51.2885-15/e35/40196752_1078216332353835_2667629686766436352_n.jpg?_nc_ht=scontent-sea1-1.cdninstagram.com');
    const labels = result.labelAnnotations;

    for (let i= 0; i <labels.length; i++){

        if (labels[i].description === 'People'){
            peopleImg.push(img)
        }
    }
    return peopleImg
}

// [END vision_quickstart]
quickstart().then(function(peopleImg){ console.log(peopleImg)}).catch(console.error);