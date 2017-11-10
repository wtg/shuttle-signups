/*
Schema derived from the mongodb backend schema.
*/
export class ShuttleGroup {
  _id:string;
  isActive: boolean;
  destination: Array<any>;
  origin: Array<any>;
  showMore: boolean; // only necessary for frontend
  destinationPhoto: String;
  notes: String;
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
    this.destinationPhoto = arg && arg.destinationPhoto || "";
    this.notes = arg && arg.notes || "";
  }
}
