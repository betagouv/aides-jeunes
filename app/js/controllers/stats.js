'use strict';

angular.module('ddsApp').controller('StatsCtrl', function($scope, $http) {

    // Define margins
    var margin = {top: 20, right: 80, bottom: 30, left: 50},
        width = parseInt(d3.select("#chart").style("width")) - margin.left - margin.right,
        height = parseInt(d3.select("#chart").style("height")) - margin.top - margin.bottom;

    // Define date parser
    var parseDate = d3.timeParse("%Y-%m-%d");

    // Define scales
    var xScale = d3.scaleTime().range([0, width]);
    var yScale = d3.scaleLinear().range([height, 0]);
    var color = d3.scaleOrdinal().range(["#e41a1c", "#377eb8"]);

    // Define axes
    var xAxis = d3.axisBottom().scale(xScale);
    var yAxis = d3.axisLeft().scale(yScale);

    // Define lines
    var line = d3.line()
        .x(function(d) { return xScale(d.date); })
        .y(function(d) { return yScale(d.value); });

    // Define svg canvas
    var chart = d3.select("#chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    var svg = chart
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var tooltip = svg.append("g");
    tooltip.append("g");

    var legend = tooltip.append("text")
        .attr("transform", "translate(10,10)");

    var chartDate = tooltip.append("text")
        .attr('transform', 'translate(' + width + ',10)')
        .style('text-anchor', 'end');

    $http.get('/documents/stats.json')
        .then(function(response) {
            $scope.error = (response.headers('Content-Type').match(/html/));
            if ($scope.error)
                return;

            var data = response.data.basic;

            data.forEach(function(dataset) {
                dataset.datapoints.forEach(function(point) {
                    point.date = parseDate(point.date);
                });
            });
            color.domain(data.map(function(data) { return data.metric; }));

            var yDomain = d3.extent(data[1].datapoints, function(d) { return d.value; });
            yDomain[0] = 0;
            yDomain[1] *= 1.2;

            xScale.domain(d3.extent(data[1].datapoints, function(d) { return d.date; }));
            yScale.domain(yDomain);

            // Place the axes on the chart
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("class", "label")
                .attr("y", 6)
                .attr("dy", ".71em")
                .attr("dx", ".71em")
                .style("text-anchor", "beginning")
                .text("Product Concentration");

            var metrics = svg.selectAll(".metric")
                .data(data)
                .enter().append("g")
                .attr("class", "metric");

            metrics.append("path")
                .attr("class", "line")
                .style("stroke", function(d) { return color(d.metric); })
                .attr("d", function(d) { return line(d.datapoints); });

            chart.on("mousemove", function() {
                var point = d3.mouse(svg.node());

                var date = parseDate(moment(xScale.invert(point[0])).format('YYYY-MM-DD'));
                var dateValue = date.valueOf();
                var slice = data.map(function(dataset) {
                    var idx = dataset.datapoints.findIndex(function(d) { return d.date.valueOf() === dateValue; });
                    var point = dataset.datapoints[idx] || {};
                    return {
                        metric: dataset.metric,
                        value: point.value,
                    };
                });

                _.remove(slice, function(d) { return ! _.isNumber(d.value); });
                slice.sort(function(metric) { return metric.value; });

                var nodes = tooltip
                    .select('g')
                    .selectAll('circle')
                    .data(slice);

                nodes
                    .enter()
                    .append('circle')
                    .attr('r', 0);

                nodes
                    .attr('r', function(d) { return _.isNumber(d.value) ? 5 : 0; })
                    .attr('cx', function() { return xScale(date); })
                    .attr('cy', function(d) { return yScale(d.value); })
                    .style("stroke", function(d) { return color(d.metric); })
                    .style("fill", function(d) { return color(d.metric); });

                nodes
                    .exit()
                    .remove();

                var names = {
                    visit: 'Visites',
                    simulation: 'Simulations terminées',
                };
                var legendData = legend
                    .selectAll('tspan')
                    .data(slice);

                legendData.enter()
                    .append('tspan')
                    .attr('x', '0')
                    .attr('dy', function(d, i) { return i * 20; });

                legendData
                    .text(function(d) { return names[d.metric] + ' : ' + d.value; })
                    .style("fill", function(d) { return color(d.metric); });

                legendData
                    .exit()
                    .remove();

                var chartDateNode = chartDate
                    .selectAll('tspan')
                    .data(slice.length ? [date]: []);
                chartDateNode.enter()
                    .append('tspan');

                chartDateNode
                    .text(function(d) { return moment(d).format('dddd DD MMMM YYYY'); });

                chartDateNode
                    .exit()
                    .remove();
            });

            $scope.allStatsRetrieved = true;
        }, function() {
            $scope.error = true;
        });
});
