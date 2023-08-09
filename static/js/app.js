const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

var filter = d3.select("#selDataset"); 

// Setting up the default view on entering the page
var selection = "940"

// Executes change of selection and returns selected sample's data
function optionChanged(sample) {
    selection = sample;

    console.log(selection);

    initialize();

};

initialize();


function initialize(){ 

    d3.html('');

    d3.json(url).then((data) => {

        // Define a variable to hold the samples as an array
        var samples = data.samples;
        
        // Define a variable to hold the metadata as an array
        var metadata = data.metadata;


        // Executes the selection of data for a sample via the drop-down menu
        var ddmenu = samples.map(item => item.id).filter((value, index, self) => self.indexOf(value) === index);
    
        // Creates the drop-down menu
        ddmenu.forEach(function (values) {
            filter.append('option').text(values);
        });

        // Returns selected sample data as output
        var resultArray = samples.filter(sampleObj => sampleObj.id == selection);

        console.log(resultArray);

        // Defines selected sample as variable
        var result = resultArray[0];

        // Selecting the data required from the chosen sample's array
        var otu_ids = result.otu_ids;
        var sample_values = result.sample_values;
        var otu_labels = result.otu_labels;

        // Creating x-axis, y-axis, and labels for the bar graphs
        var ydata = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
        var xdata = sample_values.slice(0, 10).reverse();
        var labels = otu_labels.slice(0, 10).reverse();

        console.log(ydata);
        console.log(xdata);
        console.log(labels);

        var trace1 = {
            x: xdata,
            y: ydata,
            text: labels,
            orientation: 'h',
            type: 'bar'
        };

        var data = [trace1] 
        
        Plotly.newPlot('bar', data);

        // Selecting data for bubble plot
        var xbubble = otu_ids.slice(0, 10);
        xbubble.push.apply(xbubble, otu_ids.slice(Math.max(otu_ids.length - 10, 1)));

        var ybubble = sample_values.slice(0, 10);
        ybubble.push.apply(ybubble, sample_values.slice(Math.max(sample_values.length - 10, 1)));

        var bubble_labels = otu_labels.slice(0, 10);
        bubble_labels.push.apply(bubble_labels, otu_labels.slice(Math.max(otu_labels.length - 10, 1)));

        console.log(ybubble);
        console.log(xbubble);
        console.log(bubble_labels);

        // Creating bubble plot
        var trace2 = {
            x: xbubble,
            y: ybubble,
            mode: 'markers',
            marker: {
              color: xbubble,  
              size: ybubble,
              colorscale: "Rainbow"
            },
            text: bubble_labels
          };
          
          var data = [trace2];
          
          var layout = {
            xaxis: {
                title: "OTU ID"
            },
            showlegend: false,
            height: 600,
            width: 1200
          };
          
          Plotly.newPlot('bubble', data, layout);

        // Selecting sample metadata
        var MDArray = metadata.filter(metaObj => metaObj.id == selection);

        var MD_result = MDArray[0];

        // Returns demographic information for side panel

        var age = MD_result.age;
        var bbtype = MD_result.bbtype;
        var ethnicity = MD_result.ethnicity;
        var gender = MD_result.gender;
        var id = MD_result.id;
        var location = MD_result.location;


        // Formatting the demographic panel for readability and labels
        var demoinfo = ` id: ${id} <br> ethnicity: ${ethnicity} <br> gender: ${gender} <br> age: ${age} <br> location: ${location} <br> bbtype: ${bbtype}`

        document.getElementById('sample-metadata').innerHTML = demoinfo;
        

    });

};