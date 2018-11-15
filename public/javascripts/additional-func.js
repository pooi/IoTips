
const CURRENCIES = [{'symbol': '₩', 'code': '410', 'sign': '남한 원', 'currency': 'KRW'}, {'symbol': '$', 'code': '840', 'sign': 'US 달러', 'currency': 'USD'}, {'symbol': '€', 'code': '978', 'sign': '유로', 'currency': 'EUR'}, {'symbol': '¥', 'code': '156', 'sign': '위안', 'currency': 'CNY'}, {'symbol': "¥", 'code': '392', 'sign': '옌', 'currency': 'JPY'}];

class Platform{
    constructor() {
        this.id = Supporter.getTodayMs() + Supporter.makeid(20);

        this.title = null;
        this.company = null;
        this.url = null;
        this.description = null;
        this.img = null;

        this.isFree = true;
        this.price = null;
        this.currencies = CURRENCIES;
        this.currency = this.currencies[0];

        this.parsingProgress = false;
        this.parsingComplete = false;
        this.imgs = [];

        this.selectedProducts = [];
    }

    isProductInclude(product){
        return this.selectedProducts.includes(product);
    }

    addProduct(product){
        if(!this.selectedProducts.includes(product)){
            this.selectedProducts.push(product);
        }
    }

    selectProduct(product){
        if(!this.selectedProducts.includes(product)){
            this.selectedProducts.push(product);
        }else{
            var index = this.selectedProducts.indexOf(product);
            this.selectedProducts.splice(index, 1);
        }
    }

    deleteProduct(product){
        var index = this.selectedProducts.indexOf(product);
        if(index >= 0){
            this.selectedProducts.splice(index, 1);
        }
    }

    toDic(){
        return {
            id: this.id,
            title: this.title,
            company: this.company,
            urls: [this.url],
            description: this.description,
            image: this.img,
            price: this.isFree ? 0 : this.price,
            currency: this.isFree ? undefined : this.currency.currency,

        };
    }

    fromDic(data){
        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.company = data.company;
        this.price = data.price;
        this.isFree = (data.price === 0);
        this.img = data.image;
        this.url = JSON.parse(data.urls)[0];
        for(var i=0; i<this.currencies.length; i++){
            if(this.currencies[i].currency === data.currency){
                this.currency = this.currencies[i];
                break;
            }
        }
    }

}

class Product {
    constructor() {
        this.id = Supporter.getTodayMs() + Supporter.makeid(20);

        this.title = null;
        this.company = null;
        this.url = null;
        this.description = null;
        this.img = null;

        this.isFree = false;
        this.price = null;
        this.currencies = CURRENCIES;
        this.currency = this.currencies[0];

        this.parsingProgress = false;
        this.parsingComplete = false;
        this.imgs = [];

        this.selectedPlatform = [];
        this.capabilities = [];
    }

    isPlatformInclude(platform){
        return this.selectedPlatform.includes(platform);
    }

    selectPlatform(platform){
        if(!this.selectedPlatform.includes(platform)){
            this.selectedPlatform.push(platform);
        }else{
            var index = this.selectedPlatform.indexOf(platform);
            this.selectedPlatform.splice(index, 1);
        }
    }

    saveSelectedPlatform(){
        for(var i=0; i<this.selectedPlatform.length; i++){
            var platform = this.selectedPlatform[i];
            platform.addProduct(this);
        }
        this.selectedPlatform = [];
    }

    toDic(){
        var capabilityJSON = null;
        if(this.capabilities !== null && this.capabilities.length > 0){
            // var capabilities = [];
            // for(var i=0; i<this.capabilities.length; i++){
            //     var capability = this.capabilities[i];
            //     if(capability.check){
            //         capabilities.push(capability);
            //     }
            // }
            capabilityJSON = this.capabilities;
        }

        return {
            id: this.id,
            title: this.title,
            company: this.company,
            urls: [this.url],
            description: this.description,
            image: this.img,
            price: this.isFree ? 0 : this.price,
            currency: this.isFree ? undefined : this.currency.currency,
            capability: capabilityJSON === null ? undefined : capabilityJSON
        };
    }

    fromDic(data){
        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.company = data.company;
        this.price = data.price;
        this.isFree = (data.price === 0);
        this.img = data.image;
        this.url = JSON.parse(data.urls)[0];
        for(var i=0; i<this.currencies.length; i++){
            if(this.currencies[i].currency === data.currency){
                this.currency = this.currencies[i];
                break;
            }
        }
        this.capabilities = JSON.parse(data.capability);
    }
}

