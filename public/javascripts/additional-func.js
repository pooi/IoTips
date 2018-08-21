class Supporter {
    constructor(vue) {
        this.vue = vue;
        this.data = {
            isShowBackBtn: false
        }
        this.drawer = false;
    }

    isWebkit(){
        try{
            webkit.messageHandlers.checkWebkit.postMessage("");
            return true;
        }catch (e){
            return false;
        }
    }

    goBack () {
        window.history.back();
    }

    isHaveHistory(){
        return window.history.length > 0
    }

    getToday() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var today = yyyy + "-" + mm + "-" + dd; //dd + '/' + mm + '/' + yyyy;
        return today;
    }

    static getToday() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var today = yyyy + "-" + mm + "-" + dd; //dd + '/' + mm + '/' + yyyy;
        return today;
    }

    getTodayMs () {
        var d = new Date();
        return d.getTime();
    }

    static getTodayMs () {
        var d = new Date();
        return d.getTime();
    }

    dateToMs (date) {
        var temp = date.split('-');
        var year = parseInt(temp[0]);
        var month = parseInt(temp[1]);
        var day = parseInt(temp[2]);
        var k = Date.parse(date);
        return k;
    }

    static dateToMs (date) {
        var temp = date.split('-');
        var year = parseInt(temp[0]);
        var month = parseInt(temp[1]);
        var day = parseInt(temp[2]);
        var k = Date.parse(date);
        return k;
    }

    msToDate (ms) {
        var date = new Date(ms);
        var dd = date.getDate();
        var mm = date.getMonth() + 1; //January is 0!

        var yyyy = date.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var dateString = yyyy + "-" + mm + "-" + dd;
        return dateString;
    }

    static msToDate (ms) {
        var date = new Date(ms);
        var dd = date.getDate();
        var mm = date.getMonth() + 1; //January is 0!

        var yyyy = date.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var dateString = yyyy + "-" + mm + "-" + dd;
        return dateString;
    }

    msToDateKo (ms) {
        var date = new Date(ms);
        var dd = date.getDate();
        var mm = date.getMonth() + 1; //January is 0!

        var yyyy = date.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var dateString = yyyy + "년 " + mm + "월 " + dd + "일";
        return dateString;
    }

    static msToDateKo (ms) {
        var date = new Date(ms);
        var dd = date.getDate();
        var mm = date.getMonth() + 1; //January is 0!

        var yyyy = date.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var dateString = yyyy + "년 " + mm + "월 " + dd + "일";
        return dateString;
    }

    msToTime (ms) {
        var date = new Date(ms);
        var hh = date.getHours();
        var mm = date.getMinutes();


        var timeString = (hh%12) + ":" + (mm < 10 ? "0" + mm : mm);
        if(hh > 12){
            timeString += " PM";
        }else{
            timeString += " AM";
        }
        return timeString;
    }

    static msToTime (ms) {
        var date = new Date(ms);
        var hh = date.getHours();
        var mm = date.getMinutes();


        var timeString = (hh%12) + ":" + (mm < 10 ? "0" + mm : mm);
        if(hh > 12){
            timeString += " PM";
        }else{
            timeString += " AM";
        }
        return timeString;
    }

    reduceString (str, len) {
        var newStr = str.substring(0, len);
        if(str.length > 100){
            newStr += "...";
        }
        return newStr;
    }

    static reduceString (str, len) {
        var newStr = str.substring(0, len);
        if(str.length > 100){
            newStr += "...";
        }
        return newStr;
    }

    reloadPage () {
        location.reload();
    }

    splitArray (array) {
        var chunk = 1;
        var breakpoint = this.vue.__proto__.$vuetify.breakpoint;
        if(breakpoint.xs || breakpoint.xl)
            chunk = 1;
        else if(breakpoint.sm)
            chunk = 2;
        else if(breakpoint.md)
            chunk = 3;
        else
            chunk = 4;
        // console.log(this.__proto__.$vuetify.breakpoint);
        // console.log("chunk", chunk);

        var i,j,temparray;
        var newArray = [];
        for (i=0,j=array.length; i<j; i+=chunk) {
            temparray = array.slice(i,i+chunk);

            while(temparray.length < chunk){
                temparray.push(null);
            }

            newArray.push(temparray);
        }
        // console.log(newArray);
        return newArray;
    }
}

class Auth {
    constructor() {
        // this.vue = vue;
        this.user = {

        }
        this.loginDialog = false;
        this.detailDialog = false;
    }

    loginGoogle(){
        var pathname = window.location.pathname;
        window.location.href = "/auth/google?redirectTo=" + pathname;
    }

    logout(){
        var pathname = window.location.pathname;
        window.location.href = "/auth/logout?redirectTo=" + pathname;
    }

    parseUserData(init_user){
        console.log(init_user);
        this.user = JSON.parse(init_user);
        console.log(this.user);
    }

}