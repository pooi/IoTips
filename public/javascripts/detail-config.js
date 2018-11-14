

function init(init_user, init_boardID) {
    // console.log(init_result);
    // console.log(init_content);

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
            graphManager: new GraphManager("graph", false),
            userInfo: new UserInformation(),

            viewer: null,
            shareSheet: false,
            shares: [
                { img: 'kakao.png', title: 'Kakao' },
            ],

            result: null,

            boardType: null,
            boardTypes: Supporter.getBoardTypes(),

            editorTitle: null,

            editorOption: {
                // theme: 'bubble',
                placeholder: "내용이 없습니다.",
                readOnly: true,
                readonly: true,
                // theme: 'bubble',
                modules: {
                    toolbar: false
                    // toolbar: [
                    //     // ['bold', 'italic', 'underline', 'strike'],
                    //     // [{ 'color': [] }, { 'background': [] }],
                    //     // [{ 'align': [] }],
                    //     // [{ 'header': 1 }, { 'header': 2 }],
                    //     // [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    //     // [{ 'script': 'sub' }, { 'script': 'super' }],
                    //     // [{ 'indent': '-1' }, { 'indent': '+1' }],
                    //     // [{ 'direction': 'rtl' }],
                    //     // [{ 'size': ['small', false, 'large', 'huge'] }],
                    //     // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    //     // // [{ 'font': [] }],
                    //     // ['blockquote', 'code-block', 'link'],
                    //     // // ['clean'],
                    //     // // ['link', 'image', 'video']
                    // ],
                    // // syntax: {
                    // //     highlight: text => hljs.highlightAuto(text).value
                    // // }
                }
            },

            content: null,
            comments: [],
            commentLoading: false,

            reviews: [],
            reviewLoading: false,
            writeReviewDialog: false,
            tempReview: null,
            submitReviewProgress: false,

            CAPABILITY: null,
            capabilities: [],
            detailCapabilityDialog: false,
            detailCapabilityDialogPos: {
                x: 0,
                y: 0
            },
            detailCapability: null,
            detailCapabilityProducts: [],

            platforms: [],
            detailPlatformDialog: false,
            detailPlatform: null,
            detailPlatformIndex: -1,

            products: [],
            detailProductDialog: false,
            detailProduct: null,
            detailProductIndex: -1,

            tempComment: null,
            tempParentComment: null,
            commentSubmitProgress: false,

            scrapSuccessDialog: false,
            scrapFailDialog: false,

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

            onEditorBlur(editor) {
                console.log('editor blur!');//, editor)
            },
            onEditorFocus(editor) {
                console.log('editor focus!');//, editor)
            },
            onEditorReady(editor) {
                console.log('editor ready!');//, editor)
            },
            scrap: function(){
                if(this.auth.user === null){
                    this.auth.toggleDialog();
                    return;
                }



                var data = {
                    boardID: this.result.id,
                    userID: this.auth.user.db_id
                };

                axios.post(
                    '/board/user/scrap/save',
                    data
                ).then(function (res) {
                    var result = res.data;

                    if(result){
                        vue.scrapSuccessDialog = true;
                    }else{
                        vue.scrapFailDialog = true;
                    }

                }).catch(function (error) {
                    alert(error);
                });

            },
            shareTo: function (title) {

                var url = window.location.href;
                var origin = window.location.origin;
                var pathname = window.location.pathname;

                var shareItem = this.result;
                if(title === "Kakao"){

                    var tags = "";
                    var tagList = this.result.tags;
                    if(tagList !== null){
                        for(var i=0; i<Math.min(tagList.length, 5); i++){
                            var tag = tagList[i];
                            if(tag !== ""){
                                tags += "#" + tag + " ";
                            }
                        }
                        if(tagList.length > 5)
                            tags += "...";
                    }

                    var templateArgs = {
                        title: 'IoTips' + " - " + shareItem.title,
                        content: tags,
                        button1_title: '확인하기',
                        button1_link: pathname.substring(1),
                        viewCount: shareItem.hit,
                        likeCount: 20,
                        commentCount: vue.comments === null ? 0 : vue.comments.length
                    };

                    if(this.products !== null && this.products.length > 0){
                        var img_count = Math.min(this.products.length,3);
                        for(var i=0; i<img_count; i++){
                            var key = 'img_' + (i+1);
                            templateArgs[key] = this.products[i].img;
                        }
                        templateArgs['img_count'] = img_count;
                    }

                    Kakao.Link.sendCustom({
                        templateId: 12946,
                        templateArgs: templateArgs
                    });

                    // Kakao.Link.sendDefault({
                    //     objectType: 'feed',
                    //     content: {
                    //         title: 'IoTips' + " - " + shareItem.title,
                    //         description: tags,
                    //         imageUrl: origin + "/images/logo/iotips_light.png",
                    //         link: {
                    //             mobileWebUrl: url,
                    //             webUrl: url
                    //         }
                    //     },
                    //     buttons: [
                    //         {
                    //             title: '확인하기',
                    //             link: {
                    //                 mobileWebUrl: url,
                    //                 webUrl: url
                    //             }
                    //         }
                    //     ],
                    //     social: {
                    //         likeCount: 20,
                    //         viewCount: shareItem.hit,
                    //         commentCount: vue.comments === null ? 0 : vue.comments.length
                    //     }
                    // });
                }
                // this.sheet = false;
                this.shareSheet = false;

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

            getComments: function () {
                if("id" in this.result){
                    this.commentLoading = true;
                    var boardID = this.result.id;

                    var data = {
                        boardID: boardID
                    };

                    setTimeout(function () {
                        axios.post(
                            '/board/comments',
                            data
                        ).then(function (res) {
                            var data = res.data;
                            for(var i=0; i<data.length; i++){
                                data[i].rgt_date = new Date(data[i].rgt_date);
                            }

                            vue.comments = [];
                            for(var i=0; i<data.length; i++){
                                if(data[i].parent < 0){
                                    vue.comments.push(data[i]);
                                }else{
                                    var parentID = data[i].parent;
                                    var check = false;
                                    for(var j=0; j<vue.comments.length; j++){
                                        if(vue.comments[j].id === parentID){
                                            vue.comments.splice(j+1, 0, data[i]);
                                            check = true;
                                            break;
                                        }
                                    }
                                    if(!check){
                                        vue.comments.push(data[i]);
                                    }
                                }
                            }

                            // vue.comments = data;
                            vue.commentLoading = false;
                        }).catch(function (error) {
                            alert(error);
                            vue.commentLoading = false;
                        });
                    }, 500);


                }
            },

            selectParentComment: function(comment){
                this.tempParentComment = comment;
                var area = this.$refs.area_comment;
                area.focus();
            },
            submitComment: function(){
                var commentForm = this.$refs.form_comment;
                if(commentForm.validate()){
                    this.commentSubmitProgress = true;
                    this.commentLoading = true;
                    var boardID = this.result.id;

                    var data = {
                        boardID: boardID,
                        content: this.tempComment,
                        parentCommentID: this.tempParentComment == null ? null : this.tempParentComment.id
                    };

                    axios.post(
                        '/board/registComment',
                        data
                    ).then(function (res) {
                        var data = res.data;
                        if(data){
                            vue.commentSubmitProgress = false;
                            vue.tempComment = null;
                            vue.tempParentComment = null;
                            vue.getComments();
                        }
                    }).catch(function (error) {
                        alert(error);
                        vue.commentSubmitProgress = false;
                    });

                }
            },
            showUserInfo: function (e, id) {
                this.userInfo.show(e);
                alert(id);
            },

            toggleReviewDialog: function () {
                if(this.auth.user === null){
                    this.auth.toggleDialog();
                    return;
                }

                this.writeReviewDialog = true;
                this.submitReviewProgress = false;
                this.tempReview = {
                    title: null,
                    content: null,
                    rating: 0
                }
            },

            getReview: function(){

            },

            submitReview: function () {
                if(this.tempReview === null){
                    alert("Error!");
                    return;
                }

                if(this.tempReview.rating <= 0){
                    alert("별점을 입력해주세요.");
                    return;
                }

                var form = this.$refs.form_review;
                if(form.validate()){

                    console.log("validate");
                    this.submitReviewProgress = true;
                    var boardID = this.result.id;

                    var data = {
                        boardID: boardID,
                        title: this.tempReview.title,
                        content: this.tempReview.content,
                        rating: this.tempReview.rating
                    };

                    axios.post(
                        '/board/registReview',
                        data
                    ).then(function (res) {
                        var data = res.data;

                        if(data.statusCode === 200){

                            alert("성공적으로 등록되었습닏다.");
                            vue.getReview();

                        }else{

                            alert(data.errorMsg);

                        }

                        vue.writeReviewDialog = false;
                        vue.submitReviewProgress = false;

                    }).catch(function (error) {
                        alert(error);
                        vue.submitReviewProgress = false;
                    });


                }else{
                    alert("제목과 내용을 입력해주세요.");
                }
            }



        },
        mounted:[
            function () {
                this.auth.parseUserData(init_user);
                // this.auth.requireLogin();
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
            },
            function () {
                var boardID = init_boardID;
                var data = {
                    boardID: boardID
                };

                axios.post(
                    '/board/getDetail',
                    data
                ).then(function (res) {
                    var result = res.data.result;
                    console.log(result);

                    if(result.content != null){
                        vue.content = json2html(JSON.parse(result.content));
                    }

                    if("type" in result){
                        switch (result.type) {
                            case "free":
                                vue.boardType = vue.boardTypes[0];
                                break;
                            case "question":
                                vue.boardType = vue.boardTypes[1];
                                break;
                            case "review":
                                vue.boardType = vue.boardTypes[2];
                                break;
                            case "ecosystem":
                                vue.boardType = vue.boardTypes[3];
                                break;
                            default:
                                vue.boardType = vue.boardTypes[0];
                                break;
                        }
                    }else{
                        vue.boardType = vue.boardTypes[0];
                    }

                    if("rgt_date" in result){
                        result.rgt_date = new Date(result.rgt_date);
                    }

                    if("content" in result){
                        if(result.content != null){
                            result.content = json2html(result.content);
                        }
                    }

                    if("tags" in result){
                        result.tags = JSON.parse(result.tags);
                    }

                    vue.result = result;

                    var platforms = res.data.platforms;
                    var products = res.data.products;

                    for(var i=0; i<platforms.length; i++){
                        var platform = new Platform();
                        platform.fromDic(platforms[i]);
                        vue.platforms.push(platform);
                    }

                    for(var i=0; i<products.length; i++){
                        var product = new Product();
                        product.fromDic(products[i]);
                        vue.products.push(product);
                    }

                    if(products.length > 0){
                        vue.getCapabilityList();
                    }

                    vue.getComments();

                    if("graph" in result){
                        if(result.graph != null){
                            // var graph = JSON.parse(result.graph);
                            // console.log(json2xml(graph));
                            // vue.graphManager.makeFromXml(json2xml(graph));
                            setTimeout(function () {
                                // vue.graphManager = new GraphManager("graph");
                                vue.graphManager.main();
                                var graph = JSON.parse(result.graph);
                                vue.graphManager.makeFromXml(json2xml(graph));
                            }, 1000);
                        }
                    }

                }).catch(function (error) {
                    alert(error);
                    // vue.commentLoading = false;
                });
            }
            // function(){
            //     this.content = JSON.parse(init_content);
            //     if(this.content != null){
            //         this.content = json2html(this.content);
            //     }
            // },
            // function () {
            //
            //     var result = JSON.parse(init_result);
            //
            //     if("type" in result){
            //         switch (result.type) {
            //             case "free":
            //                 this.boardType = this.boardTypes[0];
            //                 break;
            //             case "question":
            //                 this.boardType = this.boardTypes[1];
            //                 break;
            //             case "review":
            //                 this.boardType = this.boardTypes[2];
            //                 break;
            //             case "ecosystem":
            //                 this.boardType = this.boardTypes[3];
            //                 break;
            //             default:
            //                 this.boardType = this.boardTypes[0];
            //                 break;
            //         }
            //     }else{
            //         this.boardType = this.boardTypes[0];
            //     }
            //
            //     if("rgt_date" in result){
            //         result.rgt_date = new Date(result.rgt_date);
            //     }
            //
            //     if("content" in result){
            //         if(result.content != null){
            //             result.content = json2html(result.content);
            //         }
            //     }
            //
            //     this.result = result;
            //
            //     console.log(this.result);
            //
            //
            // },
            // function () {
            //     this.getComments();
            // },

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