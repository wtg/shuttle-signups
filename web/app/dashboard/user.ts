import {Shuttle} from './shuttle'
export class User {
  first_name: string;
  last_name:string;
  username:string;
  numGuests:number;
  guestsOnly:boolean;
  shuttles:Array<Shuttle>;
  isAdmin: boolean;
  constructor(arg?:any){
    console.log("User created.");
    this.first_name = arg && arg.first_name;
    this.last_name = arg && arg.last_name;
    this.username = arg && arg.username;
    this.numGuests = arg && arg.numGuests;
    this.guestsOnly = arg && arg.guestsOnly;
    this.shuttles = Array<Shuttle>();
    this.isAdmin = arg && arg.isAdmin;
  }
}
