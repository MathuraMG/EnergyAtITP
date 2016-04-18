function createContent(result,sectionClass)
{
  var selectClass = '';
  selectClass = '.' + sectionClass + ' .device-content .visHeading';
  $(selectClass).html('Power usage over last 24 hours');

  selectClass = '.' + sectionClass + ' .device-content .peak-usage';
  $(selectClass).html('Usage - peak vs off-peak hours');

  var equipName = pickMaxUsage(result);
  selectClass = '.' + sectionClass + ' .device-content .equipment-max-usage';
  $(selectClass).html('Equipment consuming maximum energy');

  selectClass = '.' + sectionClass + ' .device-content .equipment-max-usage-name';
  $(selectClass).html(equipName);



  // var lineDiv = $('<hr>');
  // lineDiv.addClass('lineDiv');
  // $(selectClass).append(lineDiv);

  // var visDiv = $('<div>');
  // visDiv.addClass('visDiv');
  // $(selectClass).append(visDiv);
  //
  // var visSvg = $('<svg>');
  // visSvg.addClass('visualisation');
  // $(visDiv).append(visSvg);

  drawGraph(result,sectionClass);
  drawPieCharts(result);


  //drawPieCharts(result);

}

function pickMaxUsage(result)
{
  return 'potato';
}

function drawGraph(allLineData,sectionClass)
{

  var fullRoomIndex = allLineData.length - 1;

  var elementSelect = '.' + sectionClass + ' .visualisation';

  console.log('potatoooo -- ');
  console.log(elementSelect);

  console.log($(elementSelect));

  var vis = d3.select(elementSelect),
      WIDTH = 2000,
      HEIGHT = 200,
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
        .tickSize(0.5)
        .ticks(24)
        //.tickValues(["3 Feb","4 Feb","5 Feb","6 Feb","7 Feb","8 Feb","9 Feb"]);
      y1Axis = d3.svg.axis()
        .scale(yRange)
        .tickSize(0.5)
        .orient('left')
        .tickSubdivide(true);

  vis.append('svg:g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
    .call(xAxis);

  vis.append('svg:g')
    .attr('class', 'axis')
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

function drawPieCharts(energyData)
{
  var totalEnergyOffPeakData = [];
  var totalEnergyPeakData = [];

  var totalEnergyOffPeakDataWatt = 0;
  var totalEnergyPeakDataWatt = 0;

  var width = 500;
  var height = 500;
  var radius = 250;


  /****************************************************************
  FOR PEAK ENERGY
  ****************************************************************/
  for(var i =0;i<energyData.length;i++)
  {
    if(energyData[i].name.localeCompare("x") == 0){
      console.log('garbegeish');
    }
    else
    {
      console.log('pushing data');
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
  var elementSelect = '.' + sectionClass + ' .visualisation-pie';
  // $(elementSelect).html( Math.round(totalEnergyPeakDataWatt/4000,2) + 'kWh');

  console.log('going to get pie chart');
  getPieChart(totalEnergyPeakData, width, height,radius,elementSelect,0,0);

  // getPieChart(totalEnergyOffPeakData, width, height,radius*ratio,'#chartOffPeakData',width/2,height/2);
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
