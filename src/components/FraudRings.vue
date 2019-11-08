<template>
    <div id="container">
        <div id="title" class="row">
            <div class="col align-self-center">There are {{ nb_node }} nodes in the current graph
            </div>
        </div>
        <div class="row">
            <div class="col-lg-6">
                List of suspicious cases:
                <div class="row">
                    <div name="card" class="col-lg-4 n4ja-loading" v-for="item in ssn_list" :key="item.ssn">
                        <div class="card bg-light mb-3" style="max-width: 18rem;">
                            <div class="card-header btn btn-info" @click="graph(item.ssn)">Case {{ item.id }}</div>
                            <div class="card-body">
                                <h5 class="card-title">SSN: {{ item.ssn }}</h5>
                                <h6>Type of Fraud: <i>Sharing SSN</i></h6>
                                <h6>Confidence: <i>99%</i></h6>
                                <h6>Nb of AccountHolder: <i>{{ item.nb }}</i> </h6>
                                <ul class="">
                                    <li class="list-group-item" v-for="AH in item.accountHolder"> {{ AH }}</li>
                                </ul>
                                <br>
                                <p class="card-text"><button type="button" class="btn btn-info" @click="openBloom(item.ssn)">Investigate</button></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="row">
                    <div id="viz" class="col-lg-12"></div>
                    <div id="my_dataviz" class="col-lg-12"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import router from '../router'

    let counter = 0;
    export default {
        name: "FraudRings",
        data() {
            return {
                nb_node: Number,
                ssn_list: [],
                counter: Number
            }
        },
        methods: {
            NeoConnect: function () {
                /* eslint-disable */
                try {
                    const session = this.$neo4j.getSession()
                    session.run('MATCH (n) RETURN count(n) AS count')
                        .then(res => {
                            /* eslint-disable-next-line no-console */
                            console.log(res.records[0].get('count'))
                            this.nb_node = res.records[0].get('count')
                        })
                        .then(() => {
                            session.close()
                        })
                } catch (e) {
                    /* eslint-disable-next-line no-console */
                    console.log("error")
                    localStorage.removeItem("neo4jsession")
                    router.push({ name: 'home'})
                }
            },
            getSSN: function () {
                try{
                    const session = this.$neo4j.getSession()
                    session.run('MATCH (s:SSN)-[hs:HAS_SSN]-(:AccountHolder) \n' +
                        'WITH s, count(hs) as nb_ssn\n' +
                        'MATCH (:SSN {ssn:s.ssn})-[:HAS_SSN]-(ah:AccountHolder) \n' +
                        'RETURN s.ssn as ssn, nb_ssn, collect(ah.fullName) as listAH ORDER BY nb_ssn DESC LIMIT 3')
                        .then(res => {
                            res.records.forEach(element => {
                                counter++
                                this.ssn_list.push({id:counter, ssn:element.get('ssn'), nb:element.get('nb_ssn'), accountHolder:element.get('listAH')})
                            })
                        })
                        .then(() => {
                            session.close()
                        })
                } catch (e) {
                    /* eslint-disable-next-line no-console */
                    console.log("error")
                }
            },
            graph: function(ssn){
                this.drawD3graph()
                let viz
                let neo4j_url = localStorage.getItem("neo4j-protocol") + "://" + localStorage.getItem("neo4j-host") + ":" + localStorage.getItem("neo4j-port")
                let config = {
                    container_id: "my_dataviz",
                    server_url: neo4j_url,
                    server_user: localStorage.getItem("neo4j-username"),
                    server_password: localStorage.getItem("neo4j-password"),
                    labels: {
                    },
                    relationships: {
                        "HAS_SSN": {
                            "thickness": "light",
                            "caption": false
                        },
                        "HAS_ADDRESS": {
                            "thickness": "light",
                            "caption": false
                        },
                        "HAS_PHONENUMBER": {
                            "thickness": "light",
                            "caption": false
                        },
                    },
                    /* "MATCH (account_h:AccountHolder)-[a1:HAS_ADDRESS]-(shared_address:Address)-[a2:HAS_ADDRESS]-(suspected_fraud:AccountHolder),\n" +
                        "(account_h)-[first_ssn:HAS_SSN]-(ssn:SSN {ssn:'"+ssn+"'})-[suspected_fraud_ssn:HAS_SSN]-(suspected_fraud)\n" +
                        "return *" */
                    initial_cypher: "MATCH (s:SSN {ssn:'"+ssn+"'})-[hs:HAS_SSN]-(ah:AccountHolder), (ah)-[ha:HAS_ADDRESS|HAS_PHONENUMBER]-(a) RETURN s,hs,ah,ha,a"
                };

                viz = new NeoVis.default(config);
                viz.render();
            },
            openBloom: function(ssn){
                window.open("neo4j://neo4j-bloom/?search=show%20fraud%20rings%20"+ssn);
            },
            drawD3graph: function () {

                var logos = {
                    star: "M12.075,10.812c1.358-0.853,2.242-2.507,2.242-4.037c0-2.181-1.795-4.618-4.198-4.618S5.921,4.594,5.921,6.775c0,1.53,0.884,3.185,2.242,4.037c-3.222,0.865-5.6,3.807-5.6,7.298c0,0.23,0.189,0.42,0.42,0.42h14.273c0.23,0,0.42-0.189,0.42-0.42C17.676,14.619,15.297,11.677,12.075,10.812 M6.761,6.775c0-2.162,1.773-3.778,3.358-3.778s3.359,1.616,3.359,3.778c0,2.162-1.774,3.778-3.359,3.778S6.761,8.937,6.761,6.775 M3.415,17.69c0.218-3.51,3.142-6.297,6.704-6.297c3.562,0,6.486,2.787,6.705,6.297H3.415z",
                    accountHolder: "M12.075,10.812c1.358-0.853,2.242-2.507,2.242-4.037c0-2.181-1.795-4.618-4.198-4.618S5.921,4.594,5.921,6.775c0,1.53,0.884,3.185,2.242,4.037c-3.222,0.865-5.6,3.807-5.6,7.298c0,0.23,0.189,0.42,0.42,0.42h14.273c0.23,0,0.42-0.189,0.42-0.42C17.676,14.619,15.297,11.677,12.075,10.812 M6.761,6.775c0-2.162,1.773-3.778,3.358-3.778s3.359,1.616,3.359,3.778c0,2.162-1.774,3.778-3.359,3.778S6.761,8.937,6.761,6.775 M3.415,17.69c0.218-3.51,3.142-6.297,6.704-6.297c3.562,0,6.486,2.787,6.705,6.297H3.415z",
                    securityNumber: "M17.308,7.564h-1.993c0-2.929-2.385-5.314-5.314-5.314S4.686,4.635,4.686,7.564H2.693c-0.244,0-0.443,0.2-0.443,0.443v9.3c0,0.243,0.199,0.442,0.443,0.442h14.615c0.243,0,0.442-0.199,0.442-0.442v-9.3C17.75,7.764,17.551,7.564,17.308,7.564 M10,3.136c2.442,0,4.43,1.986,4.43,4.428H5.571C5.571,5.122,7.558,3.136,10,3.136 M16.865,16.864H3.136V8.45h13.729V16.864z M10,10.664c-0.854,0-1.55,0.696-1.55,1.551c0,0.699,0.467,1.292,1.107,1.485v0.95c0,0.243,0.2,0.442,0.443,0.442s0.443-0.199,0.443-0.442V13.7c0.64-0.193,1.106-0.786,1.106-1.485C11.55,11.36,10.854,10.664,10,10.664 M10,12.878c-0.366,0-0.664-0.298-0.664-0.663c0-0.366,0.298-0.665,0.664-0.665c0.365,0,0.664,0.299,0.664,0.665C10.664,12.58,10.365,12.878,10,12.878",
                    home: "M18.121,9.88l-7.832-7.836c-0.155-0.158-0.428-0.155-0.584,0L1.842,9.913c-0.262,0.263-0.073,0.705,0.292,0.705h2.069v7.042c0,0.227,0.187,0.414,0.414,0.414h3.725c0.228,0,0.414-0.188,0.414-0.414v-3.313h2.483v3.313c0,0.227,0.187,0.414,0.413,0.414h3.726c0.229,0,0.414-0.188,0.414-0.414v-7.042h2.068h0.004C18.331,10.617,18.389,10.146,18.121,9.88 M14.963,17.245h-2.896v-3.313c0-0.229-0.186-0.415-0.414-0.415H8.342c-0.228,0-0.414,0.187-0.414,0.415v3.313H5.032v-6.628h9.931V17.245z M3.133,9.79l6.864-6.868l6.867,6.868H3.133z",
                    phone: "M13.372,1.781H6.628c-0.696,0-1.265,0.569-1.265,1.265v13.91c0,0.695,0.569,1.265,1.265,1.265h6.744c0.695,0,1.265-0.569,1.265-1.265V3.045C14.637,2.35,14.067,1.781,13.372,1.781 M13.794,16.955c0,0.228-0.194,0.421-0.422,0.421H6.628c-0.228,0-0.421-0.193-0.421-0.421v-0.843h7.587V16.955z M13.794,15.269H6.207V4.731h7.587V15.269z M13.794,3.888H6.207V3.045c0-0.228,0.194-0.421,0.421-0.421h6.744c0.228,0,0.422,0.194,0.422,0.421V3.888z",
                    apple: "M24.32,10.85c-1.743,1.233-2.615,2.719-2.615,4.455c0,2.079,1.078,3.673,3.232,4.786c-0.578,1.677-1.416,3.134-2.514,4.375c-1.097,1.241-2.098,1.862-3.004,1.862c-0.427,0-1.009-0.143-1.748-0.423l-0.354-0.138c-0.725-0.281-1.363-0.423-1.92-0.423c-0.525,0-1.1,0.11-1.725,0.331l-0.445,0.16l-0.56,0.229c-0.441,0.176-0.888,0.264-1.337,0.264c-1.059,0-2.228-0.872-3.507-2.616c-1.843-2.498-2.764-5.221-2.764-8.167c0-2.095,0.574-3.781,1.725-5.061c1.149-1.279,2.673-1.92,4.568-1.92c0.709,0,1.371,0.13,1.988,0.389l0.423,0.172l0.445,0.183c0.396,0.167,0.716,0.251,0.959,0.251c0.312,0,0.659-0.072,1.04-0.217l0.582-0.229l0.435-0.16c0.693-0.251,1.459-0.377,2.297-0.377C21.512,8.576,23.109,9.334,24.32,10.85zM19.615,3.287c0.021,0.267,0.033,0.473,0.033,0.617c0,1.317-0.479,2.473-1.438,3.467s-2.075,1.49-3.347,1.49c-0.038-0.297-0.058-0.51-0.058-0.639c0-1.12,0.445-2.171,1.337-3.153c0.891-0.982,1.922-1.558,3.096-1.725C19.32,3.329,19.447,3.311,19.615,3.287z",
                    glasses: "M14.075,9.531c0,0-2.705-1.438-5.158-1.438c-2.453,0-4.862,0.593-4.862,0.593L3.971,9.869c0,0,0.19,0.19,0.528,0.53c0.338,0.336,0.486,3.741,1.838,5.094c1.353,1.354,4.82,1.396,5.963,0.676c1.14-0.718,2.241-3.466,2.241-4.693c0-0.38,0-0.676,0-0.676c0.274-0.275,1.615-0.303,1.917,0c0,0,0,0.296,0,0.676c0,1.227,1.101,3.975,2.241,4.693c1.144,0.72,4.611,0.678,5.963-0.676c1.355-1.353,1.501-4.757,1.839-5.094c0.338-0.34,0.528-0.53,0.528-0.53l-0.084-1.183c0,0-2.408-0.593-4.862-0.593c-2.453,0-5.158,1.438-5.158,1.438C16.319,9.292,14.737,9.32,14.075,9.531z"
                };
                var groupLogo = {
                    accountHolder: logos.accountHolder,
                    ssn: logos.securityNumber,
                    address: logos.home
                }

                var width = 960,
                    height = 250;

                var svg = document.querySelector('svg');
                if(svg){

                    svg.parentNode.removeChild(svg);
                }

                var color = d3.scale.category20();

                var force = d3.layout.force()
                    .charge(-120)
                    .linkDistance(100)
                    .size([width, height]);

                var svg = d3.select("#viz").append("svg")
                    .attr("width", width)
                    .attr("height", height);

                d3.json("/miserables.json", function(error, graph) {
                    force
                        .nodes(graph.nodes)
                        .links(graph.links)
                        .start();

                    var link = svg.selectAll(".link")
                        .data(graph.links)
                        .enter().append("line")
                        .attr("class", "link")
                        .style("stroke-width", function(d) { return Math.sqrt(d.value); });

                    var node = svg.selectAll(".node")
                        .data(graph.nodes)
                        .enter().append("g")
                        .on("mouseover", mouseover)
                        .on("mouseout", mouseout)
                        .attr("class", "node")
                        .call(force.drag);

                    node.append("path")
                        .attr("d", function(d) {
                            if (d.group in groupLogo) return groupLogo[d.group];
                            return logos.glasses;
                        })
                        .attr("transform", "scale(1.5)")
                        .style("fill", function(d) { return color(d.group); });

                    node.append("title")
                        .text(function(d) { return d.name; });

                    force.on("tick", function() {
                        link.attr("x1", function(d) { return d.source.x; })
                            .attr("y1", function(d) { return d.source.y; })
                            .attr("x2", function(d) { return d.target.x; })
                            .attr("y2", function(d) { return d.target.y; });

                        node.attr("transform", function(d) { return "translate(" + (d.x-12) + "," + (d.y-12) + ")"; });
                    });
                    function mouseover(d) {


                    }

                    function mouseout() {

                    }
                });

            }
        },
        beforeMount(){
            this.NeoConnect();
            this.getSSN();
        },
    }
</script>
<style lang="scss" scoped>
    .md-card {
        width: 320px;
        margin: 4px;
        display: inline-block;
        vertical-align: top;
    }
</style>
<style scoped>
    #viz{
        height: 350px;
        border: 1px solid lightgray;
        font: 22pt arial;
    }
    #container{
    }
    #title{
  text-align: center;
    }
    #content{
    }
    .list-ssn{
        padding: 10px;
    }
    .list-group{
        flex-direction: row;
        padding: 10px;
    }
    .list-group-item{
        margin-right: 10px;
    }
    .card-header{
        color: black;
    }
    .card-header:hover{
        color: white;
    }
</style>