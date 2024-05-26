// Following is the base url of requested api
const _clinic_baseUrl = window.location.origin + '/wp-json/wp-medical/api/'
// Following is the version of requested api
const apiVersion = "v1"
const _urlGetDoctors = _clinic_baseUrl + apiVersion + '/patient-appointment/get-doctors-data'
const _urlGetAppointmentTypes = _clinic_baseUrl + apiVersion + '/patient-appointment/get-static-data'
export const _patientAppointmentBook = _clinic_baseUrl + apiVersion + '/patient/book-appointment'
export const _patientLogin = _clinic_baseUrl + apiVersion + '/patient-auth/login'
export const _patientRegister = _clinic_baseUrl + apiVersion + '/patient-auth/register'


const _urlGetDoctorDetails = _clinic_baseUrl + apiVersion + '/book-appointment/get-doctors-details'
export const _urlGetTimeSlot = _clinic_baseUrl + apiVersion + '/book-appointment/get-time-slots'
export const _urlSaveAppointment = _clinic_baseUrl + apiVersion + '/book-appointment/save-appointment'

export const post = (route, data = {}, frontEnd = false, headers = {
    headers: { 'Content-Type': 'application/json' }
}) => {

    if (frontEnd) {
        window.ajaxurl = window.ajaxData.ajaxurl;
        window.request_data = window.ajaxData;
    }

    let url = ajaxurl;
    if (data.action === undefined) {
        url = ajaxurl + '?action=ajax_post';
    }

    if (route === undefined) {
        return false
    }

    if (data.append !== undefined ) {
        data.append('route_name', route);
        data.append('_ajax_nonce', request_data.nonce)
    } else {
        data.route_name = route;
        data._ajax_nonce = request_data.nonce;
    }

    return new Promise((resolve, reject, headers) => {
        axios.post(url, data, headers)
            .then((data) => {
                if (data.data.status_code !== undefined && data.data.status_code === 403) {
                    displayErrorMessage(data.data.message);
                    vm.$router.push({ name: "403"});
                }
                resolve(data)
            })
            .catch((error) => {
                reject(error)
            });
    })
}

export const get = (route, data={}, frontEnd = false) => {
     
    if (frontEnd) {
        window.ajaxurl = window.ajaxData.ajaxurl;
        window.request_data = window.ajaxData;
    }
    data._ajax_nonce = window.request_data.get_nonce
    let url = ajaxurl;
    if (data.action === undefined) {
        url = ajaxurl + '?action=ajax_get';
    }

    if (route === undefined) {
        return false
    }

    url = url + '&route_name=' + route;
    return new Promise((resolve, reject) => {
        axios.get(url, { params:  data })
            .then((data) => {
                if (data.data.status_code !== undefined && data.data.status_code === 403) {
                    displayErrorMessage(data.data.message);
                    vm.$router.push({ name: "403"});
                }
                resolve(data)
            })
            .catch((error) => {
                reject(error)
            });
    })
}

export const _axios_post = (url, data) => {
    return new Promise((resolve, reject) => {
        axios.post(url, data)
            .then((data) => {
                resolve(data)
            })
            .catch((error) => {
                reject(error)
            });
    })
}


export const _getDoctors = () => {
    return new Promise((resolve, reject) => {
        axios.get(_urlGetDoctors)
            .then((data) => {
                resolve(data)
            })
            .catch((error) => {
                reject(error)
            });
    })
}

export const _getDoctorsDetails = () => {
    return new Promise((resolve, reject) => {
        axios.get(_urlGetDoctorDetails)
            .then((data) => {
                resolve(data.data)
            })
            .catch((error) => {
                reject(error)
            });
    })
}

export const _getStaticData = (requestObject) => {
    return new Promise((resolve, reject) => {
        axios.post(_urlGetAppointmentTypes, {
            data_type: requestObject.data_type,
            static_data_type: requestObject.static_data_type
        })
            .then((data) => {
                resolve(data)
            })
            .catch((error) => {
                reject(error)
            });
    })
}
