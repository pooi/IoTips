class Supporter {
    constructor(vue) {
        this.vue = vue;
        this.data = {
            isShowBackBtn: false
        }
        this.drawer = false;
        this.menus = [
            {
                "icon": "home",
                "title": "Home",
                "href": "/"
            },
            {
                "icon": "edit",
                "title": "New",
                "href": "/board/regist"
            },
            {
                "icon": "list",
                "title": "Board",
                "href": "/board"
            }
        ];
        this.rules = {
            required: value => !!value || 'Required.',
            counter: value => value.length <= 20 || 'Max 20 characters',
            email: value => {
                var pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                return pattern.test(value) || 'Invalid e-mail.'
            },
            url: value => {
                var pattern =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
                return pattern.test(value) || "Please enter a valid URL."
            }
        }
    }

    isWebkit(){
        try{
            webkit.messageHandlers.checkWebkit.postMessage("");
            return true;
        }catch (e){
            return false;
        }
    }

    goBack () {
        window.history.back();
    }

    isHaveHistory(){
        return window.history.length > 0
    }

    getToday() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var today = yyyy + "-" + mm + "-" + dd; //dd + '/' + mm + '/' + yyyy;
        return today;
    }

    static getToday() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var today = yyyy + "-" + mm + "-" + dd; //dd + '/' + mm + '/' + yyyy;
        return today;
    }

    getTodayMs () {
        var d = new Date();
        return d.getTime();
    }

    static getTodayMs () {
        var d = new Date();
        return d.getTime();
    }

    dateToMs (date) {
        var temp = date.split('-');
        var year = parseInt(temp[0]);
        var month = parseInt(temp[1]);
        var day = parseInt(temp[2]);
        var k = Date.parse(date);
        return k;
    }

    static dateToMs (date) {
        var temp = date.split('-');
        var year = parseInt(temp[0]);
        var month = parseInt(temp[1]);
        var day = parseInt(temp[2]);
        var k = Date.parse(date);
        return k;
    }

    msToDate (ms) {
        var date = new Date(ms);
        var dd = date.getDate();
        var mm = date.getMonth() + 1; //January is 0!

        var yyyy = date.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var dateString = yyyy + "-" + mm + "-" + dd;
        return dateString;
    }

    static msToDate (ms) {
        var date = new Date(ms);
        var dd = date.getDate();
        var mm = date.getMonth() + 1; //January is 0!

        var yyyy = date.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var dateString = yyyy + "-" + mm + "-" + dd;
        return dateString;
    }

    msToDateKo (ms) {
        var date = new Date(ms);
        var dd = date.getDate();
        var mm = date.getMonth() + 1; //January is 0!

        var yyyy = date.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var dateString = yyyy + "년 " + mm + "월 " + dd + "일";
        return dateString;
    }

    static msToDateKo (ms) {
        var date = new Date(ms);
        var dd = date.getDate();
        var mm = date.getMonth() + 1; //January is 0!

        var yyyy = date.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var dateString = yyyy + "년 " + mm + "월 " + dd + "일";
        return dateString;
    }

    msToTime (ms) {
        var date = new Date(ms);
        var hh = date.getHours();
        var mm = date.getMinutes();


        var timeString = (hh%12) + ":" + (mm < 10 ? "0" + mm : mm);
        if(hh > 12){
            timeString += " PM";
        }else{
            timeString += " AM";
        }
        return timeString;
    }

    static msToTime (ms) {
        var date = new Date(ms);
        var hh = date.getHours();
        var mm = date.getMinutes();


        var timeString = (hh%12) + ":" + (mm < 10 ? "0" + mm : mm);
        if(hh > 12){
            timeString += " PM";
        }else{
            timeString += " AM";
        }
        return timeString;
    }

    reduceString (str, len) {
        var newStr = str.substring(0, len);
        if(str.length > 100){
            newStr += "...";
        }
        return newStr;
    }

    static reduceString (str, len) {
        var newStr = str.substring(0, len);
        if(str.length > 100){
            newStr += "...";
        }
        return newStr;
    }

    reloadPage () {
        location.reload();
    }

    splitArray (array) {
        var chunk = 1;
        var breakpoint = this.vue.__proto__.$vuetify.breakpoint;
        if(breakpoint.xs || breakpoint.xl)
            chunk = 1;
        else if(breakpoint.sm)
            chunk = 2;
        else if(breakpoint.md)
            chunk = 3;
        else
            chunk = 4;
        // console.log(this.__proto__.$vuetify.breakpoint);
        // console.log("chunk", chunk);

        var i,j,temparray;
        var newArray = [];
        for (i=0,j=array.length; i<j; i+=chunk) {
            temparray = array.slice(i,i+chunk);

            while(temparray.length < chunk){
                temparray.push(null);
            }

            newArray.push(temparray);
        }
        // console.log(newArray);
        return newArray;
    }
}

