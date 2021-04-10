let main_img = undefined;
let main_card = undefined;
const color_pallet = [['#00000000',0],// base color default
    ['#ffffff80',100],['#0013ff80',150],['#e0497080',200],['#30ff0280',250],
    ['#02ffec80',350],['#fcb04580',400],['#fffe1e80',450],['#833ab480',500],
    ['#00000080',550],['#ff00e7ff',600],['#d58ffd80',650], // half transparent colors
    ['#ffffffff',700],['#0013ffff',750],['#e04970ff',800],['#30ff02ff',850],
    ['#02ffecff',900],['#fcb045ff',950],['#fffe1eff',1000],['#833ab4ff',1050],
    ['#000000ff',1100],['#ff00e7ff',1150],['#d58ffdff',1200]]; // full colors

document.addEventListener('DOMContentLoaded', function () {
    main_img = document.getElementById('main_character_img');
    main_card = document.getElementById('main_card');
});

function setShopImage(){
    create_shop(user_account.bought_characters)
    setImageAndBackground(main_img,main_card);
}


function remake_prices(){
    let elements_buy_btn = document.getElementsByClassName('buy_btn');
    let elements_equip_btn = document.getElementsByClassName('equip_btn');
    let elements = document.getElementsByClassName('buy_text');
    for (let text_buy_index = 0; text_buy_index < elements.length; text_buy_index++) {
        if (elements[text_buy_index].style.display !== 'none'){
            if (parseInt(elements[text_buy_index].innerText) > user_account.points){
                elements_buy_btn[text_buy_index].className = 'btn btn-default buy_btn text-white mb10 mr20 bg-danger' ;
                elements_buy_btn[text_buy_index].disabled = true;
                elements_equip_btn[text_buy_index].disabled = true;
            }
        }
    }
}

function  make_new_buy_options(type){
    let elem = undefined;
    if (type === 'color'){
        elem = document.getElementById(user_account.color);

    }else if (type === 'img'){
        elem = document.getElementById(user_account.character);
    }else{
        create_exception('Something want wrong please refresh the page.',10,'warning');
        return
    }

    elem.className = 'btn btn-default equip_btn mb10 text-white bg-success';
    elem.innerText = 'equip';
}
function equip(type,item){
    if (type === 'color'){
        user_account.color = item;

    }else if (type === 'img'){
        user_account.character = item;
    }else{
        create_exception('Something want wrong please refresh the page.',10,'warning');
        return
    }
    let character_in_game = `${user_account.color} ${user_account.character}`
    socket.emit('set_character_or_color',{my_socket_id,character_in_game});
    setImageAndBackground(main_img,main_card);
    setImageAndBackground(html_img,html_img_bg);
}
function buy(item,cost){
    user_account.points -= cost
    html_coins.innerHTML = `${user_account.points}`;
    socket.emit('buy_character_or_color',{my_socket_id,item});
}

function create_text_body(){
    let div_card_body = document.createElement('div');
    div_card_body.className = "card-body text-center";
    return div_card_body;
}
function create_text_buy(cost,already_bought){
    let buy_text = document.createElement('p');
    buy_text.innerHTML = `${cost}`;
    buy_text.className = 'mb0 buy_text';

    let sp = document.createElement('span')
    let img = document.createElement('IMG');
    img.src = './images/coin.png';
    img.className = 'wd20 ht20 ml10';
    img.style.marginBottom = '3%';

    sp.append(img)
    buy_text.append(sp)
    if (already_bought){
        buy_text.style.display = 'none';
    }
    return buy_text;
}
function crate_buy_equip_btn(type,what_to_buy_equip,cost,already_bought,equipped,remove_elem){
    let div_buy_option = document.createElement('div');
    div_buy_option.className = "text-center "
    let btn_buy = document.createElement('BUTTON');
    btn_buy.className = 'btn btn-default buy_btn text-white mb10 mr20 '+(user_account.points < cost?'bg-danger' : 'bg-success');
    btn_buy.innerText = 'buy';
    btn_buy.disabled = (user_account.points < cost)
    btn_buy.onclick = function () {
        buy(what_to_buy_equip,cost)
        btn_equip.disabled = false;
        remove_elem.style.display = 'none'
        btn_buy.style.display = 'none'
        remake_prices();
    }


    let btn_equip = document.createElement('BUTTON');
    btn_equip.className = 'btn btn-default equip_btn mb10 text-white '+(equipped?'bg-warning': 'bg-success');
    btn_equip.innerText = equipped?'equipped':'equip';
    btn_equip.disabled = (!already_bought)
    btn_equip.id = what_to_buy_equip
    btn_equip.onclick = function () {
        make_new_buy_options(type)
        equip(type,what_to_buy_equip);
        btn_equip.className = 'btn btn-default equip_btn mb10 text-white bg-warning';
        btn_equip.innerText = 'equipped';

    }
    if (already_bought){
        btn_buy.style.display = 'none';
    }


    div_buy_option.append(btn_buy,btn_equip)
    return div_buy_option;
}
function create_img(src,cost,already_bought){
    let div_card = document.createElement('div');
    div_card.className = "card card_color wd200 ht200 item_card";

    let div_card_body = create_text_body();

    let buy_text = create_text_buy(cost,already_bought);

    let just_img = document.createElement('IMG');
    just_img.src = './images/Users/'+src;
    just_img.className = 'wd70 ht70 m-auto';

    div_card_body.append(buy_text)

    let div_buy_option = crate_buy_equip_btn('img',src,cost,already_bought,user_account.character === src,buy_text);

    div_card.append(just_img,div_card_body,div_buy_option);
    return div_card;
}
function create_color_card(color,already_bought){
    let div_card = document.createElement('div');
    div_card.className = "card card_color wd150 ht130 item_card";
    div_card.style.backgroundColor = color[0];

    let div_card_body = create_text_body();

    let buy_text = create_text_buy(color[1],already_bought);

    div_card_body.append(buy_text)

    let div_buy_option = crate_buy_equip_btn('color',color[0],color[1],already_bought,user_account.color === color[0],buy_text);

    div_card.append(div_card_body,div_buy_option);

    return div_card;
}


function create_shop(bought_character){
    let elem = document.getElementsByClassName('all_items');
    let bg_colors = elem[0];
    let character_main_elem = elem[1];
    let def = create_img('def.png',0,true);
    character_main_elem.append(def);
    for (let index_img = 1 ;index_img < 31;index_img++){
        let src = index_img+'.png';
        let already_bought = bought_character.includes(src);
        let def = create_img(src,index_img*100,already_bought);
        character_main_elem.append(def);
    }
    color_pallet.forEach(color => {
        let already_bought = bought_character.includes(color[0]) ;
        let def_bg_color = create_color_card(color,already_bought);
        bg_colors.append(def_bg_color);
    })


}
function set_to_default_equipped_html(what){
    let elem = document.getElementById(what);
    elem.className = 'btn btn-default equip_btn mb10 text-white bg-warnning';
    elem.innerText = 'equipped';
}
function set_to_equipped_html(what){
    let elem = document.getElementById(what);
    elem.className = 'btn btn-default equip_btn mb10 text-white bg-success';
    elem.innerText = 'equip';
}

function restart_your_img(){
    set_to_equipped_html(user_account.color)
    set_to_equipped_html(user_account.character)
    user_account.color = '#00000000';
    user_account.character = 'def.png';
    set_to_default_equipped_html(user_account.color)
    set_to_default_equipped_html(user_account.character)
    socket.emit('restart_character',{my_socket_id});
    setShopImage();
}