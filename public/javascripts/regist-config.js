

function init(init_user, BOARD_TYPE) {

    Vue.use(window.VueQuillEditor);

    var vue = new Vue({
        el: '#app',
        data: {
            title: 'IoT Shared Platform',
            scrollData: {
                fab: false,
                offsetTop: 0,
                scrollT: 0,
                delta: 200,
                isShowFabTop: true,
                transition: 'slide-y-reverse-transition',
                statusBar: true
            },
            statusColor: "#ffaf1d",
            bottomTab: "board",

            supporter: null,
            auth: new Auth(),
            graphManager: new GraphManager("graph", true),
            viewer: null,

            loadingProgress: false,
            originalProgress: {
                product: true,
                platform: true,
                capability: true,
                graph: true
            },

            boardType: null,
            boardTypes: Supporter.getBoardTypes(),

            editorTitle: null,

            editorOption: {
                // theme: 'bubble',
                placeholder: "Insert content here ...",
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'align': [] }],
                        [{ 'header': 1 }, { 'header': 2 }],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'script': 'sub' }, { 'script': 'super' }],
                        [{ 'indent': '-1' }, { 'indent': '+1' }],
                        [{ 'direction': 'rtl' }],
                        [{ 'size': ['small', false, 'large', 'huge'] }],
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        // [{ 'font': [] }],
                        ['blockquote', 'code-block', 'link'],
                        // ['clean'],
                        // ['link', 'image', 'video']
                    ],
                    // syntax: {
                    //     highlight: text => hljs.highlightAuto(text).value
                    // }
                }
            },

            content: null,
            tags: [],
            sugTags: ["1인가구", "3~4인가구", "IoT기기가 집 안에 많이 구축되어 있는 집", "노인", "노인이 있는 집", "단독 주택", "독거노인", "맞벌이 부부", "미세먼지", "반려동물", "반려동물이 있는 집", "사무실", "소규모 매장", "수험생", "아기가 있는 집", "아이가 있는 집", "남성", "여성", "워킹 맘", "워킹맘", "자취생", "조명", "직장인", "파티", "학원", "신혼집", "초보자"],

            CAPABILITY: null,
            capabilityLoading: false,
            addCapabilityDialog: false,
            // tempCapabilities: null,
            // totalCapabilities: null,
            capabilities: [
                {
                    title: "Button",
                    component: "switch"
                },
                {
                    title: "Button",
                    component: "switch"
                },
            ],
            detailCapabilityDialog: false,
            detailCapabilityDialogPos: {
                x: 0,
                y: 0
            },
            detailCapability: null,
            detailCapabilityProducts: [],

            platforms: [],
            addPlatformDialog: false,
            choosePlatformImageDialog: false,
            tempPlatform: null,
            detailPlatformDialog: false,
            detailPlatform: null,
            detailPlatformIndex: -1,

            products: [],
            addProductDialog: false,
            chooseProductImageDialog: false,
            tempProduct: null,
            detailProductDialog: false,
            detailProduct: null,
            detailProductIndex: -1,


            registSuccessDialog: false,
            registeredBoardID: null,


        },
        methods:{
            onScroll (e) {
                var scroll = window.pageYOffset || document.documentElement.scrollTop;

                this.scrollData.scrollT += (scroll-this.scrollData.offsetTop);
                this.scrollData.offsetTop = scroll;

                if(this.scrollData.scrollT > this.scrollData.delta){
                    this.scrollData.isShowFabTop = true;
                    // this.chatManager.hide();
                    this.scrollData.scrollT = 0;
                }else if (this.scrollData.scrollT < -this.scrollData.delta) {
                    this.scrollData.isShowFabTop = false;
                    // this.chatManager.show();
                    this.scrollData.scrollT = 0;
                }

                if(scroll === 0){
                    this.scrollData.isShowFabTop = false;
                    this.scrollData.scrollT = 0;
                    this.scrollData.offsetTop = 0;
                }

                if(!this.scrollData.statusBar && this.scrollData.offsetTop < 50){
                    this.scrollData.statusBar = !this.scrollData.statusBar;
                    // this.changeStatusBarColorOnNativeApp("orange");
                    // this.statusColor = this.supporter.getStatusLightOrange();
                }else if(this.scrollData.statusBar & this.scrollData.offsetTop >= 50){
                    this.scrollData.statusBar = !this.scrollData.statusBar;
                    // this.changeStatusBarColorOnNativeApp("white");
                    // this.statusColor = "#FFFFFF";
                }
            },
            changeStatusBarColorOnNativeApp(color){
                try {
                    console.log(color);
                    webkit.messageHandlers.changeStatusBarBGColor.postMessage(color);
                } catch (error) {

                }
                try{
                    window.Denl.changeStatusBarBGColor(color);
                }catch (e){

                }
            },
            goRecent: function () {
                var offset = 40;
                if(this.__proto__.$vuetify.breakpoint.smAndDown)
                    offset = -26;

                $('html, body').animate({
                    scrollTop: $('#recent').offset().top - offset
                }, 500);
            },
            goRegisteredBoard: function(){
                window.location.href = "/board/" + this.registeredBoardID;
            },

            onEditorBlur(editor) {
                console.log('editor blur!');//, editor)
            },
            onEditorFocus(editor) {
                console.log('editor focus!');//, editor)
            },
            onEditorReady(editor) {
                console.log('editor ready!');//, editor)
            },

            changeSelectedTags(tag) {
                if (this.tags.includes(tag) > 0) {
                    this.tags.splice(this.tags.indexOf(tag), 1);
                } else {
                    this.tags.push(tag);
                }
                // console.log(this.selectedSuggestTag);
            },

            calcTotalCapabilities: function(){
                // if(this.totalCapabilities !== null && this.totalCapabilities.length > 0){
                //     this.totalCapabilities = JSON.parse(JSON.stringify(this.CAPABILITY));
                //     for(var i=0; i<this.totalCapabilities.length; i++){
                //         this.totalCapabilities[i].check = false;
                //     }
                //     for(var i=0; i<this.products.length; i++){
                //         var product = this.products[i];
                //         if(product.capabilities !== null && product.capabilities.length > 0){
                //             for(var j=0; j<product.capabilities.length; j++){
                //                 if(product.capabilities.check){
                //                     this.totalCapabilities[i].check = true;
                //                 }
                //             }
                //         }
                //     }
                // }
                // var capabilities = null;
                // if(this.CAPABILITY !== null){
                //     capabilities = JSON.parse(JSON.stringify(this.CAPABILITY));
                //     for(var i=0; i<capabilities.length; i++){
                //         capabilities[i].check = false;
                //     }
                //     for(var i=0; i<this.products.length; i++){
                //         var product = this.products[i];
                //         if(product.capabilities !== null && product.capabilities.length > 0){
                //             for(var j=0; j<product.capabilities.length; j++){
                //                 if(product.capabilities[j].check){
                //                     capabilities[j].check = true;
                //                 }
                //             }
                //         }
                //     }
                // }
                // this.totalCapabilities = capabilities;
            },
            resetCapabilityForm: function () {
                if(this.CAPABILITY === null){
                    this.getCapabilityList()
                }else{
                    // this.tempCapabilities = [];
                    for(var i=0; i<this.CAPABILITY.length; i++){
                        this.CAPABILITY[i]['check'] = false;
                        // var data = this.CAPABILITY[i];
                        // data['check'] = false;
                        // this.tempCapabilities.push(data);
                    }
                }

                this.addCapabilityDialog = true;
                // this.capabilities.push({
                //     title: "Button",
                //     component: "switch"
                // })
            },
            addProductCapability: function () {
                // if(this.tempCapabilities !== null && this.tempCapabilities.length >0){
                //     for(var i=0; i<this.tempCapabilities.length; i++){
                //         var capability = this.tempCapabilities[i];
                //         if(capability.check){
                //             this.capabilities.push({
                //                 title: capability.capability,
                //                 component: "switch"
                //             })
                //         }
                //     }
                // }
                if(this.tempProduct !== null){
                    this.tempProduct.capabilities = JSON.parse(JSON.stringify( this.CAPABILITY ));
                }
                this.addCapabilityDialog = false;
                // this.tempCapabilities = null;

                // this.capabilities.push({
                //     title: "Button",
                //     component: "switch"
                // })
            },
            removeCapability: function (index) {
                if(index < this.capabilities.length){
                    this.capabilities.splice(index, 1);
                }
            },

            showDetailCapability: function(e, capability){
                if(!this.detailCapabilityDialog){
                    // console.log(e, capability);
                    if(this.detailCapability === null || this.detailCapability.id !== capability.id){
                        this.detailCapability = capability;
                    }
                    this.detailCapabilityDialogPos.x = e.clientX;
                    this.detailCapabilityDialogPos.y = e.clientY;
                    this.detailCapabilityDialog = true;

                    this.detailCapabilityProducts = [];
                    for(var i=0; i<this.products.length; i++){
                        var product = this.products[i];
                        if(product.capabilities !== null && product.capabilities.length > 0){
                            for(var j=0; j<product.capabilities.length; j++){
                                if(product.capabilities[j].id === capability.id && product.capabilities[j].check){
                                    this.detailCapabilityProducts.push(product);
                                    break;
                                }
                            }
                        }
                    }

                }else if(this.detailCapability === null || this.detailCapability.id !== capability.id){

                    this.detailCapabilityDialog = false;

                    setTimeout(function () {
                        vue.detailCapability = capability;
                        vue.detailCapabilityDialogPos.x = e.clientX;
                        vue.detailCapabilityDialogPos.y = e.clientY;
                        vue.detailCapabilityDialog = true;

                        vue.detailCapabilityProducts = [];
                        for(var i=0; i<vue.products.length; i++){
                            var product = vue.products[i];
                            if(product.capabilities !== null && product.capabilities.length > 0){
                                for(var j=0; j<product.capabilities.length; j++){
                                    if(product.capabilities[j].id === capability.id && product.capabilities[j].check){
                                        vue.detailCapabilityProducts.push(product);
                                        break;
                                    }
                                }
                            }
                        }
                    }, 300);

                }
            },


            addPlatform: function () {

                var form = this.$refs.platform_form;
                if(form.validate()){
                    this.platforms.push(this.tempPlatform);
                    if(this.tempPlatform.img !== null){
                        this.graphManager.addCircleNodeWithImage(this.tempPlatform.title, this.tempPlatform.id, this.tempPlatform.img);
                    }else{
                        this.graphManager.addCircleNode(this.tempPlatform.title, this.tempPlatform.id);
                    }

                    var parentID = this.tempPlatform.id;
                    var platform = this.tempPlatform;

                    setTimeout(function () {
                        var parentCell = null;
                        for(var i=0; i<platform.selectedProducts.length; i++){
                            for(var j=0; j<vue.graphManager.graph.getChildCells().length; j++){
                                var cell = vue.graphManager.graph.getChildCells()[j];
                                if(cell.id === parentID){
                                    parentCell = cell;
                                    break;
                                }
                            }
                            if(parentCell !== null){
                                break;
                            }
                        }

                        if(platform.selectedProducts !== null && platform.selectedProducts.length > 0){
                            for(var i=0; i<platform.selectedProducts.length; i++){
                                var productID = platform.selectedProducts[i].id;
                                for(var j=0; j<vue.graphManager.graph.getChildCells().length; j++){
                                    var cell = vue.graphManager.graph.getChildCells()[j];
                                    if(cell.id === productID){
                                        vue.graphManager.graph.insertEdge(vue.graphManager.graph.getDefaultParent(), parentID + j, '', parentCell, cell)
                                    }
                                }

                            }
                        }

                    }, 500);


                    this.addPlatformDialog = false;
                }

                // this.platforms.push({
                //     title: "Kasa Smart",
                //     company: "TP-LINK Research America",
                //     cost: "Free",
                //     logo: "/images/logo/tplink.png"
                // })
            },
            removePlatform: function (index) {
                for(var i=0; i<this.graphManager.graph.getChildCells().length; i++){
                    var cell = this.graphManager.graph.getChildCells()[i];
                    if(cell.id === this.platforms[index].id){
                        this.graphManager.graph.clearSelection();
                        this.graphManager.graph.addSelectionCell(cell);
                        this.graphManager.graph.removeCells();
                    }
                }

                if(index < this.platforms.length){
                    this.platforms.splice(index, 1);
                }
            },
            removePlatformFromDetail: function(){
                this.removePlatform(this.detailPlatformIndex);
                this.detailPlatform = null;
                this.detailPlatformIndex = -1;
                this.detailPlatformDialog= false;
            },
            addPlatformNodeFromDetail: function(){
                if(this.detailProductIndex < this.platforms.length){
                    var tempPlatform = this.platforms[this.detailPlatformIndex];
                    if(tempPlatform.img !== null){
                        this.graphManager.addCircleNodeWithImage(tempPlatform.title, tempPlatform.id, tempPlatform.img);
                    }else{
                        this.graphManager.addCircleNode(tempPlatform.title, tempPlatform.id);
                    }
                }
                this.detailPlatform = null;
                this.detailPlatformIndex = -1;
                this.detailPlatformDialog= false;
            },
            resetPlatformForm: function () {
                this.tempPlatform = new Platform();
                this.choosePlatformImageDialog = false;
                this.addPlatformDialog = true;
                this.$refs["platform_url"].reset();
            },
            choosePlatformImage: function (index) {
                this.tempPlatform.img = this.tempPlatform.imgs[index];
                this.choosePlatformImageDialog = false;
            },
            showDetailPlatform: function (item, index) {
                this.detailPlatform = item;
                this.detailPlatformIndex = index;

                setTimeout(function () {
                    if(vue.detailPlatform.img !== null){
                        vue.viewer = new Viewer(document.getElementById('detailPlatformImg'), {
                            inline: false,
                            viewed: function() {
                                viewer.zoomTo(1);
                            }
                        });
                    }
                }, 500);

                this.detailPlatformDialog = true;
            },

            addProduct: function () {

                var form = this.$refs.product_form;
                if(form.validate()){
                    this.tempProduct.saveSelectedPlatform();
                    this.products.push(this.tempProduct);
                    if(this.tempProduct.img !== null){
                        this.graphManager.addNodeWithImage(this.tempProduct.title, this.tempProduct.id, this.tempProduct.img);
                    }else{
                        this.graphManager.addNode(this.tempProduct.title, this.tempProduct.id);
                    }
                    this.addProductDialog = false;
                    // this.calcTotalCapabilities();
                }

            },
            removeProduct: function (index) {
                if(index < this.products.length){

                    for(var i=0; i<this.graphManager.graph.getChildCells().length; i++){
                        var cell = this.graphManager.graph.getChildCells()[i];
                        if(cell.id === this.products[index].id){
                            this.graphManager.graph.clearSelection();
                            this.graphManager.graph.addSelectionCell(cell);
                            this.graphManager.graph.removeCells();
                        }
                    }

                    for(var i=0; i<this.platforms.length; i++){
                        this.platforms[i].deleteProduct(this.products[index]);
                    }
                    this.products.splice(index, 1);
                    // this.calcTotalCapabilities();
                }
            },
            removeProductFromDetail: function(){
                this.removeProduct(this.detailProductIndex);
                this.detailProduct = null;
                this.detailProductIndex = -1;
                this.detailProductDialog= false;
            },
            addProductNodeFromDetail: function(){
                if(this.detailProductIndex < this.products.length){
                    var tempProduct = this.products[this.detailProductIndex];
                    if(tempProduct.img !== null) {
                        this.graphManager.addNodeWithImage(tempProduct.title, tempProduct.id, tempProduct.img)
                    }else{
                        this.graphManager.addNode(tempProduct.title, tempProduct.id);
                    }
                }
                this.detailProduct = null;
                this.detailProductIndex = -1;
                this.detailProductDialog= false;
            },
            resetProductForm: function () {
                this.tempProduct = new Product();
                this.chooseProductImageDialog = false;
                this.addProductDialog = true;
                this.$refs["product_url"].reset();
            },
            chooseProductImage: function (index) {
                this.tempProduct.img = this.tempProduct.imgs[index];
                this.chooseProductImageDialog = false;
            },
            showDetailProuct: function (item, index) {
                this.detailProduct = item;
                this.detailProductIndex = index;

                this.detailProduct.selectedPlatform = [];
                for(var i=0; i<this.platforms.length; i++){
                    if(this.platforms[i].isProductInclude(item)){
                        this.detailProduct.selectedPlatform.push(this.platforms[i]);
                    }
                }

                setTimeout(function () {
                    if(vue.detailProduct.img !== null){
                        vue.viewer = new Viewer(document.getElementById('detailProductImg'), {
                            inline: false,
                            viewed: function() {
                                viewer.zoomTo(1);
                            }
                        });
                    }
                }, 500);

                this.detailProductDialog = true;
            },

            getCapabilityList: function(){
                this.capabilityLoading = true;

                var data = {};
                axios.post(
                    '/getCapabilities',
                    data
                ).then(function (res) {
                    var data = res.data;
                    // console.log(data);

                    vue.CAPABILITY = data;
                    for(var i=0; i<vue.CAPABILITY.length; i++){
                        vue.CAPABILITY[i]['check'] = false;
                    }
                    vue.totalCapabilities = JSON.parse(JSON.stringify( vue.CAPABILITY ));
                    vue.capabilityLoading = false;
                    vue.originalProgress.capability = true;

                    // vue.tempCapabilities = [];
                    // for(var i=0; i<vue.CAPABILITY.length; i++){
                    //     var data = vue.CAPABILITY[i];
                    //     data['check'] = false;
                    //     vue.tempCapabilities.push(data);
                    // }

                }).catch(function (error) {
                    alert(error);
                });
            },

            parsingURL: function (type) {
                var urlField = null;
                var tempItem = null;
                if(type === "product"){
                    urlField = this.$refs["product_url"];
                    tempItem = this.tempProduct;
                }else if(type === "platform"){
                    urlField = this.$refs["platform_url"];
                    tempItem = this.tempPlatform;
                }


                if(urlField.valid){
                    tempItem.parsingProgress = true;
                    var data = {
                        url: tempItem.url
                    };

                    axios.post(
                        '/parseurl',
                        data
                    ).then(function (res) {
                        var data = res.data;
                        console.log(data);

                        tempItem.parsingProgress = false;
                        tempItem.parsingComplete = true;
                        tempItem.title = data.title;
                        tempItem.description = data.description;
                        tempItem.company = data.copyright;
                        tempItem.imgs = data.imgs;
                    }).catch(function (error) {
                        alert(error);
                    });

                }else{
                    urlField.validate(true);
                }

            },

            submit:function () {

                var form = this.$refs.main_form;
                if(form.validate()){
                    this.loadingProgress = true;
                    var content = {};
                    if(this.content != null){
                        content = html2json(this.content);
                    }

                    var data = {
                        title: this.editorTitle,
                        content: content,
                        type: this.boardType.type
                    };

                    if(this.graphManager.graph !== null && vue.graphManager.graph.getChildCells().length > 0){
                        data['graph'] = xml2json(this.graphManager.toXML());
                    }

                    if(this.products.length > 0){
                        var dic_products = [];
                        for(var i=0; i<this.products.length; i++){
                            dic_products.push(this.products[i].toDic());
                        }
                        data['products'] = dic_products;
                    }

                    if(this.platforms.length > 0){
                        var dic_platforms = [];
                        for(var i=0; i<this.platforms.length; i++){
                            dic_platforms.push(this.platforms[i].toDic());
                        }
                        data['platforms'] = dic_platforms;
                    }

                    if(this.tags.length > 0){
                        data['tags'] = this.tags;
                    }

                    var parent = (new URL(window.location.href)).searchParams.get("originalPost");
                    if(parent){
                        data['parent'] = parent;
                    }

                    axios.post(
                        '/board/regist',
                        data
                    ).then(function (res) {
                        var data = res.data;
                        console.log(data);

                        vue.loadingProgress = false;
                        if(data.isSuccess){
                            // alert("성공적으로 등록하였습니다.");
                            vue.registSuccessDialog = true;
                            vue.registeredBoardID = data.boardID;
                            // window.location.href = "/board/" + data.boardID;
                        }else{
                            alert("에러");
                        }


                    }).catch(function (error) {
                        vue.loadingProgress = false;
                        alert(error);
                    });
                }

            },

        },
        mounted:[
            function () {
                this.auth.parseUserData(init_user);
                this.auth.requireLogin();
            },
            function () {
                switch (BOARD_TYPE) {
                    case "free":
                        this.boardType = this.boardTypes[0];
                        break;
                    case "question":
                        this.boardType = this.boardTypes[1];
                        break;
                    case "review":
                        this.boardType = this.boardTypes[2];
                        break;
                    case "ecosystem":
                        this.boardType = this.boardTypes[3];
                        break;
                    case "my_ecosys":
                        this.boardType = this.boardTypes[4];
                        break;
                    default:
                        this.boardType = this.boardTypes[0];
                        break;
                }
            },
            function(){
                // var url_string = window.location.href;
                // var url = new URL(url_string);
                var originalPost = (new URL(window.location.href)).searchParams.get("originalPost");

                if(originalPost){
                    // console.log("originalPost");

                    for(var key in this.originalProgress){
                        this.originalProgress[key] = false;
                    }

                    var data = {
                        boardID: originalPost
                    };

                    axios.post(
                        '/board/getDetail',
                        data
                    ).then(function (res) {
                        var result = res.data.result;
                        console.log(result);

                        var platforms = res.data.platforms;
                        var products = res.data.products;

                        for(var i=0; i<platforms.length; i++){
                            var platform = new Platform();
                            platform.fromDicWithoutID(platforms[i]);
                            vue.platforms.push(platform);
                        }
                        vue.originalProgress.platform = true;

                        for(var i=0; i<products.length; i++){
                            var product = new Product();
                            product.fromDicWithoutID(products[i]);
                            vue.products.push(product);
                        }
                        vue.originalProgress.product = true;

                        if(products.length > 0){
                            vue.getCapabilityList();
                        }


                        if("graph" in result){
                            if(result.graph != null){
                                document.getElementById("graph").innerHTML = '';
                                vue.originalProgress.graph = true;
                                // vue.graphManager = new GraphManager("graph", true);
                                // var graph = JSON.parse(result.graph);
                                // console.log(json2xml(graph));
                                // vue.graphManager.makeFromXml(json2xml(graph));
                                setTimeout(function () {
                                    // vue.graphManager = new GraphManager("graph");
                                    // vue.graphManager.main();

                                    var newjsonGraph = result.graph;
                                    for(var i=0; i<vue.products.length; i++){
                                        var product = vue.products[i];
                                        if(product.originalID !== null){
                                            newjsonGraph = vue.supporter.replaceAll(newjsonGraph, product.originalID, product.id);
                                        }
                                    }
                                    for(var i=0; i<vue.platforms.length; i++){
                                        var platform = vue.platforms[i];
                                        if(platform.originalID !== null){
                                            newjsonGraph = vue.supporter.replaceAll(newjsonGraph, platform.originalID, platform.id);
                                        }
                                    }


                                    var graph = JSON.parse(newjsonGraph);
                                    vue.graphManager.makeFromXml(json2xml(graph));

                                    // console.log(vue.graphManager.graph.getChildCells());
                                    // for(var i=0; i<vue.graphManager.graph.getChildCells().length; i++){
                                    //     console.log(i);
                                    //     var cell = vue.graphManager.graph.getChildCells()[i];
                                    //     console.log(cell);
                                    //     var found = false;
                                    //     var cell_id = cell.id;
                                    //     for(var j=0; j<vue.products.length; j++){
                                    //         var product = vue.products[j];
                                    //         console.log(product);
                                    //         if(product.originalID !== null && product.originalID === cell_id){
                                    //             found = true;
                                    //             vue.graphManager.graph.getChildCells()[i].id = product.id;
                                    //             vue.graphManager.graph.getChildCells()[i].style = product.id;
                                    //             console.log(cell);
                                    //             break;
                                    //         }
                                    //     }
                                    //     if(!found){
                                    //         for(var j=0; j<vue.platforms.length; j++){
                                    //             var platform = vue.platforms[j];
                                    //             if(platform.originalID !== null && platform.originalID === cell_id){
                                    //                 found = true;
                                    //                 vue.graphManager.graph.getChildCells()[i].id = platform.id;
                                    //                 vue.graphManager.graph.getChildCells()[i].style = platform.id;
                                    //                 break;
                                    //             }
                                    //         }
                                    //     }
                                    // }

                                    for(var i=0; i<vue.products.length; i++){
                                        var product = vue.products[i];
                                        if(product.img !== null){
                                            vue.graphManager.addImageStyle(product.id, product.img, function (w, h) {
                                                vue.graphManager.graph.refresh();
                                            });
                                        }
                                    }

                                    for(var i=0; i<vue.platforms.length; i++){
                                        var platform = vue.platforms[i];
                                        if(platform.img !== null){
                                            vue.graphManager.addPlatformImageStyle(platform.id, platform.img, function (w, h) {
                                                vue.graphManager.graph.refresh();
                                            });
                                        }
                                    }


                                }, 500);
                            }
                        }

                    }).catch(function (error) {
                        alert(error);
                        // vue.commentLoading = false;
                    });


                }
            },
            function () {
                interact('#graph-container')
                    .resizable({
                        // resize from all edges and corners
                        edges: {left: false, right: false, bottom: true, top: false},

                        // keep the edges inside the parent
                        restrictEdges: {
                            outer: 'parent',
                            endOnly: true,
                        },

                        // minimum size
                        restrictSize: {
                            min: {width: 100, height: 100},
                        },

                        inertia: true,

                        onmove: function (event) {
                            // console.log(event);
                        }
                    })
                    .on('resizemove', function (event) {
                        var target = event.target,
                            x = (parseFloat(target.getAttribute('data-x')) || 0),
                            y = (parseFloat(target.getAttribute('data-y')) || 0);

                        // update the element's style
                        target.style.width = event.rect.width + 'px';
                        target.style.height = event.rect.height + 'px';

                        // translate when resizing from top or left edges
                        x += event.deltaRect.left;
                        y += event.deltaRect.top;

                        target.style.webkitTransform = target.style.transform =
                            'translate(' + x + 'px,' + y + 'px)';

                        target.setAttribute('data-x', x);
                        target.setAttribute('data-y', y);
                        // target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height);
                    });
            }

        ],
        computed: {
            editor() {
                return this.$refs.myTextEditor.quill
            },
            totalCapabilities: function () {
                var capabilities = null;
                if(this.CAPABILITY !== null){
                    capabilities = JSON.parse(JSON.stringify(this.CAPABILITY));
                    for(var i=0; i<capabilities.length; i++){
                        capabilities[i].check = false;
                    }

                    var haveCapa = false;
                    for(var i=0; i<this.products.length; i++){
                        var product = this.products[i];
                        if(product.capabilities !== null && product.capabilities.length > 0){
                            for(var j=0; j<product.capabilities.length; j++){
                                if(product.capabilities[j].check){
                                    haveCapa = true;
                                    capabilities[j].check = true;
                                }
                            }
                        }
                    }

                    if(!haveCapa){
                        capabilities = null;
                    }
                }

                return capabilities
            },
            originalLoading: function () {
                for(var key in this.originalProgress){
                    if(!this.originalProgress[key]){
                        return true;
                    }
                }
                return false
            }
            // contentCode() {
            //     return hljs.highlightAuto(this.content).value
            // }
        },
    });

    vue.supporter = new Supporter(vue);
    // vue.auth = new Auth(vue);

    return vue;
}