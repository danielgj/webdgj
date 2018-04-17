/* exported showCollapsibleByIdAndHideOthers */
function showCollapsibleByIdAndHideOthers(id) {
    $('.collapse').collapse('hide');            
    $('#' + id).collapse('show');
}