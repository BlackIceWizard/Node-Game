exports.getContent = function ( data ) {
    var cell_size = 16;
    var x_cells = data.get( 'fieldDimension' )[0];
    var y_cells = data.get( 'fieldDimension' )[1];
    var area_width = x_cells * cell_size;
    var area_height = y_cells * cell_size;

    var html = '<h1>Тестовая страничка арены Бомбермена</h1>' +
        'Размер поля: '+data.get( 'fieldDimension' )[0]+'/'+data.get( 'fieldDimension' )[1]+
        '<br/>'+
        '<span id="blue_team_score" style="font-size: 15pt; color:blue;">Побед за автора: '+data.get( 'teamScore' )[1]+'</span>'+
        '<span style="font-size: 15pt;"> | </span>'+
        '<span id="red_team_score" style="font-size: 15pt; color:red;" >Побед за выказавшего претензию: '+data.get( 'teamScore' )[2]+'</span>'+
        '<div id="arena" style="width:'+area_width+'px; height: '+area_height+'px;">';

    for( var y = 1; y <= y_cells; y++ ) {
        for( var x = 1; x <= x_cells; x++ ) {
            var is_strong_wall_cell = true;
            if( y%2 == 1 || x%2 == 1 ) {
                is_strong_wall_cell = false;
            }
            if( is_strong_wall_cell )
                html += '<div class="strong_wall_cell" ></div>';
            else
                html += '<div class="empty_cell" ></div>';
        }
        html += '<div style="clear:both"></div>';
    }

    html += '</div>' +
        '<div><b>Управление</b>: <b>w</b>-вверх <b>a</b>-влево <b>d</b>-вправо <b>s</b>-вниз <b>space</b>-огонь</div>' +
        '<div style="clear:both"></div>';



    return html;
};