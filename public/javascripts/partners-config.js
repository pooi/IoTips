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