class Auth {
    constructor() {
        // this.vue = vue;
        this.user = {

        }
        this.loginDialog = false;
        this.detailDialog = false;
    }

    loginGoogle(){
        var pathname = window.location.pathname;
        window.location.href = "/auth/google?redirectTo=" + pathname;
    }

    logout(){
        var pathname = window.location.pathname;
        window.location.href = "/auth/logout?redirectTo=" + pathname;
    }

    parseUserData(init_user){
        console.log(init_user);
        this.user = JSON.parse(init_user);
        console.log(this.user);
    }

}

class GraphManager {
    constructor(id){
        this.containerId = id;
        // this.graphData = {
        //     "nodeKeyProperty": "id",
        //     "nodeDataArray": [
        //         {"id": 0, "loc": "120 120", "text": "Initial"},
        //         {"id": 1, "loc": "330 120", "text": "First down"},
        //         {"id": 2, "loc": "226 376", "text": "First up"},
        //         {"id": 3, "loc": "60 276", "text": "Second down"},
        //         {"id": 4, "loc": "226 226", "text": "Wait"}
        //     ],
        //     "linkDataArray": [
        //         {"from": 0, "to": 0, "text": "up or timer", "curviness": -20},
        //         {"from": 0, "to": 1, "text": "down", "curviness": 20},
        //         {"from": 1, "to": 0, "text": "up (moved)\nPOST", "curviness": 20},
        //         {"from": 1, "to": 1, "text": "down", "curviness": -20},
        //         {"from": 1, "to": 2, "text": "up (no move)"},
        //         {"from": 1, "to": 4, "text": "timer"},
        //         {"from": 2, "to": 0, "text": "timer\nPOST"},
        //         {"from": 2, "to": 3, "text": "down"},
        //         {"from": 3, "to": 0, "text": "up\nPOST\n(dblclick\nif no move)"},
        //         {"from": 3, "to": 3, "text": "down or timer", "curviness": 20},
        //         {"from": 4, "to": 0, "text": "up\nPOST"},
        //         {"from": 4, "to": 4, "text": "down"}
        //     ]
        // };
        this.graphData = {
            "class": "go.GraphLinksModel",
            "nodeKeyProperty": "id",
            "nodeDataArray": [
                {"text": "new node", "id": -1, "loc": "-212.5 26"},
                {"text": "new node", "id": -2, "loc": "42.5 26"}
            ],
            "linkDataArray": [{
                "from": -1,
                "to": -2,
                "points": [-122.030408555755, 38.272085894817025, -67.03776718550174, 29.483419300815086, -12.268883592750868, 29.483419300815086, 42.72375777750235, 38.27208589481702]
            }]
        };
        this.myDiagram = null;
    }

