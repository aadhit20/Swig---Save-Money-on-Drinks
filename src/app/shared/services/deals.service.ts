import { map } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";
import { Injectable } from "@angular/core";
import { Deals } from "../types/deals.type";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DealsService {
  constructor(private afs: AngularFirestore) {}

  public getAllDeals() {
    return this.afs
      .collection("deals", (ref) => ref.where("isActive", "==", true))
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

  public getAllFeaturedDeals() {
    return this.afs
      .collection("deals", (ref) =>
        ref.where("isFeatured", "==", true).where("isActive", "==", true)
      )
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

  public getDealDetails(id): Observable<any> {
    return new Observable<any>((observer) => {
      const docRef = this.afs.doc(`deals/${id}`);
      const userData = docRef.get().subscribe(
        (res: any) => {
          observer.next(res.data());
          observer.complete();
        },
        (err) => {
          observer.error(err);
        }
      );
    });
  }

  updateDeal(id, values): Observable<any> {
    return new Observable<any>((observer) => {
      const docRef = this.afs.doc(`deals/${id}`);
      docRef.update(values).then(
        (res) => {
          observer.next(res);
          observer.complete();
        },
        (err) => {
          observer.error(err);
        }
      );
    });
  }
}
