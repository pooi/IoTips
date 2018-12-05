

function init(init_user, BOARD_TYPE, init_page) {
    console.log(BOARD_TYPE);

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
            isDark: false,
            loading: false,

            supporter: null,
            auth: new Auth(),

            fab: false,
            boardType: BOARD_TYPE,
            page : parseInt(init_page),
            pageStep: 20,
            totalBoardCount: 0,
            items: [],
            showCard: true,

            searchText: null,

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
            goRegist: function () {
                window.location.href = "/board/regist?boardType=" + this.boardType;
            },
            goBoardMain: function(){
                window.location.href = "/board/" + this.boardType;

            },

            getBoardData: function () {
                this.loading = true;
                var data = {
                    type: this.boardType,
                    page: this.page
                }

                var query = (new URL(window.location.href)).searchParams.get("query");
                if(query){
                    data['query'] = query;
                }

                setTimeout(function () {
                    axios.post(
                        '/board',
                        data
                    ).then(function (res) {
                        console.log(res.data);
                        vue.totalBoardCount = res.data[0][0].total;

                        var data = res.data[1];
                        vue.items = data;
                        for(var i=0; i<vue.items.length; i++){
                            vue.items[i].rgt_date = new Date(vue.items[i].rgt_date);
                            vue.items[i].tags = JSON.parse(vue.items[i].tags);
                        }
                        vue.loading = false;
                    }).catch(function (error) {
                        alert(error);
                        vue.loading = false;
                    });
                }, 500);


            },

            moveDetail: function(item){
                window.location.href = "/board/" + item.id;
            },
            search: function () {
                if(this.searchText !== null && this.searchText.length > 0){
                    var pathname = window.location.pathname;
                    window.location.href = pathname + "?" + this.supporter.encodeQueryData({query: this.searchText})
                }else{
                    this.goBoardMain();
                }
            },
            searchEnter: function (e) {
                if(e.keyCode === 13){
                    this.search();
                }
            },

            movePage: function(page){
                var pathname = window.location.pathname;
                window.location.href = pathname + "?" + this.supporter.encodeQueryData({page: page});
            }

        },
        mounted:[
            function () {
                this.auth.parseUserData(init_user);
            },
            // function () {
            //
            //     var nicks = [
            //         "아름다운별",
            //         "쿠쿠리",
            //         "로엔구리",
            //         "날로먹자",
            //         "벤지",
            //         "원주"
            //     ];
            //
            //     for(var i=0; i<20; i++){
            //         var text = "";
            //         var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            //
            //         for (var k = 0; k < 20; k++)
            //             text += possible.charAt(Math.floor(Math.random() * possible.length));
            //
            //         this.items.push({
            //             id: i,
            //             title: "Title - " + text,
            //             numOfLike: parseInt(Math.random()*1000)%10,
            //             numOfComment: parseInt(Math.random()*1000)%10,
            //             nickname: nicks[parseInt(Math.random()*1000)%6],
            //             hit: parseInt(Math.random()*1000),
            //             rgt_date: "2018-09-30 14:57:18"
            //         });
            //     }
            // },
            function () {

                var query = (new URL(window.location.href)).searchParams.get("query");
                if(query){
                    this.searchText = query;
                }

                var page = (new URL(window.location.href)).searchParams.get("page");
                if(page){
                    this.page = page;
                }else{
                    this.page = 1;
                }

                this.getBoardData();
            }
        ],
        watch: {
            page: function (val) {
                this.getBoardData();
                // this.movePage(val);
            }
        }
    });
    vue.changeStatusBarColorOnNativeApp("orange");

    vue.supporter = new Supporter(vue);

    return vue;
}