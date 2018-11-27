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

            partners: [
                {"img": "/images/partner/partner_logo_1.png", "url": "http://www.munhak.com/"}, {"img": "/images/partner/partner_logo_2.png", "url": "http://www.woowahan.com/"}, {"img": "/images/partner/partner_logo_3.png", "url": "https://spot.wooribank.com/pot/Dream?withyou=BPPBC0005"}, {"img": "/images/partner/partner_logo_4.png", "url": "http://www.podbbang.com/"}, {"img": "/images/partner/partner_logo_5.png", "url": "http://brunt.co"}, {"img": "/images/partner/bbs-logo.png", "url": "http://www.bbsi.co.kr/"}, {"img": "/images/partner/partner_logo_6.png", "url": "https://music.bugs.co.kr/"}, {"img": "/images/partner/partner_logo_7.png", "url": "https://www.cgagu.com/"}, {"img": "/images/partner/partner_logo_8.png", "url": "http://www.coway.co.kr/"}, {"img": "/images/partner/partner_logo_9.png", "url": "http://www.genie.co.kr/"}, {"img": "/images/partner/partner_logo_10.png", "url": "http://www.goodtv.co.kr"}, {"img": "/images/partner/partner_logo_11.png", "url": "http://www2.meethue.com/ko-kr/"}, {"img": "/images/partner/partner_logo_12.png", "url": "http://www.hknetworks.kr/"}, {"img": "/images/partner/partner_logo_13.png", "url": "http://iwaymedia.net/"}, {"img": "/images/partner/partner_logo_14.png", "url": "http://www.lge.co.kr/lgekr/company/about/about/ci.jsp"}, {"img": "/images/partner/partner_logo_15.png", "url": "http://www.uplus.co.kr/cmg/kore/info/pklu/RetrievePkLuAI.hpi?mid=12454"}, {"img": "/images/partner/partner_logo_16.png", "url": "https://www.linefriends.com/"}, {"img": "/images/partner/partner_logo_17.png", "url": "http://www.naverlabs.com/"}, {"img": "/images/partner/partner_logo_18.png", "url": "http://music.naver.com/"}, {"img": "/images/partner/partner_logo_19.png", "url": "http://www.tomatalk.co.kr"}, {"img": "/images/partner/partner_logo_20.png", "url": "https://www.miraeassetdaewoo.com/"}, {"img": "/images/partner/partner_logo_21.png", "url": "https://www.qualcomm.co.kr/"}, {"img": "/images/partner/partner_logo_22.png", "url": "http://www.sports2i.com/"}, {"img": "/images/partner/partner_logo_23.png", "url": "http://tbs.seoul.kr/introduce/vision.do"}, {"img": "/images/partner/partner_logo_26.png", "url": "http://www.mi.com/"}, {"img": "/images/partner/partner_logo_24.png", "url": "http://www.yeelight.com"}, {"img": "/images/partner/partner_logo_25.png", "url": "http://www.ygfamily.com/company/introduction_sub03.asp?LANGDIV=K"}, {"img": "/images/partner/partner_logo_27.png", "url": "https://www.youmi.kr/"}
            ],

        },
        methods: {
            say: function (msg) {
                alert(msg);
            }
        },
        mounted: [
            function () {
                this.auth.parseUserData(init_user);
                // this.auth.requireLogin();
            }
        ]
    });

    vue.supporter = new Supporter(vue);

    return vue;
}