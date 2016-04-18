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

//var serverUrl = 'http://itpenertivserver.herokuapp.com/';
var serverUrl = 'http://localhost:5000/';

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        onLoad();
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
      alert('hi');
      alert('hellllooooo');
    },

};

var currentSection = 'main-page-section';
// $( document ).ready(function(){
//   onLoad();
// });

function onLoad(){
  //LOGIN to the enertiv API on load of the page
  makeAjaxCall('login');

  //*****************************************
  // ROOMS THAT ARE PRESENT BELOW
  //  1) KITCHEN
  //  2) SHOP
  //  3) PCOMP
  //  4) CLASSROOMS
  //*****************************************


  //*****************************************
  //
  // 								KITCHEN
  //
  //*****************************************

  //attach onclick functions for all the rooms
  $('.kitchen-room').click(function(){
    sectionClass = 'kitchen-room-section';
    changeSection(sectionClass);
    makeAjaxCall('kitchen',sectionClass);

  });

  //*****************************************
  //
  // 								SHOP
  //
  //*****************************************


  $('.shop-room').click(function(){
    var sectionClass = 'shop-room-section';
    changeSection(sectionClass);
    makeAjaxCall('shop',sectionClass);
  });

  //*****************************************
  //
  // 								PCOMP
  //
  //*****************************************

  //attach onclick functions for all the rooms
  $('.phys-comp-room').click(function(){
    var sectionClass = 'phys-comp-room-section';
    changeSection(sectionClass);
    makeAjaxCall('physComp',sectionClass);
  });

  //*****************************************
  //
  // 								CLASSROOMS
  //
  //*****************************************

  //attach onclick functions for all the rooms
  $('.class-room').click(function(){
    var sectionClass = 'class-room-section';
    changeSection(sectionClass);
    makeAjaxCall('classrooms',sectionClass);

  });



}

function makeAjaxCall(urlPath, sectionClass)
{
  var data;
  var url = serverUrl + urlPath;
  console.log(' the generated URL - '  + url);
  $.ajax({
    url: url,
    success: function(result){
      console.log(result);
      data = result;
      deleteContent();
      createContent(result,sectionClass);

    }
  });
  return(data);
}

function changeSection(idName)
{
  currentSectionId = '#' + currentSection;
  changeSectionId = '#'+idName;

  $(currentSectionId).fadeOut( 100, function() {
    $(changeSectionId).fadeIn();
    currentSection = idName;
    $(changeSectionId).on("swiperight",function(e){
      if ( e.swipestart.coords[0] <50) {
        changeSection('main-page-section');
      }

    });
  });

}

//$("selector").on("swipeleft",function(event){...})
