/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var app = {


    posts_url: "http://localhost:3010/posts/",

// Method 1 for handling external api urls

    readPosts: function() {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: app.posts_url,
            success: onSuccess,
            error: onError
        });

        function onSuccess(data) {
            alert('First method Success');
            var items = [];
            $.each(data, function(key, val){
                items.push('<a href="' + app.posts_url + val.id + '">' + val.id + ' - ' +val.title + '</a>');
            });
            $('#posts').html(items.join('<br/>'));
            console.log('Exiting onSuccess');
        };
    
        function onError(data, textStatus, errorThrown) {
            console.log('Data: ' + data);
            console.log('Status: ' + textStatus);
            console.log('Error: ' + errorThrown);
            $("#posts").html('Error while loading posts');
            console.log('Exiting onError');
        };
    

        console.log('Reading posts asynchrounously');
    },

// Method 2 for handling external api urls

    readPosts1: function() {

        $.ajax({
            url: app.posts_url,
            success: handleResult_success,
            error: handleResult_error
        });
    
        function handleResult_success(result){
            alert("Second method Success" +JSON.stringify(result))
        };

        function handleResult_error(result, textStatus, errorThrown){
            alert("Second method error" +errorThrown)
        };

        

    },


    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },


    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'

    onDeviceReady: function () {

        app.receivedEvent('deviceready');

        
        
        // json-server --watch db.json --port 3004

        app.readPosts();
        app.readPosts1();
    
        document.getElementById("btnTakePhoto").onclick = function () {

            alert("In here");
            navigator.camera.getPicture(function (imageUri) {
                var lastPhotoContainer = document.getElementById("lastPhoto");
                var lastPhotoResults = document.getElementById("Results");

                var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
                var fs = require('fs');
                
                var visualRecognition = new VisualRecognitionV3({
                    version: '2018-03-19',
                    iam_apikey: '{2KlvHYbvSR8JQV8VlgsooR-l0eKZG12f1o6lEoCS6bi1}'
                });
                
                alert("Now here 1");
                var images_file = fs.createReadStream(imageUri);
                var classifier_ids = ["MinibarConsumptionLevelDetecti_1732811953"];
                var threshold = 0.6;
                
                var params = {
                    images_file: images_file,
                    classifier_ids: classifier_ids,
                    threshold: threshold
                };
                
                visualRecognition.classify(params, function(err, response) {
                    if (err) { 
                        console.log(err);
                    } else {
                        console.log(JSON.stringify(response, null, 2))
                    }
                });
    


                alert("Uploading for Image Recognition... Wait for results");
                
                
                
                
                lastPhotoContainer.innerHTML = "<img src='" + imageUri + "' style='width: 75%;' />";
                // lastPhotoResults.innerHTML = "<h2> " + predictImage(imageUri) + " </h2>";
                lastPhotoResults.innerHTML = "<h2> Still need to implement Results  </h2>";

            }, null, null);

            /*
                        var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
                        var fs = require('fs');
                        
                        var visualRecognition = new VisualRecognitionV3({
                            version: '2018-03-19',
                            iam_apikey: '{2KlvHYbvSR8JQV8VlgsooR-l0eKZG12f1o6lEoCS6bi1}'
                        });
                        
                        var images_file = fs.createReadStream('img/20181217_124427.jpg');
                        var classifier_ids = ["MinibarConsumptionLevelDetecti_1732811953"];
                        var threshold = 0.6;
                        
                        var params = {
                            images_file: images_file,
                            classifier_ids: classifier_ids,
                            threshold: threshold
                        };
                        
                        visualRecognition.classify(params, function(err, response) {
                            if (err) { 
                                console.log(err);
                            } else {
                                console.log(JSON.stringify(response, null, 2))
                            }
                        });
            
            
            
            
                        // NASA API Key: GiTBf74ADFEHGAbtMMi8qWFLFup0M6ZWZurbliQ5
            
            */

        }


    },


        
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:none;');

        console.log('Received Event: ' + id);
    }
};
