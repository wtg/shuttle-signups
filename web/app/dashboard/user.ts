import {Shuttle} from './shuttle'
export class User {
  first_name: string;
  username:string;
  numGuests:number;
  guestsOnly:boolean;
  shuttles:Array<Shuttle>;
  constructor(arg?:any){
    console.log("made a user");
    this.first_name = arg && arg.first_name || "Shirley";
    this.username = arg && arg.username || "001RPI";
    this.numGuests = arg && arg.numGuests || 0;
    this.guestsOnly = arg && arg.guestsOnly || false;
    this.shuttles = Array<Shuttle>();
  }
}
