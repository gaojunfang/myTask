let context = {};
function defineGetter(key,property){
    context.__defineGetter__(property,function(){
        return this[key].property;
    })
}
defineGetter('request','path');
defineGetter('request','url');
defineGetter('request','query');
defineGetter('response','body')

function defineSetter(key,property){
    context.__defineSetter__(property,function(value){
        this[key][property] = value
    })
}
defineSetter('response','body');
module.exports = context;