import { AngularFirestore } from "@angular/fire/firestore";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Subscription } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserSubscriptionsService {
  profileSubscription: Subscription;

  constructor(private afs: AngularFirestore) {}

  onLoginLoad() {
    this.profileSubscription = this.loadCurrentUserDetails().subscribe(
      (res) => {}
    );
  }

  public loadCurrentUserDetails() {
    let email = localStorage.getItem("email");
    return this.afs
      .doc(`users/${email}`)
      .snapshotChanges()
      .pipe(
        map((changes) => {
          let data = changes.payload.data();

          return data;
        })
      );
  }
}
