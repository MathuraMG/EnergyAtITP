function deleteContent()
{
  $('.visualisation-pie').empty();
  $('.visualisation').empty();
}

function createContent(result,sectionClass, isDay, range)
{
  var selectClass = '';
  selectClass = '.' + sectionClass + ' .device-content .visHeading';
  $(selectClass).html('Power usage over last 24 hours');

  selectClass = '.' + sectionClass + ' .device-content .peak-usage';
  $(selectClass).html('Usage - peak vs off-peak hours');

  var equipDetails = pickMaxUsage(result);
  var equipName = equipDetails.name;
  selectClass = '.' + sectionClass + ' .device-content .equipment-max-usage';
  $(selectClass).html('Equipment consuming maximum energy');

  selectClass = '.' + sectionClass + ' .device-content .equipment-max-usage-name';
  $(selectClass).html(equipName);

  drawGraph(result,sectionClass,isDay, range);
  drawPieCharts(result,sectionClass);

}

function pickMaxUsage(result)
{
  console.log('test test test');
  console.log(result);
  var maxEquipmentName = result[0].name;
  var maxEquipmentValue = result[0].totalEnergyPeak + result[0].totalEnergyOffPeak;
  var totalRoomValue = maxEquipmentValue;

  //get the name of the equipoment which used maximum energy
  for(var i =1;i<result.length;i++){
    var totalValue = result[i].totalEnergyPeak + result[i].totalEnergyOffPeak;
    if(totalValue > maxEquipmentValue)
    {
      maxEquipmentValue = totalValue;
      maxEquipmentName = result[i].name;
    }
    totalRoomValue += totalValue;
  }
  var percentage = (100*maxEquipmentValue)/totalRoomValue;
  return {
    'name': maxEquipmentName,
    'value' : maxEquipmentValue,
    'percentage': percentage
  };
}

function drawGraph(allLineData,sectionClass,isDay, range)
{

  var fullRoomIndex = allLineData.length - 1;
  console.log(allLineData);

  var elementSelect = '.' + sectionClass + ' .visualisation';
  var timeFormat = d3.time.format("%I");
  var vis = d3.select(elementSelect),
      WIDTH = 1000,
      HEIGHT = 120,
      MARGINS = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 40
      },
      xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right])  .domain([d3.min(allLineData[fullRoomIndex].value,function(d){
        return d.x; }),
        d3.max(allLineData[fullRoomIndex].value,function(d){
        return d.x; })]),
      yRange = d3.scale.linear()
              .range([HEIGHT - MARGINS.top, MARGINS.bottom])
              .domain([0,d3.max(allLineData[fullRoomIndex].value,function(d){

                                                          return d.y; })]),
      xAxis = d3.svg.axis()
        .scale(xRange)
        .tickSize(0.5)
        .ticks(24)
        //.tickFormat(d3.time.format("%d"))
        //.tickFormat(d3.time.format("%d"))
        //.tickValues(["3 Feb","4 Feb","5 Feb","6 Feb","7 Feb","8 Feb","9 Feb"]);
      y1Axis = d3.svg.axis()
        .scale(yRange)
        .tickSize(0.5)
        .orient('left')
        .tickSubdivide(true);

  vis.append('svg:g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
    .style("position", "fixed")
    .call(xAxis);

  vis.append('svg:g')
    .attr('class', 'axis')
    .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
    .call(y1Axis);
  var i =1;
  var scale = (1000/1440);


  vis.append("rect").attr("x", range[0]*scale).attr("y", 20).attr("width",  (range[1]-range[0])*scale).attr("class","line-chart-off-peak");

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

    console.log(allLineData[fullRoomIndex]);
    console.log('drawing graph for -- ' + allLineData[fullRoomIndex].name );
    var className = 'class-'+allLineData[fullRoomIndex].name;
    className = className.replace(/\s+/g, '');
    var color = d3.hsl(20, 0.4,0.65);
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

function drawPieCharts(energyData,sectionClass)
{
  var totalEnergyOffPeakData = [];
  var totalEnergyPeakData = [];

  var totalEnergyOffPeakDataWatt = 0;
  var totalEnergyPeakDataWatt = 0;

  var width = 0.6*screen.width;
  var height = 0.6*screen.width;;
  var radius = 0.3*screen.width;;


  /****************************************************************
  FOR PEAK ENERGY
  ****************************************************************/
  for(var i =0;i<energyData.length;i++)
  {
    if(energyData[i].name.localeCompare("x") == 0){
      console.log('garbegeish');
    }
    else if(energyData[i].name.localeCompare("roomTotal") == 0){
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
  ratio = Math.sqrt(ratio);
  var elementSelect = '.' + sectionClass + ' .visualisation-pie.visualisation-pie-peak';

  // $(elementSelect).html( Math.round(totalEnergyPeakDataWatt/4000,2) + 'kWh');

  console.log('going to get pie chart');
  getPieChart(totalEnergyPeakData, width, height,radius,elementSelect,0,0);

  var elementSelect = '.' + sectionClass + ' .visualisation-pie.visualisation-pie-off-peak';

  console.log('going to get pie chart');
  getPieChart(totalEnergyOffPeakData, width*ratio, height*ratio,radius*ratio,elementSelect,0,0);

  // getPieChart(totalEnergyOffPeakData, width, height,radius*ratio,'#chartOffPeakData',width/2,height/2);
}

function getPieChart(data,width,height,radius,id,xOffset,yOffset)
{
  var vis = d3.select(id).append("svg:svg")
  .data([data])
  .attr("width", width)
  .attr("height", height)
  .attr('class','pie-chart-svg')
  .append("svg:g")
  .attr("transform", "translate(" +(radius+xOffset ) + "," + (radius+yOffset) + ")");
  var pie = d3.layout.pie().value(function(d){return d.value;});

  // declare an arc generator function
  var arc = d3.svg.arc().outerRadius(radius);

  // select paths, use arc generator to draw
  var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
  arcs.append("svg:path")
      .attr("fill", function(d, i){
        console.log('the color is -- ' + i)
          return d3.hsl((360-i*10)%40, 0.4,0.65);
      })
      .attr("d", function (d) {
          // log the result of the arc generator to show how cool it is :)
          //console.log(arc(d));
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
