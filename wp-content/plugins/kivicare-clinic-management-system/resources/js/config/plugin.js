

export const initDataTable = () => {

    $(".data_table").DataTable( {
        dom: "<'row mt-3 p-3' <'col-md-4' <'ml-2' l>><'col-md-4' B><'col-md-4' <'mr-2' f>> <'col-md-12 table-responsive p-0' r t>>" +
            "<'row'<'col-sm-6' <'ml-2 mb-3' i>><'col-sm-6 text-sm-center' <'mr-2 mb-3' p>>>",
        language: {
            'paginate': {
                'previous': "<i class='fas fa-chevron-left'></i>",
                'next': "<i class='fas fa-chevron-right'></i>"
            }
        }
    } );
}