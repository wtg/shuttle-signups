import {User} from './user';
/*
Schema derived from the mongodb backend schema.
*/
export class Shuttle {
  _id:string;
  group: string,
  isActive: boolean;
  destination: String;
  maxCapacity: number;
  vacancies: number;
  guestsAllowed: number;
  riders: Array<User>;
  waitlist: Array<User>;
  message:string;
  departureDateTime: Date;
  constructor(arg?:any){
    console.log("Shuttle created.");
    this._id= arg && arg._id || "";
    this.destination = arg && arg.destination;
    this.group = arg && arg.group || "";
    this.isActive= arg && arg.isActive || false;
    this.maxCapacity= arg && arg.maxCapacity || 0;
    this.vacancies= arg && arg.vacancies || 0;
    this.guestsAllowed= arg && arg.guestsAllowed || 0;
    this.riders= arg && arg.riders || [];
    this.waitlist= arg && arg.waitlist || [];
    this.message= arg && arg.message || "";
    this.departureDateTime = arg && arg.departureDateTime || new Date();
  }
}
