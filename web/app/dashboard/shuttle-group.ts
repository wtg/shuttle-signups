/*
Schema derived from the mongodb backend schema.
*/
export class ShuttleGroup {
  _id:string;
  isActive: boolean;
  destination: Array<any>;
  origin: Array<any>;
  showMore: boolean; // only necessary for frontend
  shuttles: Array<string>;
  constructor(arg?:any){
    console.log("ShuttleGroup created.");
    this._id= arg && arg._id || "fillme";
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
    this.showMore = false;
    this.shuttles = arg && arg.shuttles || [];
  }
}
