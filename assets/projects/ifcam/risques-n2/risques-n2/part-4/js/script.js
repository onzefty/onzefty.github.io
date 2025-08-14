var soundsData = [
    { id: 'sound_1', name: 'sound_4_1', path: 'local' },
    { id: 'sound_2', name: 'sound_4_2', path: 'local' },
    { id: 'sound_2_2', name: 'sound_4_2_2', path: 'local' },
    { id: 'sound_3', name: 'sound_4_3', path: 'local' },
    { id: 'sound_3_2', name: 'sound_4_3_2', path: 'local' },
    { id: 'sound_4', name: 'sound_4_4', path: 'local' },
    { id: 'sound_4_2', name: 'sound_4_4_2', path: 'local' },
    { id: 'sound_4_3', name: 'sound_4_4_3', path: 'local' },
    { id: 'sound_5', name: 'sound_4_5', path: 'local' },
    { id: 'sound_6', name: 'sound_4_6', path: 'local' },
    { id: 'sound_7', name: 'sound_4_7', path: 'local' },
    { id: 'sound_8', name: 'sound_4_8', path: 'local' },
    { id: 'sound_9', name: 'sound_4_9', path: 'local' },
    { id: 'sound_9_2', name: 'sound_4_9_2', path: 'local' },
    { id: 'sound_9_feedback', name: 'sound_4_9_feedback', path: 'local' },
    { id: 'sound_11', name: 'sound_4_11', path: 'local' },
    { id: 'sound_12', name: 'sound_4_12', path: 'local' },
    { id: 'sound_13', name: 'sound_4_13', path: 'local' },
    { id: 'sound_14', name: 'sound_4_14', path: 'local' },
    { id: 'sound_15', name: 'sound_4_15', path: 'local' },
    { id: 'sound_16', name: 'sound_4_16', path: 'local' },
    { id: 'sound_17', name: 'sound_4_17', path: 'local' },
    { id: 'sound_18', name: 'sound_4_18', path: 'local' },
    { id: 'sound_19', name: 'sound_4_19', path: 'local' },
    { id: 'sound_20', name: 'sound_4_20', path: 'local' },
    { id: 'sound_21', name: 'sound_4_21', path: 'local' },
    { id: 'sound_22', name: 'sound_4_22', path: 'local' },
    { id: 'sound_22_2', name: 'sound_4_22_2', path: 'local' },
    
]

var interactions = {}

function S9Clickables(){
    this.gaugeEl = sections[1].querySelector("#s9-gauge");
    this.levelEls = this.gaugeEl.querySelectorAll(".s9-level");
    this.proposalEl = sections[1].querySelector("#s9-proposal");
    this.proposalEls = this.proposalEl.querySelectorAll("p");
    this.clickEls = sections[1].querySelectorAll(".s9-bloc");
    this.datas = [
        [{answer:false},{answer:true},{answer:false},{answer:false}],
        [{answer:true},{answer:false},{answer:false},{answer:false}],
        [{answer:false},{answer:false},{answer:false},{answer:true}],
        [{answer:false},{answer:false},{answer:true},{answer:false}],
        [{answer:true},{answer:false},{answer:false},{answer:false}]
    ]
    this.total = this.datas.length;
    this.reset().render();
}

S9Clickables.prototype = {
    render:function(){
        var self = this;
        var currentEl = this.gaugeEl.querySelector(".current");
        if(currentEl){
            currentEl.classList.remove("current");
        }
        this.levelEls[this.current-1].classList.add("current");
        for(var p=1; p<=this.proposalEls.length; p++){
            if(p==this.current){
                this.proposalEls[p-1].classList.remove("hidden");
            } else {
                this.proposalEls[p-1].classList.add("hidden");
            }
        }
        this.clickable = new Clickables({
            datas:this.datas[this.current-1],
            buttons: this.clickEls,
            cbEnd:this.validate.bind(this),
            correctionAuto: true,
        });
    },
    validate:function(){
        this.levelEls[this.current-1].classList.remove("current");
        if(this.clickable.success==true){
            this.score++;
            this.levelEls[this.current-1].classList.add("right");
        } else {
            this.levelEls[this.current-1].classList.add("wrong");
        }
        this.clickable.dispose();
        if(this.current < this.total){
            this.current++;
            setTimeout(this.render.bind(this),2000);
        } else {
            this.end();
        }
    },
    end:function(){
        this.success = this.score > this.total / 2;
        if(timeline.status=="normal"){
            timeline.play("screen-9-feedback");
        }
    },
    reset:function(){
        this.current = 1;
        this.score = 0;
        this.success = false;
        for(var l=1; l<=this.levelEls.length; l++){
            this.levelEls[l-1].classList.remove("right");
            this.levelEls[l-1].classList.remove("wrong");
        }
        return this;
    }
}