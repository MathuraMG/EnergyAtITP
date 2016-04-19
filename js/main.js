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