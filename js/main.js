var currentSection = 'cover-page-section';
// $( document ).ready(function(){
//   onLoad();
// });

function onLoad(){

  setTimeout(function(){
    sectionClass = 'main-page-section';
    changeSection(sectionClass);
   }, 2000);
  //LOGIN to the enertiv API on load of the page
  makeAjaxCall('login?loginId=horsetrunk12');

  //*****************************************
  // ROOMS THAT ARE PRESENT BELOW
  //  1) KITCHEN
  //  2) SHOP
  //  3) PCOMP
  //  4) CLASSROOMS
  //  5) FACULTY - NEED TO INCLUDE
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


  //attach on swipe functions for the pie charts
  $('.visualisation-pie-peak').on("swipeleft", function() {
    //fade in and out the icons indicating which pie chart is showing
    $('.sun-selection-icon').css('opacity',0.7);
    $('.moon-selection-icon').css('opacity',1);
    $('.visualisation-pie-peak').fadeOut(100,function(){
      $('.pie-chart-peak-numbers').fadeOut(100,function(){
        $('.visualisation-pie-off-peak').fadeIn();
      });
    });
    $('.pie-chart-off-peak-numbers').fadeIn();
  });
  $('.visualisation-pie-off-peak').on("swiperight", function() {
    //fade in and out the icons indicating which pie chart is showing
    $('.sun-selection-icon').css('opacity',1);
    $('.moon-selection-icon').css('opacity',0.7);
    $('.visualisation-pie-off-peak').fadeOut(100,function(){
      $('.pie-chart-off-peak-numbers').fadeOut(100,function(){
        $('.visualisation-pie-peak').fadeIn();
      });
    });
    $('.pie-chart-peak-numbers').fadeIn();
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
      //console.log(result.data);

      deleteContent();
      createContent(result.data,sectionClass, result.isDay, result.range);

    }
  });

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
