

export const validateForm = (formId) => {
    let nodes = document.querySelectorAll(`#${formId} :invalid`);
    return true;
}

export const objToTime = (timeObj) => {
    return window.moment(timeObj.HH + ':' + timeObj.mm, 'HH:mm')
}

export const checkUndefined = (value) => {
    return value === undefined ? ' - ' : value;
}

export const kiviCurrencyPosition = (value, currency) => {
    return currency + ' ' + value ;
}

export const specialCharacters = (value) => {
    let format = /[!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]+/;
    if(format.test(value)){
        return false;
    } else {
        return true;
    }

}

export  const alphaSpace = (value) => {

    if(value === undefined || value === '' || value === null) {
        return true;
    }
    let alphaSpaceRegx = /^[A-Za-z ]+$/g;
    if ((value.match(alphaSpaceRegx))) {
        return true;
    } else {
        return false;
    }
}

export  const minimumValue = (value, object) => {
    if (object.price_type !== "range") {
        return true;
    }
    if(parseInt(object.minPrice) === 0 && parseInt(value) === 0) {
        return true ;
    }
    return (parseInt(object.minPrice) < parseInt(value));
}

export  const maximumDiscount = (value, object) => {
    return (parseInt(object.total_amount) >= parseInt(value));
}

export const postalCode = (value) => {


    let postalCode = /^[A-Za-z0-9-() ]+$/g;
    if(value === '' || value === null) {
        return true;
    }

    if (value.match(postalCode)) {
        return true;
    }
    else {
        return false;
    }
}

export const phoneNumber = (value) => {
    if(value === '' || value === null || value===undefined) {
        return true;
    }
    if(typeof value == 'number'){
        value = value.toString();
    }

    let phoneno = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\.\/0-9]*$/g;

    if (value.match(phoneno)) {
        return true;
    } else {
        return false;
    }
}

export const emailValidate = (value) => {
    if(value === '' || value === null) {
        return true;
    }

    // let filter = /^([a-zA-Z])+(?:[a-zA-Z0-9_\.])+([a-zA-Z0-9])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    // let filter = /^[^\W_](?:[\w.]*[^\W_])?@(?:\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.|(?:[\w-]+\.)+)(?:[a-zA-Z]{2,3}|[0-9]{1,3})\]?$/;
    let filter = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
    if(filter.test(value)) {
        return true;
    }else{
        return false;
    }
}

// Custom validation helpers...
export const minTime = (key_name) => (value, vm) => {

    if (value.HH === "" && value.mm === "") {
        return true;
    }

    let time_one = window.moment(value.HH + ':' + value.mm, 'HH:mm');
    let time_two = window.moment(vm[key_name].HH + ':' + vm[key_name].mm, 'HH:mm');

    return time_one.isAfter(time_two);
}

export const maxTime = (key_name) => (value, vm) => {

    if (value.HH === "" && value.mm === "") {
        return true;
    }

    let time_one = window.moment(value.HH + ':' + value.mm, 'HH:mm');
    let time_two = window.moment(vm[key_name].HH + ':' + vm[key_name].mm, 'HH:mm');

    return time_one.isBefore(time_two);
}

export const validateTimeSlot = (sessionData, clinicSession) => {
    let validate = false;
    let sessionOne = false;
    let sessionTwo = false;
    

    // Code to validate session 1 data...
    if (sessionData.s_one_start_time.HH !== "" && sessionData.s_one_end_time.HH !== "") {
        let sessionOneStartTime = objToTime(sessionData.s_one_start_time);
        let sessionOneEndTime = objToTime(sessionData.s_one_end_time);

        let clinicSessionOneST = objToTime(clinicSession.s_one_start_time);
        let clinicSessionOneET = objToTime(clinicSession.s_one_end_time);

        if (sessionOneStartTime.isBefore(clinicSessionOneST) && sessionOneEndTime.isBefore(clinicSessionOneST)) {
            sessionOne = true;
        } else {
            if (sessionOneStartTime.isAfter(clinicSessionOneST) && sessionOneStartTime.isAfter(clinicSessionOneET)) {


                if (clinicSession.s_two_start_time.HH === "" && clinicSession.s_two_end_time.HH === "") {
                    sessionOne = true;
                } else {
                    let clinicSessionTwoST = objToTime(clinicSession.s_two_start_time);
                    let clinicSessionTwoET = objToTime(clinicSession.s_two_end_time);

                    if ((sessionOneStartTime.isAfter(clinicSessionTwoST) && sessionOneStartTime.isAfter(clinicSessionTwoET)) ||
                        (sessionOneStartTime.isBefore(clinicSessionTwoST) && sessionOneStartTime.isBefore(clinicSessionTwoET))) {
                        sessionOne = true;
                    }
                }
            }
        }
    }

    // Code to validate session 2 data...
    if (sessionOne) {
        if ((sessionData.s_two_start_time.HH === "" && sessionData.s_two_end_time.HH === "") ||
            (clinicSession.s_two_start_time.HH === "" && clinicSession.s_two_end_time.HH === "")) {
            sessionTwo = true;
        } else {
            let sessionTwoStartTime = objToTime(sessionData.s_two_start_time);
            let sessionTwoEndTime = objToTime(sessionData.s_two_end_time);

            let clinicSessionOneST = objToTime(clinicSession.s_one_start_time);
            let clinicSessionOneET = objToTime(clinicSession.s_one_end_time);

            if (sessionTwoStartTime.isBefore(clinicSessionOneST) && sessionTwoEndTime.isBefore(clinicSessionOneST)) {
                sessionTwo = true;
            } else {
                if (sessionTwoStartTime.isAfter(clinicSessionOneST) && sessionTwoStartTime.isAfter(clinicSessionOneET)) {
                    let clinicSessionTwoST = objToTime(clinicSession.s_two_start_time);
                    let clinicSessionTwoET = objToTime(clinicSession.s_two_end_time);

                    if ((sessionTwoStartTime.isAfter(clinicSessionTwoST) && sessionTwoStartTime.isAfter(clinicSessionTwoET)) ||
                        (sessionTwoStartTime.isBefore(clinicSessionTwoST) && sessionTwoStartTime.isBefore(clinicSessionTwoET))) {
                        sessionTwo = true;
                    }

                }
            }
        }
    }

    if (sessionOne && sessionTwo) {
        validate = true;
    }

    return validate;
}


export const randomString = (len, bits) => {
    bits = bits || 36;
    var outStr = "", newStr;
    while (outStr.length < len)
    {
        newStr = Math.random().toString(bits).slice(2);
        outStr += newStr.slice(0, Math.min(newStr.length, (len - outStr.length)));
    }
    return outStr.toUpperCase();
};
export const fullScreen = () => {
    const elementExist =document.getElementsByClassName('full-screen')
    if (elementExist) {
        $(document).on('click', '.full-screen', function () {
            let elem = $(this)
            if (!document.fullscreenElement &&
                !document.mozFullScreenElement &&
                !document.webkitFullscreenElement &&
                !document.msFullscreenElement) {
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen()
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen()
                } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
                } else if (document.documentElement.msRequestFullscreen) {
                    document.documentElement.msRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
                }
            } else {
                if (document.cancelFullScreen) {
                    document.cancelFullScreen()
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen()
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen()
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen()
                }
            }
            elem.find('i').toggleClass('ri-fullscreen-line').toggleClass('ri-fullscreen-exit-line')
        })
    }
};
