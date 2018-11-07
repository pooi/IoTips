

function init(init_user) {

    var vue = new Vue({
        el: '#app',
        data: {
            title: 'IoT Shared Platform',
            options: {
                afterLoad: function(origin, destination, direction){
                    console.log(origin, destination, direction);
                    if(vue != null){
                        var destinationIndex = destination.index;
                        vue.toolbarItems[destinationIndex].color = "white";
                        if(origin != null){
                            var originIndex = origin.index;
                            vue.toolbarItems[originIndex].color = "grey lighten-1";
                        }
                    }
                },
                menu: '#menu',
                navigation: true,
                loopTop: true,
                loopBottom: true,
                anchors: ['home', 'about', 'platform'],
                sectionsColor: ['#41b883', '#B0BEC5', '#0798ec']
            },
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
            toolbarItems: [
                {
                    title: "Home",
                    href: "home",
                    color: "white"
                },
                {
                    title: "About",
                    href: "about",
                    color: "grey lighten-1"
                },
                {
                    title: "Platform",
                    href: "platform",
                    color: "grey lighten-1"
                }
            ],

            supporter: null,
            auth: new Auth(),

            mostViewItems: [],

            cItems: [
                {
                    src: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg'
                },
                {
                    src: 'https://cdn.vuetifyjs.com/images/carousel/sky.jpg'
                },
                {
                    src: 'https://cdn.vuetifyjs.com/images/carousel/bird.jpg'
                },
                {
                    src: 'https://cdn.vuetifyjs.com/images/carousel/planet.jpg'
                }
            ]

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
                    this.changeStatusBarColorOnNativeApp("orange");
                    this.statusColor = this.supporter.getStatusLightOrange();
                }else if(this.scrollData.statusBar & this.scrollData.offsetTop >= 50){
                    this.scrollData.statusBar = !this.scrollData.statusBar;
                    this.changeStatusBarColorOnNativeApp("white");
                    this.statusColor = "#FFFFFF";
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
            // afterLoad: function(origin, destination, direction){
            //     console.log(origin, destination, direction);
            // }

        },
        mounted:[
            function () {
                this.auth.parseUserData(init_user);
            },
            function () {
                var data = {};

                axios.post(
                    '/mostView',
                    data
                ).then(function (response) {
                    var res = response;
                    var data = res.data;
                    // console.log("data: ", data);
                    vue.mostViewItems = [];
                    vue.mostViewItems = vue.mostViewItems.concat(data);
                    // vue.recentModel = 0;//vue.recentItems[0].id;
                }).catch(function (error) {
                    alert(error);
                    // vue.filterDialog = false;
                    // vue.isFilterProgress = false;
                });
            }
        ]
    });
    vue.changeStatusBarColorOnNativeApp("orange");

    vue.supporter = new Supporter(vue);
    // vue.auth = new Auth(vue);

    return vue;
}