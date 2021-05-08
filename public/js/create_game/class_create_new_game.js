
class NewGame{
    description = undefined
    game_descriptors = {}
    game_images = {}
    id = undefined
    owner_id = undefined
    state = undefined
    title = undefined
    origin_title = undefined
    type = undefined

    load_game(game) {
        let copy_game =  JSON.parse(JSON.stringify(game));
        this.description = copy_game.description
        this.game_descriptors = copy_game.game_descriptors
        this.game_images = copy_game.game_images
        this.id = copy_game.id
        this.owner_id = copy_game.owner_id
        this.state = copy_game.state
        this.origin_title = copy_game.title
        this.type = copy_game.type
    }
    setTitle(title){
        this.title = title
    }
    setType(type){
        this.type = type
    }
    to_default(){
        this.description = undefined
        this.game_descriptors = {}
        this.game_images = {}
        this.id = undefined
        this.owner_id = undefined
        this.state = undefined
        this.title = undefined
        this. origin_title = undefined
        this.type = undefined
    }

    // user interface
    show_hide_inside(what_div_html){
        for (let key in main_config_divs) {
            if (what_div_html === key ){
                if (main_config_divs[key]){
                    document.getElementById(key).style.display = 'revert';
                }else{
                    let last = ''
                    for (let key in main_config_divs) {
                        if (main_config_divs[key] && key !== 'status'){
                            last = key
                        }
                    }
                    create_exception(`You are not checked in <strong>${last}</strong> section`,10,'warning')
                }
            }else{
                document.getElementById(key).style.display = 'none';
            }
        }
        if (what_div_html === 'attributes'){
            this.premake_attributes()
        }
    }

    premake_attributes(){
        console.log(this.type)
       if(this.type === '1 0 1' ){
           document.getElementById('description_image_title').style.display = "none"
           document.getElementById('description_add_more').style.display = "none"
           document.getElementById('description_add_row').style.display = "block"

        }else{
           document.getElementById('description_image_title').style.display = "block"
           document.getElementById('description_add_more').style.display = "block"
           document.getElementById('description_add_row').style.display = "none"
        }
    }
    show_hide(what_html){
        what_html.style.display = what_html.style.display === 'none' ? 'revert' : 'none'
    }

    color_interface(item,color, show){
        item.style.display = show
        item.className = color === false ?'btn btn-default bg-danger text-light' : color === true ?'btn btn-default bg-success text-light' : color === undefined ?'btn btn-default bg-warning text-light':'none'
    }

    show_user_interface(main,images,attributes,define_images,save,status,show){
        this.color_interface(document.getElementById(`main_btn`),main,show)
        this.color_interface(document.getElementById(`images_btn`),images,show)
        this.color_interface(document.getElementById(`attributes_btn`),attributes,show)
        this.color_interface(document.getElementById(`define_images_btn`),define_images,show)
        this.color_interface(document.getElementById(`save_btn`),save,show)
        this.color_interface(document.getElementById(`status_btn`),status,show)

        if (this.type === '0 0 1'){
            this.color_interface(document.getElementById(`attributes_btn`),attributes,'none')
            this.color_interface(document.getElementById(`define_images_btn`),define_images,'none')
        }
    }
}