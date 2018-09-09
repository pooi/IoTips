

function init(init_user) {

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
            platforms: [
                // {
                //     title: "SmartThings",
                //     company: "Samsung",
                //     cost: "Free",
                //     logo: "/images/logo/smartthings.png"
                // }
            ],
            addPlatformDialog: false,
            choosePlatformImageDialog: false,
            tempPlatform: null,
            detailPlatformDialog: false,
            detailPlatform: null,

            products: [
                // {
                //     title: "Kasa Smart Plug",
                //     company: "TP-LINK",
                //     url: "https://www.tp-link.com/us/products/details/cat-5622_HS200.html",
                //     description: "Wi-Fi Smart Plug"
                // }
            ],
            addProductDialog: false,
            chooseProductImageDialog: false,
            tempProduct: null,
            detailProductDialog: false,
            detailProduct: null,


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
                console.log('editor blur!', editor)
            },
            onEditorFocus(editor) {
                console.log('editor focus!', editor)
            },
            onEditorReady(editor) {
                console.log('editor ready!', editor)
            },

            addCapability: function () {
                this.capabilities.push({
                    title: "Button",
                    component: "switch"
                })
            },
            removeCapability: function (index) {
                if(index < this.capabilities.length){
                    this.capabilities.splice(index, 1);
                }
            },

            addPlatform: function () {

                var form = this.$refs.platform_form;
                if(form.validate()){
                    this.platforms.push(this.tempPlatform);
                    this.graphManager.addCircleNode(this.tempPlatform.title);
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
                if(index < this.platforms.length){
                    this.platforms.splice(index, 1);
                }
            },
            resetPlatformForm: function () {
                this.tempPlatform = {
                    title: null,
                    company: null,
                    url: null,
                    description: null,
                    img: null,

                    parsingProgress: false,
                    parsingComplete: false,
                    imgs: [],
                };
                this.choosePlatformImageDialog = false;
                this.addPlatformDialog = true;
                this.$refs["platform_url"].reset();
            },
            choosePlatformImage: function (index) {
                this.tempPlatform.img = this.tempPlatform.imgs[index];
                this.choosePlatformImageDialog = false;
            },
            showDetailPlatform: function (item) {
                this.detailPlatform = item;

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
                    this.products.push(this.tempProduct);
                    this.graphManager.addNode(this.tempProduct.title);
                    this.addProductDialog = false;
                }

                // this.products.push({
                //     title: "Kasa Smart Plug",
                //     company: "TP-LINK",
                //     url: "https://www.tp-link.com/uk/products/details/cat-5258_HS100.html",
                //     description: "",
                // })
            },
            removeProduct: function (index) {
                if(index < this.products.length){
                    this.products.splice(index, 1);
                }
            },
            resetProductForm: function () {
                this.tempProduct = {
                    title: null,
                    company: null,
                    url: null,
                    description: null,
                    img: null,

                    parsingProgress: false,
                    parsingComplete: false,
                    imgs: [],
                };
                this.chooseProductImageDialog = false;
                this.addProductDialog = true;
                this.$refs["product_url"].reset();
            },
            chooseProductImage: function (index) {
                this.tempProduct.img = this.tempProduct.imgs[index];
                this.chooseProductImageDialog = false;
            },
            showDetailProuct: function (item) {
                this.detailProduct = item;

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

            }

        },
        mounted:[
            function () {
                this.auth.parseUserData(init_user);
                this.auth.requireLogin();
            }
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