"use strict";
class User {
    constructor(arg) {
        console.log("User created.");
        this.first_name = arg && arg.first_name || "Shirley";
        this.username = arg && arg.username || "001RPI";
        this.numGuests = arg && arg.numGuests || 0;
        this.guestsOnly = arg && arg.guestsOnly || false;
        this.shuttles = Array();
    }
}
exports.User = User;
