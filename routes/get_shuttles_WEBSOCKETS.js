module.exports = get_shuttles;
function get_shuttles(ws, req) {
    ws.on('message', function(msg) {
        console.log("TEST");
    });
};
