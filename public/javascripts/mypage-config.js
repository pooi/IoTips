

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
            isDark: false,

            supporter: null,
            auth: new Auth(),

            myEcosystemItems: [],
            loadingMyEcosystem: false,
            myItems: [],
            loadingMyItem: false,
            scraps: [],
            loadingScrap: false,

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

            moveDetail: function(item){
                window.location.href = "/board/" + item.id;
            },

            getMyEcosystemBoardData: function () {
                this.loadingMyEcosystem = true;
                var data = {};
                if(this.auth.user !== null && "db_id" in this.auth.user){
                    data["userID"] = this.auth.user.db_id;
                }

                setTimeout(function () {
                    axios.post(
                        '/board/user/ecosystem',
                        data
                    ).then(function (res) {
                        var data = res.data;
                        vue.myEcosystemItems = [];
                        for(var i=0; i<Math.min(data.length, 10); i++){
                            data[i].rgt_date = new Date(data[i].rgt_date);
                            vue.myEcosystemItems.push(data[i]);
                        }
                        vue.loadingMyEcosystem = false;
                    }).catch(function (error) {
                        alert(error);
                        vue.loadingMyEcosystem = false;
                    });
                }, 500);


            },

            getMyBoardData: function () {
                this.loadingMyItem = true;
                var data = {};
                if(this.auth.user !== null && "db_id" in this.auth.user){
                    data["userID"] = this.auth.user.db_id;
                }

                setTimeout(function () {
                    axios.post(
                        '/board/user',
                        data
                    ).then(function (res) {
                        var data = res.data;
                        vue.myItems = [];
                        for(var i=0; i<Math.min(data.length, 10); i++){
                            data[i].rgt_date = new Date(data[i].rgt_date);
                            vue.myItems.push(data[i]);
                        }
                        vue.loadingMyItem = false;
                    }).catch(function (error) {
                        alert(error);
                        vue.loadingMyItem = false;
                    });
                }, 500);


            },

            getScrapData: function () {
                this.loadingScrap = true;
                var data = {};
                if(this.auth.user !== null && "db_id" in this.auth.user){
                    data["userID"] = this.auth.user.db_id;
                }

                setTimeout(function () {
                    axios.post(
                        '/board/user/scrap',
                        data
                    ).then(function (res) {
                        var data = res.data;
                        vue.scraps = [];
                        for(var i=0; i<Math.min(data.length, 10); i++){
                            data[i].rgt_date = new Date(data[i].rgt_date);
                            vue.scraps.push(data[i]);
                        }
                        vue.loadingScrap = false;
                    }).catch(function (error) {
                        alert(error);
                        vue.loadingScrap = false;
                    });
                }, 500);


            },


        },
        mounted:[
            function () {
                this.auth.parseUserData(init_user);
                this.getMyEcosystemBoardData();
                this.getMyBoardData();
                this.getScrapData();
            },
        ]
    });
    vue.changeStatusBarColorOnNativeApp("orange");

    vue.supporter = new Supporter(vue);

    return vue;
}