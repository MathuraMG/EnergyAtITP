function writeIndNumbers(allLineData)
{
  var section = document.getElementsByClassName('perEquipmentNumber')[0];

  for(var i=0;i<allLineData.length;i++)
  {
    if(allLineData[i].name.localeCompare("x") == 0){
      console.log('garbegeish');
    }
    else if(allLineData[i].name.localeCompare("Outlet") == 0){
      console.log('garbegeish');
    }
    else if(allLineData[i].name.localeCompare("Laser Cutter") == 0){
      console.log('garbegeish');
    }
    else if(allLineData[i].name.localeCompare("Emergency Power Switch") == 0){
      console.log('garbegeish');
    }
    else
    {
      var totalEnergykWh = allLineData[i].totalEnergyOffPeak + allLineData[i].totalEnergyPeak;
      var className = 'class-'+allLineData[i].name;
      className = className.replace(/\s+/g, '');

      var dataDiv = document.createElement('div');
      dataDiv.classList.add('equipmentDetails');
      dataDiv.classList.add(className);

      section.appendChild(dataDiv);

      var equipName = document.createElement('div');
      equipName.classList.add('equipmentName');
      equipName.innerHTML = allLineData[i].name;

      var equipEnergy = document.createElement('div');
      equipEnergy.classList.add('equipmentEnergy');
      equipEnergy.innerHTML = Math.round(totalEnergykWh/4000,2) + 'kWh';

      var equipEnergyPeak = document.createElement('div');
      equipEnergyPeak.classList.add('equipmentEnergy');
      equipEnergyPeak.innerHTML = Math.round(allLineData[i].totalEnergyPeak/4000,2) + 'kWh';

      var equipEnergyOffPeak = document.createElement('div');
      equipEnergyOffPeak.classList.add('equipmentEnergy');
      equipEnergyOffPeak.innerHTML = Math.round(allLineData[i].totalEnergyOffPeak/4000,2) + 'kWh';

      var InstPower = document.createElement('div');
      InstPower.classList.add('equipmentEnergy');
      InstPower.innerHTML = Math.round(totalEnergykWh/(24*7*4),2) + 'W';

      dataDiv.appendChild(equipName);
      dataDiv.appendChild(equipEnergy);
      dataDiv.appendChild(equipEnergyPeak);
      dataDiv.appendChild(equipEnergyOffPeak);
      dataDiv.appendChild(InstPower);
    }


  }
}

function drawGraph(allLineData,sectionClass)
{

  var fullRoomIndex = allLineData.length - 1;

  var elementSelect = '.' + sectionClass + ' .visualisation';
  console.log(elementSelect)

  var vis = d3.select(elementSelect),
      WIDTH = 2000,
      HEIGHT = 400,
      MARGINS = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 40
      },
      xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([0,24*60]),
      yRange = d3.scale.linear()
              .range([HEIGHT - MARGINS.top, MARGINS.bottom])
              .domain([0,d3.max(allLineData[fullRoomIndex].value,function(d){

                                                          return d.y; })]),
      xAxis = d3.svg.axis()
        .scale(xRange)
        .tickSize(2)
        .ticks(24)
        //.tickValues(["3 Feb","4 Feb","5 Feb","6 Feb","7 Feb","8 Feb","9 Feb"]);
      y1Axis = d3.svg.axis()
        .scale(yRange)
        .tickSize(2)
        .orient('left')
        .tickSubdivide(true);

  vis.append('svg:g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
    .call(xAxis);

  vis.append('svg:g')
    .attr('class', 'y-axis')
    .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
    .call(y1Axis);
  var i =1;
  var scale = ((0.7*screen.width-60)/168);
  //vis.append("rect").attr("x", scale*24*i).attr("y", 20).attr("width",  scale*10).attr("fill","#888888").attr("height", 460);

  var totalData = [];

  var lineFunc = d3.svg.line()
    .x(function(d) {
      return xRange(d.x);
    })
    .y(function(d) {
      return yRange(d.y);
    })
    .interpolate('basis');


    var allIndexDiv = document.getElementsByClassName('allIndexButtons')[0];



      //console.log(allLineData[i].value);



    console.log(allLineData[fullRoomIndex]);
    console.log('drawing graph for -- ' + allLineData[fullRoomIndex].name );
    var className = 'class-'+allLineData[fullRoomIndex].name;
    className = className.replace(/\s+/g, '');
    var color = d3.hsl(240, 0.4,0.65);
    var classNamePath = className + ' graphPath';


    vis.append('svg:path')
    .attr('d', lineFunc(allLineData[fullRoomIndex].value))
    .attr('stroke', color)
    .attr('stroke-width', 2)
    .attr('fill', 'none')
    .attr('class',classNamePath);


    var classNameText = className + ' graphText';
    vis.append('svg:text')
  	.attr('transform', 'translate(' + (910) + ',' + (2500-allLineData[fullRoomIndex].value[22*7].y)+ ')')
  	.attr('dy', '0')
  	.attr('text-anchor', 'start')
  	.style('fill', color)
    .attr('class',classNameText)
  	.text(allLineData[fullRoomIndex].name);


}

