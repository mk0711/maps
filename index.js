
/**
 * This example shows how to plot points on a map
 * and how to work with normal geographical data that
 * is not in GeoJSON form
 * 
 * Outline:
 * 1. show how to load multiple files of data 
 * 2. talk about how geoAlbers() is a scaling function
 * 3. show how to plot points with geoAlbers
 */
const m = {
    width: 800,
    height: 600
}

const svg = d3.select("body").append('svg')
    .attr('width', m.width)
    .attr('height', m.height)

const g = svg.append('g')

// neighborhoods.json taken from rat map example
d3.json('nygeo.json').then(function(data) {

    d3.csv('data.csv').then(function(airbnbData) {


        const albersProj = d3.geoAlbers()
            .scale(190000)
            .rotate([71.057, 0])
            .center([0, 42.313])
            .translate([m.width/2, m.height/2]);

        // this code shows what albersProj really does
        // let point = pointData[0]
        // let arr = [ point['long'] , point['lat'] ]
        // let scaled = albersProj(arr)
        // console.log(scaled)

        const geoPath = d3.geoPath()
        .projection(albersProj)
        console.log(data.features)
        g.selectAll('path')
        .data(data.features)
        .enter()
        .append('path')
            .attr('fill', '#ccc')
            .attr('d', geoPath)


        const allPaths = [];
        const df = data.features;
        console.log(data.features[1])

            for (let i = 0; i < data.features.length - 1; i++) {
                const r = albersProj(data.features[i].geometry.coordinates);
                const n = albersProj(data.features[i+1].geometry.coordinates);
                allPaths.push([r, n]);
            }
        console.log(allPaths)

        // plots circles on the boston map
        g.selectAll('.circle')
        .data(airbnbData)
        .enter()
        .append('circle')
            .attr('cx', function(d) { 
               let scaledPoints = albersProj([d['longitude'], d['latitude']])
                return scaledPoints[0]
            })
            .attr('cy', function(d) {
                let scaledPoints = albersProj([d['longitude'], d['latitude']])
               return scaledPoints[1]
            })
            .attr('r', 5)
            .attr('fill', 'steelblue')
            .attr("width",60)
            .attr("height",50)
            .on( "click", function(){
              d3.select(this)
                .attr("opacity",1)
                .transition()
                .duration( 1000 )
                .attr( "cx", width * Math.round( Math.random() ) )
                .attr( "cy", height * Math.round( Math.random() ) )
                .attr( "opacity", 0 )
                .on("end",function(){
                  d3.select(this).remove();
                })
           })
        
    })
  
})
