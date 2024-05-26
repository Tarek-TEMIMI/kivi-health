import Vue from 'vue'
import VueRouter from 'vue-router';

import PatientAuth from "./components/Widgets/PatientDashboard/AuthLayout";

import store from "./frontStore";

Vue.use(VueRouter)

const routes = [
    {
        path: '/authentication',
        name: 'patient-dashboard-widget.auth.layout',
        component: PatientAuth,
        meta : { label: 'AuthLayout' }
    }
];

const router = new VueRouter({
    //base: process.env.MIX_SENTRY_DSN_INDEX,
    // mode: 'history',
    routes
})

router.beforeEach((to, from, next) => {
    if(store.state.user.ID === undefined) {
        store.dispatch("getUserData").then(() => {
            const user_data = store.state.user ;
            if(user_data === undefined || user_data.basicData === undefined) {
                if (to.name === 'patient-dashboard-widget.dashboard.layout') {
                    next({ name: 'patient-dashboard-widget.auth.layout' });
                }else{
                    next();
                }
                store.commit('WIDGET_LOADER', false)
            } else {
                if (to.name === 'patient-dashboard-widget.dashboard.layout') {
                    window.location.href = window.request_data.homePage + '/wp-admin/admin.php?page=dashboard#'
                } else {
                    next();
                }
                store.commit('WIDGET_LOADER', false)
            }
        });
    } else {
        if (to.name === 'patient-dashboard-widget.dashboard.layout') {
            window.location.href = window.request_data.homePage + '/wp-admin/admin.php?page=dashboard#'
        } else {
            next();
        }
        store.commit('WIDGET_LOADER', false)
    }
})

export default router