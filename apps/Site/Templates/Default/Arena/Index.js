exports.getContent = function ( data ) {
    var cell_size = 60;
    var x_cells = 11;
    var y_cells = 7;
    var area_width = x_cells * cell_size;
    var area_height = y_cells * cell_size;

    var html = '<h1>Тестовая страничка арены Бомбермена</h1>'+
        '<div style="border:2px dashed #ff8c00; width:'+area_width+'px; height: '+area_height+'px;">';

    for( var y = 1; y <= y_cells; y++ ) {
        for( var x = 1; x <= x_cells; x++ ) {
            var is_strong_wall_cell = true;
            if( y%2 == 1 || x%2 == 1 ) {
                is_strong_wall_cell = false;
            }
            html += '<div style="width:'+cell_size+'px; height: '+cell_size+'px; float:left; '+( is_strong_wall_cell ? 'background-color:#999999;' : '' )+'">'+x%2+':'+y%2+'</div>';
        }
        html += '<div style="clear:both"></div>';
    }

    html += '</div>' +
        '<div style="clear:both"></div>';



    return html;
};