

function init(init_user, init_result, init_content) {
    console.log(init_result);
    console.log(init_content);

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
            graphManager: new GraphManager("graph"),
            viewer: null,

            result: null,

            boardType: null,
            boardTypes: Supporter.getBoardTypes(),

            editorTitle: null,

            editorOption: {
                // theme: 'bubble',
                placeholder: "Insert content here ...",
                readOnly: true,
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

            capabilities: [],
            platforms: [],
            detailPlatformDialog: false,
            detailPlatform: null,
            detailPlatformIndex: -1,

            products: [],
            detailProductDialog: false,
            detailProduct: null,
            detailProductIndex: -1,


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
            function(){
                this.content = JSON.parse(init_content);
                if(this.content != null){
                    this.content = json2html(this.content);
                }
            },
            function () {

                var result = JSON.parse(init_result);

                if("type" in result){
                    switch (result.type) {
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
                        default:
                            this.boardType = this.boardTypes[0];
                            break;
                    }
                }else{
                    this.boardType = this.boardTypes[0];
                }

                if("rgt_date" in result){
                    result.rgt_date = new Date(result.rgt_date);
                }

                if("content" in result){
                    if(result.content != null){
                        result.content = json2html(result.content);
                    }
                }

                this.result = result;

                console.log(this.result);


            },

        ],
        computed: {
            editor() {
                return this.$refs.myTextEditor.quill
            },
            // contentCode() {
            //     return hljs.highlightAuto(this.content).value
            // }
        },
    });

    vue.supporter = new Supporter(vue);
    // vue.auth = new Auth(vue);

    return vue;
}