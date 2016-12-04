import {User} from './user';
export class Shuttle {
  _id:string;
  isActive: boolean;
  maxCapacity: number;
  vacancies: number;
  guestsAllowed: number;
  riders: Array<User>;
  waitlist: Array<User>;
  destination: Array<any>;
  origin: Array<any>;
  message:string;
  constructor(arg?:any){
    console.log("made a shuttle");
    this._id= arg && arg._id || "fillme";
    this.isActive= arg && arg.isActive || false;
    this.maxCapacity= arg && arg.maxCapacity || 0;
    this.vacancies= arg && arg.vacancies || 0;
    this.guestsAllowed= arg && arg.guestsAllowed || 0;
    this.riders= arg && arg.riders || [];
    this.waitlist= arg && arg.waitlist || [];
    this.destination= arg && arg.destination || [
        {
          "longitude": null,
          "latitude": null,
          "name": "No Where"
        }
      ];
    this.origin= arg && arg.origin || [
        {
          "longitude": null,
          "latitude": null,
          "name": "No Where"
        }
      ];
    this.message= arg && arg.message || "nothing";

  }
}
