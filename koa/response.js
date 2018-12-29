let response = {
    set body(value){
        this.res.statusCode = 200;
        this._body = value;
    },
    get body(){
        return this._body;
    }
};
// ctx.body = ctx.response.body;
module.exports = response;