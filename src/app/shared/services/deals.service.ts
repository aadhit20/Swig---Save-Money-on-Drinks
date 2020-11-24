import { map } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";
import { Injectable } from "@angular/core";
import { Deals } from "../types/deals.type";

@Injectable({
  providedIn: "root",
})
export class DealsService {
  constructor(private afs: AngularFirestore) {}

  public getAllDeals() {
    return this.afs
      .collection("deals")
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Deals;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }
}
