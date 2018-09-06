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
        this.dialogPersistent = false;
    }

    loginGoogle(){
        var pathname = window.location.pathname;
        window.location.href = "/auth/google?redirectTo=" + pathname;
    }

    logout(){
        var pathname = window.location.pathname;
        window.location.href = "/auth/logout?redirectTo=" + pathname;
    }

    toggleDialog(){
        this.loginDialog = true;
        this.dialogPersistent= false;
    }

    toggleDialogWithPersistent(){
        this.loginDialog = true;
        this.dialogPersistent = true;
    }

    requireLogin(){
        if(this.user === null){
            this.toggleDialogWithPersistent();
        }
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
        this.init();

    }

    init (){

        // Overridden to define per-shape connection points
        mxGraph.prototype.getAllConnectionConstraints = function (terminal, source) {
            if (terminal != null && terminal.shape != null) {
                if (terminal.shape.stencil != null) {
                    if (terminal.shape.stencil != null) {
                        return terminal.shape.stencil.constraints;
                    }
                }
                else if (terminal.shape.constraints != null) {
                    return terminal.shape.constraints;
                }
            }

            return null;
        };

        // Defines the default constraints for all shapes
        mxShape.prototype.constraints = [new mxConnectionConstraint(new mxPoint(0.25, 0), true),
            new mxConnectionConstraint(new mxPoint(0.5, 0), true),
            new mxConnectionConstraint(new mxPoint(0.75, 0), true),
            new mxConnectionConstraint(new mxPoint(0, 0.25), true),
            new mxConnectionConstraint(new mxPoint(0, 0.5), true),
            new mxConnectionConstraint(new mxPoint(0, 0.75), true),
            new mxConnectionConstraint(new mxPoint(1, 0.25), true),
            new mxConnectionConstraint(new mxPoint(1, 0.5), true),
            new mxConnectionConstraint(new mxPoint(1, 0.75), true),
            new mxConnectionConstraint(new mxPoint(0.25, 1), true),
            new mxConnectionConstraint(new mxPoint(0.5, 1), true),
            new mxConnectionConstraint(new mxPoint(0.75, 1), true)];

        // Edges have no connection points
        mxPolyline.prototype.constraints = null;


        // ###############################

        (function () {
            // Enables rotation handle
            mxVertexHandler.prototype.rotationEnabled = true;

            // Enables managing of sizers
            mxVertexHandler.prototype.manageSizers = true;

            // Enables live preview
            mxVertexHandler.prototype.livePreview = true;

            // Sets constants for touch style
            mxConstants.HANDLE_SIZE = 16;
            mxConstants.LABEL_HANDLE_SIZE = 7;

            // Larger tolerance and grid for real touch devices
            if (mxClient.IS_TOUCH || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) {
                mxShape.prototype.svgStrokeTolerance = 18;
                mxVertexHandler.prototype.tolerance = 12;
                mxEdgeHandler.prototype.tolerance = 12;
                mxGraph.prototype.tolerance = 12;
            }

            // One finger pans (no rubberband selection) must start regardless of mouse button
            mxPanningHandler.prototype.isPanningTrigger = function (me) {
                var evt = me.getEvent();

                return (me.getState() == null && !mxEvent.isMouseEvent(evt)) ||
                    (mxEvent.isPopupTrigger(evt) && (me.getState() == null ||
                        mxEvent.isControlDown(evt) || mxEvent.isShiftDown(evt)));
            };

            // Don't clear selection if multiple cells selected
            var graphHandlerMouseDown = mxGraphHandler.prototype.mouseDown;
            mxGraphHandler.prototype.mouseDown = function (sender, me) {
                graphHandlerMouseDown.apply(this, arguments);

                if (this.graph.isCellSelected(me.getCell()) && this.graph.getSelectionCount() > 1) {
                    this.delayedSelection = false;
                }
            };

            // On connect the target is selected and we clone the cell of the preview edge for insert
            mxConnectionHandler.prototype.selectCells = function (edge, target) {
                if (target != null) {
                    this.graph.setSelectionCell(target);
                }
                else {
                    this.graph.setSelectionCell(edge);
                }
            };

            // Overrides double click handling to use the tolerance
            var graphDblClick = mxGraph.prototype.dblClick;
            mxGraph.prototype.dblClick = function (evt, cell) {
                if (cell == null) {
                    var pt = mxUtils.convertPoint(this.container,
                        mxEvent.getClientX(evt), mxEvent.getClientY(evt));
                    cell = this.getCellAt(pt.x, pt.y);
                }

                graphDblClick.call(this, evt, cell);
            };

            // Rounded edge and vertex handles
            var touchHandle = new mxImage('/resources/handle-main.png', 17, 17);
            mxVertexHandler.prototype.handleImage = touchHandle;
            mxEdgeHandler.prototype.handleImage = touchHandle;
            mxOutline.prototype.sizerImage = touchHandle;

            // Pre-fetches touch handle
            new Image().src = touchHandle.src;

            // Adds connect icon to selected vertex
            var connectorSrc = '/resources/handle-connect.png';

            var vertexHandlerInit = mxVertexHandler.prototype.init;
            mxVertexHandler.prototype.init = function () {
                // TODO: Use 4 sizers, move outside of shape
                //this.singleSizer = this.state.width < 30 && this.state.height < 30;
                vertexHandlerInit.apply(this, arguments);

                // Only show connector image on one cell and do not show on containers
                if (this.graph.connectionHandler.isEnabled() &&
                    this.graph.isCellConnectable(this.state.cell) &&
                    this.graph.getSelectionCount() == 1) {
                    this.connectorImg = mxUtils.createImage(connectorSrc);
                    this.connectorImg.style.cursor = 'pointer';
                    this.connectorImg.style.width = '29px';
                    this.connectorImg.style.height = '29px';
                    this.connectorImg.style.position = 'absolute';

                    if (!mxClient.IS_TOUCH) {
                        this.connectorImg.setAttribute('title', mxResources.get('connect'));
                        mxEvent.redirectMouseEvents(this.connectorImg, this.graph, this.state);
                    }

                    // Starts connecting on touch/mouse down
                    mxEvent.addGestureListeners(this.connectorImg,
                        mxUtils.bind(this, function (evt) {
                            this.graph.popupMenuHandler.hideMenu();
                            this.graph.stopEditing(false);

                            var pt = mxUtils.convertPoint(this.graph.container,
                                mxEvent.getClientX(evt), mxEvent.getClientY(evt));
                            this.graph.connectionHandler.start(this.state, pt.x, pt.y);
                            this.graph.isMouseDown = true;
                            this.graph.isMouseTrigger = mxEvent.isMouseEvent(evt);
                            mxEvent.consume(evt);
                        })
                    );

                    this.graph.container.appendChild(this.connectorImg);
                }

                this.redrawHandles();
            };

            var vertexHandlerHideSizers = mxVertexHandler.prototype.hideSizers;
            mxVertexHandler.prototype.hideSizers = function () {
                vertexHandlerHideSizers.apply(this, arguments);

                if (this.connectorImg != null) {
                    this.connectorImg.style.visibility = 'hidden';
                }
            };

            var vertexHandlerReset = mxVertexHandler.prototype.reset;
            mxVertexHandler.prototype.reset = function () {
                vertexHandlerReset.apply(this, arguments);

                if (this.connectorImg != null) {
                    this.connectorImg.style.visibility = '';
                }
            };

            var vertexHandlerRedrawHandles = mxVertexHandler.prototype.redrawHandles;
            mxVertexHandler.prototype.redrawHandles = function () {
                vertexHandlerRedrawHandles.apply(this);

                if (this.state != null && this.connectorImg != null) {
                    var pt = new mxPoint();
                    var s = this.state;

                    // Top right for single-sizer
                    if (mxVertexHandler.prototype.singleSizer) {
                        pt.x = s.x + s.width - this.connectorImg.offsetWidth / 2;
                        pt.y = s.y - this.connectorImg.offsetHeight / 2;
                    }
                    else {
                        pt.x = s.x + s.width + mxConstants.HANDLE_SIZE / 2 + 4 + this.connectorImg.offsetWidth / 2;
                        pt.y = s.y + s.height / 2;
                    }

                    var alpha = mxUtils.toRadians(mxUtils.getValue(s.style, mxConstants.STYLE_ROTATION, 0));

                    if (alpha != 0) {
                        var cos = Math.cos(alpha);
                        var sin = Math.sin(alpha);

                        var ct = new mxPoint(s.getCenterX(), s.getCenterY());
                        pt = mxUtils.getRotatedPoint(pt, cos, sin, ct);
                    }

                    this.connectorImg.style.left = (pt.x - this.connectorImg.offsetWidth / 2) + 'px';
                    this.connectorImg.style.top = (pt.y - this.connectorImg.offsetHeight / 2) + 'px';
                }
            };

            var vertexHandlerDestroy = mxVertexHandler.prototype.destroy;
            mxVertexHandler.prototype.destroy = function (sender, me) {
                vertexHandlerDestroy.apply(this, arguments);

                if (this.connectorImg != null) {
                    this.connectorImg.parentNode.removeChild(this.connectorImg);
                    this.connectorImg = null;
                }
            };

            // Pre-fetches touch connector
            new Image().src = connectorSrc;
        })();


        var gm = this;
        $( document ).ready( function () {
            gm.main();
        } );

    }

    main (){

        var container = document.getElementById(this.containerId);

        // Checks if the browser is supported
        if (!mxClient.isBrowserSupported()) {
            // Displays an error message if the browser is not supported.
            mxUtils.error('Browser is not supported!', 200, false);
        }
        else {
            // To detect if touch events are actually supported, the following condition is recommended:
            // mxClient.IS_TOUCH || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0

            // Disables built-in text selection and context menu while not editing text
            var textEditing = mxUtils.bind(this, function (evt) {
                return graph.isEditing();
            });

            container.onselectstart = textEditing;
            container.onmousedown = textEditing;

            if (mxClient.IS_IE && (typeof(document.documentMode) === 'undefined' || document.documentMode < 9)) {
                mxEvent.addListener(container, 'contextmenu', textEditing);
            }
            else {
                container.oncontextmenu = textEditing;
            }

            // Creates the graph inside the given container
            var graph = new mxGraph(container);
            graph.centerZoom = false;
            graph.setConnectable(true);
            graph.setPanning(true);

            // Changes the default style for edges "in-place"
            var style = graph.getStylesheet().getDefaultEdgeStyle();
            style[mxConstants.STYLE_ROUNDED] = true;
            style[mxConstants.STYLE_EDGE] = mxEdgeStyle.OrthConnector;

            // Creates rubberband selection
            var rubberband = new mxRubberband(graph);

            graph.popupMenuHandler.autoExpand = true;

            graph.popupMenuHandler.isSelectOnPopup = function (me) {
                return mxEvent.isMouseEvent(me.getEvent());
            };

            // Installs context menu
            graph.popupMenuHandler.factoryMethod = function (menu, cell, evt) {
                menu.addItem('Add node', null, function () {
                    console.log(menu, cell, evt);
                    var parent = graph.getDefaultParent();
                    graph.getModel().beginUpdate();
                    try {
                        var v1 = graph.insertVertex(parent, null, 'New node', evt.layerX, evt.layerY, 80, 30);
                    }
                    finally {
                        // Updates the display
                        graph.getModel().endUpdate();
                    }
                });

                if(cell !== null){
                    menu.addSeparator();

                    menu.addItem("Delete", null, function () {
                        // cell.removeFromParent();
                        console.log("Delete", cell);
                    });

                    // var submenu1 = menu.addItem('Submenu 1', null, null);
                    //
                    // menu.addItem('Subitem 1', null, function () {
                    //     alert('Subitem 1');
                    // }, submenu1);
                    // menu.addItem('Subitem 1', null, function () {
                    //     alert('Subitem 2');
                    // }, submenu1);
                }
            };

            // Context menu trigger implementation depending on current selection state
            // combined with support for normal popup trigger.
            var cellSelected = false;
            var selectionEmpty = false;
            var menuShowing = false;

            graph.fireMouseEvent = function (evtName, me, sender) {
                if (evtName == mxEvent.MOUSE_DOWN) {
                    // For hit detection on edges
                    me = this.updateMouseEvent(me);

                    cellSelected = this.isCellSelected(me.getCell());
                    selectionEmpty = this.isSelectionEmpty();
                    menuShowing = graph.popupMenuHandler.isMenuShowing();
                }

                mxGraph.prototype.fireMouseEvent.apply(this, arguments);
            };

            // Shows popup menu if cell was selected or selection was empty and background was clicked
            graph.popupMenuHandler.mouseUp = function (sender, me) {
                this.popupTrigger = !graph.isEditing() && (this.popupTrigger || (!menuShowing &&
                    !graph.isEditing() && !mxEvent.isMouseEvent(me.getEvent()) &&
                    ((selectionEmpty && me.getCell() == null && graph.isSelectionEmpty()) ||
                        (cellSelected && graph.isCellSelected(me.getCell())))));
                mxPopupMenuHandler.prototype.mouseUp.apply(this, arguments);
            };

            // Tap and hold on background starts rubberband for multiple selected
            // cells the cell associated with the event is deselected
            graph.addListener(mxEvent.TAP_AND_HOLD, function (sender, evt) {
                if (!mxEvent.isMultiTouchEvent(evt)) {
                    var me = evt.getProperty('event');
                    var cell = evt.getProperty('cell');

                    if (cell == null) {
                        var pt = mxUtils.convertPoint(this.container,
                            mxEvent.getClientX(me), mxEvent.getClientY(me));
                        rubberband.start(pt.x, pt.y);
                    }
                    else if (graph.getSelectionCount() > 1 && graph.isCellSelected(cell)) {
                        graph.removeSelectionCell(cell);
                    }

                    // Blocks further processing of the event
                    evt.consume();
                }
            });

            // Adds mouse wheel handling for zoom
            // mxEvent.addMouseWheelListener(function (evt, up) {
            //     if (up) {
            //         graph.zoomIn();
            //     }
            //     else {
            //         graph.zoomOut();
            //     }
            //
            //     mxEvent.consume(evt);
            // });

            // Gets the default parent for inserting new cells. This
            // is normally the first child of the root (ie. layer 0).
            var parent = graph.getDefaultParent();

            // Adds cells to the model in a single step
            graph.getModel().beginUpdate();
            try {
                var v1 = graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30);
                var v2 = graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30);
                var e1 = graph.insertEdge(parent, null, '', v1, v2);
            }
            finally {
                // Updates the display
                graph.getModel().endUpdate();
            }

            // Disables new connections via "hotspot"
            graph.connectionHandler.marker.isEnabled = function () {
                return this.graph.connectionHandler.first != null;
            };

            // Adds custom hit detection if native hit detection found no cell
            graph.updateMouseEvent = function (me) {
                var me = mxGraph.prototype.updateMouseEvent.apply(this, arguments);

                if (me.getState() == null) {
                    var cell = this.getCellAt(me.graphX, me.graphY);

                    if (cell != null && this.isSwimlane(cell) && this.hitsSwimlaneContent(cell, me.graphX, me.graphY)) {
                        cell = null;
                    }
                    else {
                        me.state = this.view.getState(cell);

                        if (me.state != null && me.state.shape != null) {
                            this.container.style.cursor = me.state.shape.node.style.cursor;
                        }
                    }
                }

                if (me.getState() == null) {
                    this.container.style.cursor = 'default';
                }

                return me;
            };
        }




    }
}