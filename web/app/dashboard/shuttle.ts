import {User} from './user';
export class Shuttle {
  isActive: boolean;
  maxCapacity: number;
  vacancies: number;
  guestsAllowed: number;
  riders: Array<User>;
  waitlist: Array<User>;
  destination: Array<any>;
  origin: Array<any>;
}
