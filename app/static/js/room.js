function change_cell_size() {
    let height = document.documentElement.clientHeight;
    let width = document.documentElement.clientWidth;
    let szx = (width) / m - 1;
    let szy = (height) / n - 1;
    console.log(`sc.h = ${height}, sc.w = ${width}, n = ${n}, m = ${m}`)
    let sz = Math.min(szx, szy) - 2;
    $('.row').css('height', sz + 'px');
    $('.cell').each(function( index ) {
        $(this).css('height', sz + 'px');
        $(this).css('width', sz + 'px');
    });
}

change_cell_size();