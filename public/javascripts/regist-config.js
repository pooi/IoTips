

function init(init_user) {

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
                {
                    title: "SmartThings",
                    company: "Samsung",
                    cost: "Free",
                    logo: "/images/logo/smartthings.png"
                }
            ],
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


        },
        methods:{
            onScroll (e) {
                var scroll = window.pageYOffset || document.documentElement.scrollTop;

                this.scrollData.scrollT += (scroll-this.scrollData.offsetTop);
                this.scrollData.offsetTop = scroll;

                if(this.scrollData.scrollT > this.scrollData.delta){
                    this.scrollData.isShowFabTop = true;
                    this.chatManager.hide();
                    this.scrollData.scrollT = 0;
                }else if (this.scrollData.scrollT < -this.scrollData.delta) {
                    this.scrollData.isShowFabTop = false;
                    this.chatManager.show();
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
                this.platforms.push({
                    title: "Kasa Smart",
                    company: "TP-LINK Research America",
                    cost: "Free",
                    logo: "/images/logo/tplink.png"
                })
            },
            removePlatform: function (index) {
                if(index < this.platforms.length){
                    this.platforms.splice(index, 1);
                }
            },
            addProduct: function () {

                var form = this.$refs.product_form;
                if(form.validate()){
                    this.products.push(this.tempProduct);
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
            parsingURL: function () {
                var urlField = this.$refs["product_url"];

                if(urlField.valid){
                    this.tempProduct.parsingProgress = true;
                    var data = {
                        url: this.tempProduct.url
                    };

                    axios.post(
                        '/parseurl',
                        data
                    ).then(function (res) {
                        var data = res.data;
                        console.log(data);

                        vue.tempProduct.parsingProgress = false;
                        vue.tempProduct.parsingComplete = true;
                        vue.tempProduct.title = data.title;
                        vue.tempProduct.description = data.description;
                        vue.tempProduct.company = data.copyright;
                        vue.tempProduct.imgs = data.imgs;
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
            }
        ]
    });

    vue.supporter = new Supporter(vue);
    // vue.auth = new Auth(vue);

    return vue;
}