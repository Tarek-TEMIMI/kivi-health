
export const getURL = (routeName) => {
    return ajaxurl + '?action=ajax_get&route_name=' + routeName;
}


export const postURL = (routeName) => {
    return ajaxurl + '?action=ajax_post&route_name=' + routeName;
}