class UserInformation {
    constructor(){
        this.dialog = false;
        this.x = 0;
        this.y = 0;
        this.user = null;
    }

    showDialog(e, id){
        e.preventDefault();
        this.dialog = false;
        this.x = e.clientX;
        this.y = e.clientY;
        this.dialog = true;
        if(this.user != null){
            if(this.user.id !== id){
                this.user = null;
                this.getUserInformation(id);
            }
        }else{
            this.getUserInformation(id);
        }
    }

    getUserInformation(userID){
        var userInfo = this;
        var data = {
            userID: userID
        };

        axios.post(
            '/getUserInfo',
            data
        ).then(function (res) {
            var data = res.data;
            if(data){
                userInfo.user = data;
                userInfo.user.rgt_date = new Date(data.rgt_date);
                userInfo.user.last_login_date = new Date(data.last_login_date);
            }
        }).catch(function (error) {
            alert(error);
        });
    }

    setUserID(id){
        this.userID = id;
    }

    show (e) {
        e.preventDefault();
        this.dialog = false;
        this.x = e.clientX;
        this.y = e.clientY;
        this.dialog = true;
    }

    closeDialog(){
        this.dialog = false;
    }
}

class Supporter {
    constructor(vue) {
        this.vue = vue;
        this.data = {
            isShowBackBtn: false
        }
        this.drawer = false;
        this.menus = [
            {
                "title" : "Tips",
                "href" : "/",
                "submenu" : [
                    {
                        "title" : "구성도",
                        "href" : "/board/ecosystem"
                    },
                    {
                        "title" : "자유",
                        "href" : "/board/free"
                    },
                    {
                        "title" : "질문",
                        "href" : "/board/question"
                    },
                    {
                        "title" : "품평",
                        "href" : "/board/review"
                    }

                ]
            },
            {
                "title" : "Curation",
                "href" : "/",
                "submenu" : [
                    {
                        "title" : "구성",
                        "href" : "/curation"
                    },
                   {
                        "title" : "제품",
                        "href" : "/curation/product"
                    }

                ]
            },
            {
                "title" : "파트너",
                "href" : "/partners",
                "submenu" : []
            }
        ];
        // this.menus = [
        //     {
        //         "icon": "home",
        //         "title": "Home",
        //         "href": "/"
        //     },
        //     {
        //         "icon": "edit",
        //         "title": "New",
        //         "href": "/board/regist"
        //     },
        //     {
        //         "icon": "list",
        //         "title": "Board",
        //         "href": "/board"
        //     }
        // ];
        this.rules = {
            required: value => !!value || 'Required.',
            counter: value => value.length <= 20 || 'Max 20 characters',
            counter_2: value => {
                if(value === null){
                    return 'Please enter text'
                }else{
                    return value.length >= 2 || 'Min 2 characters'
                }
            },
            counter_10: value => {
                if(value === null){
                    return 'Please enter text'
                } else{
                    return value.length <= 10 || 'Max 10 characters'
                }
            },
            counter_20: value => {
                if(value === null){
                    return 'Please enter text'
                } else{
                    return value.length <= 20 || 'Max 20 characters'
                }
            },
            counter_40: value => {
                if(value === null){
                    return 'Please enter text'
                } else{
                    return value.length <= 40 || 'Max 40 characters'
                }
            },
            counter_200: value => {
                if(value === null){
                    return 'Please enter text'
                } else{
                    return value.length <= 200 || 'Max 200 characters'
                }
            },
            email: value => {
                var pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                return pattern.test(value) || 'Invalid e-mail.'
            },
            url: value => {
                var pattern =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
                return pattern.test(value) || "Please enter a valid URL."
            },
            price: value => {
                var pattern =  /^\d+(\.\d{1,2})?$/;
                return pattern.test(value) || "Please enter a valid price."
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

    getTempText(len){
        var str = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse pretium nisi sed quam sollicitudin vehicula. Suspendisse pretium ut ante non vehicula. Duis quis consectetur lectus, pellentesque tempus elit. Aliquam erat volutpat. Donec pellentesque eleifend nisi ac vulputate. Pellentesque ullamcorper a lorem eu rhoncus. Morbi pharetra, dolor non fermentum porttitor, metus ipsum finibus nisi, ut commodo nunc magna malesuada massa. Vestibulum auctor arcu id vestibulum sagittis. Praesent tortor nulla, volutpat eu porttitor quis, mattis eu dolor. Integer sollicitudin eros efficitur dui varius dignissim. Ut imperdiet nec urna vel sodales.";
        return str.substring(0, len);
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

    splitArrayBig (array) {
        var chunk = 1;
        var breakpoint = this.vue.__proto__.$vuetify.breakpoint;
        if(breakpoint.xs || breakpoint.xl)
            chunk = 1;
        else if(breakpoint.sm)
            chunk = 2;
        else if(breakpoint.md)
            chunk = 2;
        else
            chunk = 3;
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

    hashTagsToString (list, len) {

        var tags = "";
        for (var i = 0; i < Math.min(list.length, len); i++) {
            var tag = list[i];
            if (tag !== "") {
                tags += "#" + tag + " ";
            }
        }
        if (list.length > len)
            tags += "...";

        return tags;
    }

    static makeid(len) {
        if(len === null || len <= 0){
            len = 10;
        }
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < len; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    movePage(href){
        window.location.href = href;
    }

    static movePage(href){
        window.location.href = href;
    }

    isHomePage(){
        return window.location.pathname === "/";
    }

    static isHomePage(){
        return window.location.pathname === "/";
    }

    parseBoardDate(date){
        var today = new Date();
        var str = "";
        if(today.getFullYear() === date.getFullYear() && today.getDate() === date.getDate() && today.getMonth() === date.getMonth()){
            str = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
        }else{
            var month = date.getMonth()+1;
            var day = date.getDate();
            str = (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day);
        }
        return str;
    }

    static getBoardTypes() {
        var boardTypes = [
            {
                type: "free",
                title: "자유",
                fullTitle: "자유 게시판"
            },
            {
                type: "question",
                title: "질문",
                fullTitle: "질문 게시판"
            },
            {
                type: "review",
                title: "품평",
                fullTitle: "품평 게시판"
            },
            {
                type: "ecosystem",
                title: "구성도",
                fullTitle: "구성도 게시판"
            }
        ];
        return boardTypes;
    }

    getBoardTypes() {
        var boardTypes = [
            {
                type: "free",
                title: "자유",
                fullTitle: "자유 게시판"
            },
            {
                type: "question",
                title: "질문",
                fullTitle: "질문 게시판"
            },
            {
                type: "review",
                title: "품평",
                fullTitle: "품평 게시판"
            },
            {
                type: "ecosystem",
                title: "구성도",
                fullTitle: "구성도 게시판"
            }
        ];
        return boardTypes;
    }

    getBoardTitleFromType(type){
        var boardTypes = this.getBoardTypes();
        for(var i=0; i<boardTypes.length; i++){
            if(boardTypes[i].type === type){
                return boardTypes[i].title;
            }
        }
        return "";
    }

    convertTitle(title){
        var breakpoint = this.vue.__proto__.$vuetify.breakpoint;
        if(breakpoint.xs || breakpoint.xl){
            var stringByteLength = (function(s,b,i,c){
                for(b=i=0;c=s.charCodeAt(i++);b+=c>>11?3:c>>7?2:1);
                return b
            })(title);
            // console.log(stringByteLength);
            if(stringByteLength < 50){
                return title;
            }else{
                var newTitle = title.substring(0, 20) + "...";
                return newTitle;
            }
        }else{
            return title;
        }
    }

    parseImageName(title){
        return title.toLowerCase().replace(" ", "_");
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
        this.requireLoginDialog = false;
    }

    loginGoogle(){
        var pathname = window.location.pathname;
        var search = window.location.search;
        window.location.href = "/auth/google?redirectTo=" + pathname + search;
    }

    loginKakao(){
        var pathname = window.location.pathname;
        var search = window.location.search;
        window.location.href = "/auth/kakao?redirectTo=" + pathname + search;
    }

    loginNaver(){
        var pathname = window.location.pathname;
        var search = window.location.search;
        window.location.href = "/auth/naver?redirectTo=" + pathname + search;
    }

    logout(){
        var pathname = window.location.pathname;
        var search = window.location.search;
        window.location.href = "/auth/logout?redirectTo=" + pathname + search;
    }

    logoutToIndex(){
        var pathname = "/";
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

    toggleLoginRequire(){
        this.requireLoginDialog = true;
    }

    requireLogin(){
        if(this.user === null){
            this.toggleDialogWithPersistent();
        }
    }

    parseUserData(init_user){
        this.user = JSON.parse(init_user);
        if(this.user !==  null){
            this.user.rgt_date = new Date(this.user.rgt_date);
            this.user.last_login_date = new Date(this.user.last_login_date);
        }
        // console.log(this.user);
    }

}

class GraphManager {
    constructor(id, setDefault){

        this.zoomLevel = 0;

        this.containerId = id;
        this.graph = null;
        this.container = null;

        this.addOffsetX = 30;
        this.addOffsetY = 30;

        this.setDefault = setDefault;


        this.init();

    }

    zoomIn(){
        // this.zoom = (this.zoom + 10) || 100;
        if(this.graph !== null){
            // console.log("zoom in");
            this.zoomLevel += 1;
            this.graph.zoomIn();
        }
    }

    zoomOut(){
        // this.zoom = (this.zoom - 10) || 0;
        if(this.graph !== null){
            // console.log("zoom out");
            this.zoomLevel -= 1;
            this.graph.zoomOut();
        }
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


        // XML
        function CustomData(value)
        {
            this.value = value;
        }

        var codec = new mxObjectCodec(new CustomData());

        codec.encode = function(enc, obj)
        {
            var node = enc.document.createElement('CustomData');
            mxUtils.setTextContent(node, JSON.stringify(obj));

            return node;
        };

        codec.decode = function(dec, node, into)
        {
            var obj = JSON.parse(mxUtils.getTextContent(node));
            obj.constructor = CustomData;

            return obj;
        };

        mxCodecRegistry.register(codec);




        if(this.setDefault) {
            var gm = this;
            $(document).ready(function () {
                gm.main();
            });
        }

    }

    main (){

        var gm = this;

        var container = document.getElementById(this.containerId);
        this.container = container;
        console.log(container);

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

            { // Style

                // Changes the default style for edges "in-place"
                var style = graph.getStylesheet().getDefaultEdgeStyle();
                style[mxConstants.STYLE_ROUNDED] = true;
                style[mxConstants.STYLE_EDGE] = mxEdgeStyle.OrthConnector;
            }


            { // Clipboard

                // Public helper method for shared clipboard.
                mxClipboard.cellsToString = function(cells)
                {
                    var codec = new mxCodec();
                    var model = new mxGraphModel();
                    var parent = model.getChildAt(model.getRoot(), 0);

                    for (var i = 0; i < cells.length; i++)
                    {
                        model.add(parent, cells[i]);
                    }

                    return mxUtils.getXml(codec.encode(model));
                };

                // Focused but invisible textarea during control or meta key events
                var textInput = document.createElement('textarea');
                mxUtils.setOpacity(textInput, 0);
                textInput.style.width = '1px';
                textInput.style.height = '1px';
                var restoreFocus = false;
                var gs = graph.gridSize;
                var lastPaste = null;
                var dx = 0;
                var dy = 0;

                // Workaround for no copy event in IE/FF if empty
                textInput.value = ' ';

                // Shows a textare when control/cmd is pressed to handle native clipboard actions
                mxEvent.addListener(document, 'keydown', function(evt)
                {
                    // No dialog visible
                    var source = mxEvent.getSource(evt);

                    if (graph.isEnabled() && !graph.isMouseDown && !graph.isEditing() && source.nodeName != 'INPUT')
                    {
                        if (evt.keyCode == 224 /* FF */ || (!mxClient.IS_MAC && evt.keyCode == 17 /* Control */) || (mxClient.IS_MAC && evt.keyCode == 91 /* Meta */))
                        {
                            // Cannot use parentNode for check in IE
                            if (!restoreFocus)
                            {
                                // Avoid autoscroll but allow handling of events
                                textInput.style.position = 'absolute';
                                textInput.style.left = (graph.container.scrollLeft + 10) + 'px';
                                textInput.style.top = (graph.container.scrollTop + 10) + 'px';
                                graph.container.appendChild(textInput);

                                restoreFocus = true;
                                textInput.focus();
                                textInput.select();
                            }
                        }
                    }
                });

                // Restores focus on graph container and removes text input from DOM
                mxEvent.addListener(document, 'keyup', function(evt)
                {
                    if (restoreFocus && (evt.keyCode == 224 /* FF */ || evt.keyCode == 17 /* Control */ ||
                            evt.keyCode == 91 /* Meta */))
                    {
                        restoreFocus = false;

                        if (!graph.isEditing())
                        {
                            graph.container.focus();
                        }

                        textInput.parentNode.removeChild(textInput);
                    }

                    if(!graph.isEditing() && evt.keyCode == 8){
                        if (graph.isEnabled() && !graph.isSelectionEmpty())
                        {
                            graph.removeCells();
                        }
                    }
                });

                // Inserts the XML for the given cells into the text input for copy
                var copyCells = function(graph, cells)
                {
                    if (cells.length > 0)
                    {
                        var clones = graph.cloneCells(cells);

                        // Checks for orphaned relative children and makes absolute
                        for (var i = 0; i < clones.length; i++)
                        {
                            var state = graph.view.getState(cells[i]);

                            if (state != null)
                            {
                                var geo = graph.getCellGeometry(clones[i]);

                                if (geo != null && geo.relative)
                                {
                                    geo.relative = false;
                                    geo.x = state.x / state.view.scale - state.view.translate.x;
                                    geo.y = state.y / state.view.scale - state.view.translate.y;
                                }
                            }
                        }

                        textInput.value = mxClipboard.cellsToString(clones);
                    }

                    textInput.select();
                    lastPaste = textInput.value;
                };

                // Handles copy event by putting XML for current selection into text input
                mxEvent.addListener(textInput, 'copy', mxUtils.bind(this, function(evt)
                {
                    if (graph.isEnabled() && !graph.isSelectionEmpty())
                    {
                        copyCells(graph, mxUtils.sortCells(graph.model.getTopmostCells(graph.getSelectionCells())));
                        dx = 0;
                        dy = 0;
                    }
                }));

                // Handles cut event by removing cells putting XML into text input
                mxEvent.addListener(textInput, 'cut', mxUtils.bind(this, function(evt)
                {
                    if (graph.isEnabled() && !graph.isSelectionEmpty())
                    {
                        copyCells(graph, graph.removeCells());
                        dx = -gs;
                        dy = -gs;
                    }
                }));

                // Merges XML into existing graph and layers
                var importXml = function(xml, dx, dy)
                {
                    dx = (dx != null) ? dx : 0;
                    dy = (dy != null) ? dy : 0;
                    var cells = []

                    try
                    {
                        var doc = mxUtils.parseXml(xml);
                        var node = doc.documentElement;

                        if (node != null)
                        {
                            var model = new mxGraphModel();
                            var codec = new mxCodec(node.ownerDocument);
                            codec.decode(node, model);

                            var childCount = model.getChildCount(model.getRoot());
                            var targetChildCount = graph.model.getChildCount(graph.model.getRoot());

                            // Merges existing layers and adds new layers
                            graph.model.beginUpdate();
                            try
                            {
                                for (var i = 0; i < childCount; i++)
                                {
                                    var parent = model.getChildAt(model.getRoot(), i);

                                    // Adds cells to existing layers if not locked
                                    if (targetChildCount > i)
                                    {
                                        // Inserts into active layer if only one layer is being pasted
                                        var target = (childCount == 1) ? graph.getDefaultParent() : graph.model.getChildAt(graph.model.getRoot(), i);

                                        if (!graph.isCellLocked(target))
                                        {
                                            var children = model.getChildren(parent);
                                            cells = cells.concat(graph.importCells(children, dx, dy, target));
                                        }
                                    }
                                    else
                                    {
                                        // Delta is non cascading, needs separate move for layers
                                        parent = graph.importCells([parent], 0, 0, graph.model.getRoot())[0];
                                        var children = graph.model.getChildren(parent);
                                        graph.moveCells(children, dx, dy);
                                        cells = cells.concat(children);
                                    }
                                }
                            }
                            finally
                            {
                                graph.model.endUpdate();
                            }
                        }
                    }
                    catch (e)
                    {
                        alert(e);
                        throw e;
                    }

                    return cells;
                };

                // Parses and inserts XML into graph
                var pasteText = function(text)
                {
                    var xml = mxUtils.trim(text);
                    var x = graph.container.scrollLeft / graph.view.scale - graph.view.translate.x;
                    var y = graph.container.scrollTop / graph.view.scale - graph.view.translate.y;

                    if (xml.length > 0)
                    {
                        if (lastPaste != xml)
                        {
                            lastPaste = xml;
                            dx = 0;
                            dy = 0;
                        }
                        else
                        {
                            dx += gs;
                            dy += gs;
                        }

                        // Standard paste via control-v
                        if (xml.substring(0, 14) == '<mxGraphModel>')
                        {
                            graph.setSelectionCells(importXml(xml, dx, dy));
                            graph.scrollCellToVisible(graph.getSelectionCell());
                        }
                    }
                };

                // Cross-browser function to fetch text from paste events
                var extractGraphModelFromEvent = function(evt)
                {
                    var data = null;

                    if (evt != null)
                    {
                        var provider = (evt.dataTransfer != null) ? evt.dataTransfer : evt.clipboardData;

                        if (provider != null)
                        {
                            if (document.documentMode == 10 || document.documentMode == 11)
                            {
                                data = provider.getData('Text');
                            }
                            else
                            {
                                data = (mxUtils.indexOf(provider.types, 'text/html') >= 0) ? provider.getData('text/html') : null;

                                if (mxUtils.indexOf(provider.types, 'text/plain' && (data == null || data.length == 0)))
                                {
                                    data = provider.getData('text/plain');
                                }
                            }
                        }
                    }

                    return data;
                };

                // Handles paste event by parsing and inserting XML
                mxEvent.addListener(textInput, 'paste', function(evt)
                {
                    // Clears existing contents before paste - should not be needed
                    // because all text is selected, but doesn't hurt since the
                    // actual pasting of the new text is delayed in all cases.
                    textInput.value = '';

                    if (graph.isEnabled())
                    {
                        var xml = extractGraphModelFromEvent(evt);

                        if (xml != null && xml.length > 0)
                        {
                            pasteText(xml);
                        }
                        else
                        {
                            // Timeout for new value to appear
                            window.setTimeout(mxUtils.bind(this, function()
                            {
                                pasteText(textInput.value);
                            }), 0);
                        }
                    }

                    textInput.select();
                });
            }


            if(this.setDefault) {

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
                        // var zl = gm.zoomLevel;
                        // gm.setZoomLevel(0);
                        var parent = graph.getDefaultParent();
                        graph.getModel().beginUpdate();
                        try {
                            var v1 = graph.insertVertex(parent, null, 'New node', evt.layerX, evt.layerY, 80, 30);
                        }
                        finally {
                            // Updates the display
                            // gm.setZoomLevel(zl);
                            graph.getModel().endUpdate();
                        }
                    });

                    menu.addItem('Add circle node', null, function () {
                        console.log(menu, cell, evt);
                        // var zl = gm.zoomLevel;
                        // gm.setZoomLevel(0);
                        var parent = graph.getDefaultParent();
                        graph.getModel().beginUpdate();
                        try {
                            var v1 = graph.insertVertex(parent, null, 'New node', evt.layerX, evt.layerY, 80, 40, 'shape=ellipse;perimeter=ellipsePerimeter');
                        }
                        finally {
                            // Updates the display
                            // gm.setZoomLevel(zl);
                            graph.getModel().endUpdate();
                        }
                    });

                    menu.addItem('Add rhombus node', null, function () {
                        console.log(menu, cell, evt);
                        // var zl = gm.zoomLevel;
                        // gm.setZoomLevel(0);
                        var parent = graph.getDefaultParent();
                        graph.getModel().beginUpdate();
                        try {
                            var v1 = graph.insertVertex(parent, null, 'New node', evt.layerX, evt.layerY, 100, 40, 'shape=rhombus;perimeter=rhombusPerimeter');
                        }
                        finally {
                            // Updates the display
                            // gm.setZoomLevel(zl);
                            graph.getModel().endUpdate();
                        }
                    });

                    var submenu1 = menu.addItem('More', null, null);
                    menu.addItem('Subitem 1', null, function () {
                        // alert('Subitem 1');
                    }, submenu1);
                    menu.addItem('Subitem 1', null, function () {
                        // alert('Subitem 2');
                    }, submenu1);


                    if (cell !== null) {
                        menu.addSeparator();

                        menu.addItem("Edit", null, function () {
                            // graph.removeCells([cell]);
                            if (graph.isEnabled() && !graph.isSelectionEmpty()) {
                                graph.startEditing();
                            }
                        });

                        menu.addItem("Delete", null, function () {
                            // graph.removeCells([cell]);
                            if (graph.isEnabled() && !graph.isSelectionEmpty()) {
                                graph.removeCells();
                            }
                        });

                        menu.addSeparator();

                        menu.addItem("Cut", null, function () {
                            // graph.removeCells([cell]);
                            if (graph.isEnabled() && !graph.isSelectionEmpty()) {

                            }
                        });

                        menu.addItem("Copy", null, function () {
                            // graph.removeCells([cell]);
                            if (graph.isEnabled() && !graph.isSelectionEmpty()) {

                            }
                        });


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

                        // console.log(me.getCell());
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


                // var parent = graph.getDefaultParent();
                //
                // // Adds cells to the model in a single step
                // graph.getModel().beginUpdate();
                // try {
                //     var v1 = graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30);
                //     var v2 = graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30);
                //     var e1 = graph.insertEdge(parent, null, '', v1, v2);
                // }
                // finally {
                //     // Updates the display
                //     graph.getModel().endUpdate();
                // }

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

            var style = [];
            style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_ELLIPSE;
            style[mxConstants.STYLE_STROKECOLOR] = '#e43535';
            style[mxConstants.STYLE_FILLCOLOR] = '#ed6e6e';
            style[mxConstants.STYLE_FONTCOLOR] = '#ffffff';
            graph.getStylesheet().putCellStyle('ellipse_red', style);

            this.graph = graph;


            if(this.setDefault){
                // this.makeFromXml('<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="2" value="Hello," vertex="1" parent="1"><mxGeometry x="20" y="20" width="80" height="30" as="geometry"/></mxCell><mxCell id="3" value="World!" vertex="1" parent="1"><mxGeometry x="200" y="150" width="80" height="30" as="geometry"/></mxCell><mxCell id="4" value="" edge="1" parent="1" source="2" target="3"><mxGeometry relative="1" as="geometry"/></mxCell></root></mxGraphModel>');
            }else{
                this.graph.setEnabled(false);
            }

        }

    }

    makeFromXml(xml){
        var graph = this.graph;


        var xmlDocument = mxUtils.parseXml(xml);
        if (xmlDocument.documentElement != null && xmlDocument.documentElement.nodeName == 'mxGraphModel'){

            var decoder = new mxCodec(xmlDocument);
            var node = xmlDocument.documentElement;

            decoder.decode(node, graph.getModel());

        }
    }

    setZoomLevel(zoomLevel){

        if(this.zoomLevel < zoomLevel){
            while(this.zoomLevel !== zoomLevel){
                this.zoomIn();
            }
        }else if(this.zoomLevel > zoomLevel){
            while(this.zoomLevel !== zoomLevel){
                this.zoomOut();
            }
        }

    }

    addNode(title, id){
        var graph = this.graph;
        var parent = graph.getDefaultParent();
        graph.getModel().beginUpdate();
        try {
            var v1 = graph.insertVertex(parent, id, title, this.addOffsetX, this.addOffsetY, title.length * 8, 30);

            this.addOffsetY += 20;
            if(this.addOffsetY > 300){
                this.addOffsetY = this.addOffsetY % 300 + 20;
                this.addOffsetX += 20;
            }
        }
        finally {
            // Updates the display
            graph.getModel().endUpdate();
        }
    }

    addCircleNode(title, id){
        var graph = this.graph;
        var parent = graph.getDefaultParent();
        graph.getModel().beginUpdate();
        try {
            // var v1 = graph.insertVertex(parent, this.addOffsetX + "_" + this.addOffsetY, title, this.addOffsetX, this.addOffsetY, title.length * 8, 40, 'shape=ellipse;perimeter=ellipsePerimeter;color=white');
            var v1 = graph.insertVertex(parent, id, title, this.addOffsetX, this.addOffsetY, title.length * 8, 40, 'ellipse_red');

            this.addOffsetY += 20;
            if(this.addOffsetY > 300){
                this.addOffsetY = this.addOffsetY % 300 + 20;
                this.addOffsetX += 20;
            }
        }
        finally {
            // Updates the display
            graph.getModel().endUpdate();
        }
    }

    toXML(){
        var graph = this.graph;
        var encoder = new mxCodec();
        var node = encoder.encode(graph.getModel());

        var xml = mxUtils.getXml(node);
        console.log(xml);
        // alert(xml);
        return xml;
        // mxUtils.popup(mxUtils.getXml(node), true);
    }


}