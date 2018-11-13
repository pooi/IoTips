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
                //navigation: true,
                anchors: ['home', 'about'],
                sectionsColor: ['#41b883', '#ff5f45']
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
            ],
            statusColor: "#ffaf1d",
            bottomTab: "board",

            supporter: null,
            auth: new Auth()
        },
        methods: {
            say: function (msg) {
                alert(msg);
            }
        },
        mounted: [
            function () {
                this.auth.parseUserData(init_user);
                this.auth.requireLogin();
            }
        ]
    });

    vue.supporter = new Supporter(vue);

    return vue;
}