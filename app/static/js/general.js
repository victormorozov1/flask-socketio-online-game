function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function are_similar(s1, s2){
    if (s1.length < s2.length){
        s3 = s1;
        s1 = s2;
        s2 = s3;
    }

    let small_s = s2;

    if (s2.length > 5){
        small_s = '';
        for (let i = 1; i < s2.length - 1; i++){
            small_s += s2[i];
        }
    }

    for (let i = 0; i < s1.length; i++){
        let plus = 0;
        while (s1[i + plus] === small_s[plus]){
            plus++;
            if (plus === small_s.length) {
                return true;
            }
        }
    }

    return false;
}
