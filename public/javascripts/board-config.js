

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

            supporter: null,
            auth: new Auth(),

            items: [
                {
                    id: "1",
                    title: "Title-1",
                    photo: "https://cdn.vuetifyjs.com/images/carousel/planet.jpg"
                },
                {
                    id: "2",
                    title: "Title-2",
                    photo: "https://cdn.vuetifyjs.com/images/carousel/planet.jpg"
                },
                {
                    id: "3",
                    title: "Title-3",
                    photo: "https://cdn.vuetifyjs.com/images/carousel/planet.jpg"
                },
                {
                    id: "4",
                    title: "Title-4",
                    photo: "https://cdn.vuetifyjs.com/images/carousel/planet.jpg"
                },
                {
                    id: "5",
                    title: "Title-5",
                    photo: "https://cdn.vuetifyjs.com/images/carousel/planet.jpg"
                },
                {
                    id: "6",
                    title: "Title-6",
                    photo: "https://cdn.vuetifyjs.com/images/carousel/planet.jpg"
                },
                {
                    id: "7",
                    title: "Title-7",
                    photo: "https://cdn.vuetifyjs.com/images/carousel/planet.jpg"
                },
                {
                    id: "8",
                    title: "Title-8",
                    photo: "https://cdn.vuetifyjs.com/images/carousel/planet.jpg"
                },
                {
                    id: "9",
                    title: "Title-9",
                    photo: "https://cdn.vuetifyjs.com/images/carousel/planet.jpg"
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
            }
        ]
    });
    vue.changeStatusBarColorOnNativeApp("orange");

    vue.supporter = new Supporter(vue);
    // vue.auth = new Auth(vue);

    return vue;
}