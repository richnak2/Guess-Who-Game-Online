let html_alert = undefined;
let html_close = undefined;
let html_text = undefined;
let alert_timer = 0;
document.addEventListener('DOMContentLoaded', function () {
    html_alert = document.getElementById('alert');
    html_close = document.getElementById('close');
    html_text = document.getElementById('text');
});

function create_exception(insert_text,time_of_display,type_of_style){
    html_alert.className = 'alert alert-'+type_of_style+' alert-dismissible fade show fixed-top ';
    html_text.innerHTML = insert_text;
    html_close.disabled = false;
    html_alert.style.opacity = 1+'';
    html_alert.style.display = 'revert';
    if (alert_timer !== 0){
        alert_timer = time_of_display
    }else{
        alert_timer = time_of_display
        fade(alert_timer)
    }
    // pocet sekund pokial zmizne allert + 3 pre aditional fade avai
}
function fade(){
    if (alert_timer === 0 ){
        html_alert.style.display = 'none';
    }else if (alert_timer <= 3){
        html_close.disabled = true;
        html_alert.style.opacity = alert_timer/10+'';
        alert_timer -= 0.5;
        setTimeout(fade,50,alert_timer);
    }else{
        alert_timer -= 1;
        setTimeout(fade,1000,alert_timer);
    }

}
function close_alert(){
    html_close.disabled = true;
    alert_timer = 3;
}