    init (){
        var gm = this;
        var $ = go.GraphObject.make;  // for conciseness in defining templates
        gm.myDiagram =
            $(go.Diagram, this.containerId,  // must name or refer to the DIV HTML element
                {
                    // start everything in the middle of the viewport
                    initialContentAlignment: go.Spot.Center,
                    // have mouse wheel events zoom in and out instead of scroll up and down
                    "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
                    // support double-click in background creating a new node
                    "clickCreatingTool.archetypeNodeData": {text: "new node"},
                    // enable undo & redo
                    "undoManager.isEnabled": true
                });
        // when the document is modified, add a "*" to the title and enable the "Save" button
        // gm.myDiagram.addDiagramListener("Modified", function (e) {
        //     console.log("Modified");
        //     // var button = document.getElementById("SaveButton");
        //     // if (button) button.disabled = !gm.myDiagram.isModified;
        //     // var idx = document.title.indexOf("*");
        //     // if (gm.myDiagram.isModified) {
        //     //     if (idx < 0) document.title += "*";
        //     // } else {
        //     //     if (idx >= 0) document.title = document.title.substr(0, idx);
        //     // }
        // });
        // define the Node template
        gm.myDiagram.nodeTemplate =
            $(go.Node, "Auto",
                new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                // define the node's outer shape, which will surround the TextBlock
                $(go.Shape, "RoundedRectangle",
                    {
                        parameter1: 20,  // the corner has a large radius
                        fill: $(go.Brush, "Linear", {0: "rgb(254, 201, 0)", 1: "rgb(254, 162, 0)"}),
                        stroke: null,
                        portId: "",  // this Shape is the Node's port, not the whole Node
                        fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
                        toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true,
                        cursor: "pointer"
                    }),
                $(go.TextBlock,
                    {
                        font: "bold 11pt helvetica, bold arial, sans-serif",
                        editable: true  // editing the text automatically updates the model data
                    },
                    new go.Binding("text").makeTwoWay())
            );
        // unlike the normal selection Adornment, this one includes a Button
        gm.myDiagram.nodeTemplate.selectionAdornmentTemplate =
            $(go.Adornment, "Spot",
                $(go.Panel, "Auto",
                    $(go.Shape, {fill: null, stroke: "blue", strokeWidth: 2}),
                    $(go.Placeholder)  // a Placeholder sizes itself to the selected Node
                ),
                // the button to create a "next" node, at the top-right corner
                $("Button",
                    {
                        alignment: go.Spot.TopRight,
                        click: addNodeAndLink  // this function is defined below
                    },
                    $(go.Shape, "PlusLine", {width: 6, height: 6})
                ) // end button
            ); // end Adornment
        // clicking the button inserts a new node to the right of the selected node,
        // and adds a link to that new node
        function addNodeAndLink(e, obj) {
            var adornment = obj.part;
            var diagram = e.diagram;
            diagram.startTransaction("Add State");
            // get the node data for which the user clicked the button
            var fromNode = adornment.adornedPart;
            var fromData = fromNode.data;
            // create a new "State" data object, positioned off to the right of the adorned Node
            var toData = {text: "new"};
            var p = fromNode.location.copy();
            p.x += 200;
            toData.loc = go.Point.stringify(p);  // the "loc" property is a string, not a Point object
            // add the new node data to the model
            var model = diagram.model;
            model.addNodeData(toData);
            // create a link data from the old node data to the new node data
            var linkdata = {
                from: model.getKeyForNodeData(fromData),  // or just: fromData.id
                to: model.getKeyForNodeData(toData),
                text: "transition"
            };
            // and add the link data to the model
            model.addLinkData(linkdata);
            // select the new Node
            var newnode = diagram.findNodeForData(toData);
            diagram.select(newnode);
            diagram.commitTransaction("Add State");
            // if the new node is off-screen, scroll the diagram to show the new node
            diagram.scrollToRect(newnode.actualBounds);
        }

        // replace the default Link template in the linkTemplateMap
        gm.myDiagram.linkTemplate =
            $(go.Link,  // the whole link panel
                {
                    curve: go.Link.Bezier, adjusting: go.Link.Stretch,
                    reshapable: true, relinkableFrom: true, relinkableTo: true,
                    toShortLength: 3
                },
                new go.Binding("points").makeTwoWay(),
                new go.Binding("curviness"),
                $(go.Shape,  // the link shape
                    {strokeWidth: 1.5}),
                $(go.Shape,  // the arrowhead
                    {toArrow: "standard", stroke: null}),
                $(go.Panel, "Auto",
                    $(go.Shape,  // the label background, which becomes transparent around the edges
                        {
                            fill: $(go.Brush, "Radial",
                                {0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)"}),
                            stroke: null
                        }),
                    $(go.TextBlock, "transition",  // the label text
                        {
                            textAlign: "center",
                            font: "9pt helvetica, arial, sans-serif",
                            margin: 4,
                            editable: true  // enable in-place editing
                        },
                        // editing the text automatically updates the model data
                        new go.Binding("text").makeTwoWay())
                )
            );
        // read in the JSON data from the "mySavedModel" element
        this.load();

        gm.myDiagram.addChangedListener(function (e) {
            // console.log("changed", e);
            gm.save();
        });
    }

    load(){
        this.myDiagram.model = go.Model.fromJson(this.graphData);
    }

    save(){
        this.graphData = this.myDiagram.model.toJson();
    }
}