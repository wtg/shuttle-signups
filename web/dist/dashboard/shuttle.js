"use strict";
class Shuttle {
    constructor(arg) {
        console.log("Shuttle created.");
        this._id = arg && arg._id || "fillme";
        this.isActive = arg && arg.isActive || false;
        this.maxCapacity = arg && arg.maxCapacity || 0;
        this.vacancies = arg && arg.vacancies || 0;
        this.guestsAllowed = arg && arg.guestsAllowed || 0;
        this.riders = arg && arg.riders || [];
        this.waitlist = arg && arg.waitlist || [];
        this.destination = arg && arg.destination || [
            {
                "longitude": null,
                "latitude": null,
                "name": "No Where"
            }
        ];
        this.origin = arg && arg.origin || [
            {
                "longitude": null,
                "latitude": null,
                "name": "No Where"
            }
        ];
        this.message = arg && arg.message || "nothing";
    }
}
exports.Shuttle = Shuttle;