function indexContent(text,className,allIndexDiv,color)
{
  console.log('drawing button for -- ' + text);

  var a = document.createElement('button');
  a.innerHTML = text ;
  a.classList.add('indexElements');
  allIndexDiv.appendChild(a);
  a.style.background = color;
  a.onclick = function(){
    var line = document.getElementsByClassName(className);
    for(var i=0;i<line.length;i++){
      if(line[i].style.display.localeCompare('none') == 0)
      {
        line[i].style.display = 'block';
        a.style.background = color;
      }
      else
      {
        line[i].style.display = 'none';
        a.style.background = '#aaaaaa';
      }
    }


  }
}

function drawPieCharts(energyData)
{
  var totalEnergyOffPeakData = [];
  var totalEnergyPeakData = [];

  var totalEnergyOffPeakDataWatt = 0;
  var totalEnergyPeakDataWatt = 0;

  var width = 0.3*screen.width;
  var height = 0.3*screen.width;
  var radius = 0.15*screen.width;


  /****************************************************************
  FOR PEAK ENERGY
  ****************************************************************/
  for(var i =0;i<energyData.length;i++)
  {
    if(energyData[i].name.localeCompare("x") == 0){
      console.log('garbegeish');
    }
    else if(energyData[i].name.localeCompare("Outlet") == 0){
      console.log('garbegeish');
    }
    else if(energyData[i].name.localeCompare("Laser Cutter") == 0){
      console.log('garbegeish');
    }
    else if(energyData[i].name.localeCompare("Emergency Power Switch") == 0){
      console.log('garbegeish');
    }
    else
    {
    totalEnergyPeakData.push(
      {"label":energyData[i].name,
      "value":energyData[i].totalEnergyPeak});
    totalEnergyOffPeakData.push(
      {"label":energyData[i].name,
      "value":energyData[i].totalEnergyOffPeak});

    totalEnergyOffPeakDataWatt += energyData[i].totalEnergyOffPeak;
    totalEnergyPeakDataWatt += energyData[i].totalEnergyPeak;
    }
  }

  var ratio = totalEnergyOffPeakDataWatt/totalEnergyPeakDataWatt;

  $('#numbersPeakData').html( Math.round(totalEnergyPeakDataWatt/4000,2) + 'kWh');
  $('#numbersOffPeakData').html( Math.round(totalEnergyOffPeakDataWatt/4000,2) + 'kWh');
  var noOfBulbs = Math.round(((totalEnergyOffPeakDataWatt+totalEnergyPeakDataWatt)/4000)/energyBulbInOneWeek,0);
  $('#noOfBulbs').html( 'Energy usage in the shop is same as leaving '+ noOfBulbs +' bulbs on all day and night for a week ');

  drawLightBulbs(noOfBulbs);
  getPieChart(totalEnergyPeakData, width, height,radius,'#chartPeakData',0,0);
  getPieChart(totalEnergyOffPeakData, width, height,radius*ratio,'#chartOffPeakData',width/2,height/2);

}
function getPieChart(data,width,height,radius,id,xOffset,yOffset)
{
  var vis = d3.select(id).append("svg:svg").data([data]).attr("width", width).attr("height", height).append("svg:g").attr("transform", "translate(" +(radius+xOffset ) + "," + (radius+yOffset) + ")");
  var pie = d3.layout.pie().value(function(d){return d.value;});

  // declare an arc generator function
  var arc = d3.svg.arc().outerRadius(radius);

  // select paths, use arc generator to draw
  var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
  arcs.append("svg:path")
      .attr("fill", function(d, i){
        console.log('the color is -- ' + i)
          return d3.hsl(360-i*30, 0.4,0.65);
      })
      .attr("d", function (d) {
          // log the result of the arc generator to show how cool it is :)
          console.log(arc(d));
          return arc(d);
      });

  // add the text
  arcs.append("svg:text").attr("transform", function(d){
  			d.innerRadius = 0;
  			d.outerRadius = 100;
      return "translate(" + arc.centroid(d) + ")";}).attr("text-anchor", "middle").text( function(d, i) {
      return data[i].label;}
    ).attr("class","pieChartText");

}

function drawLightBulbs(noOfBulbs)
{
  for(var i=0;i<noOfBulbs;i++)
  {
    var img = document.createElement('img');
    img.src = '/assets/CFL.png';
    img.classList.add('bulbImage');

    var block = document.getElementsByClassName('numberOfBulbsInfograph')[0];
    block.appendChild(img);
  }
}
