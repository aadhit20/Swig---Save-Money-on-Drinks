import { AlertController, LoadingController } from "@ionic/angular";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.page.html",
  styleUrls: ["./forgot-password.page.scss"],
})
export class ForgotPasswordPage implements OnInit {
  forgotPasswordForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private afAuth: AngularFireAuth,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ])
      ),
    });
  }

  async resetPasswordInit() {
    if (this.forgotPasswordForm.get("email").valid) {
      this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
        loadingEl.present();
        return this.afAuth
          .sendPasswordResetEmail(this.forgotPasswordForm.value.email)
          .then(
            async () => {
              loadingEl.dismiss();
              this.forgotPasswordForm.reset();
              const alert = await this.alertCtrl.create({
                header: "Done",
                message:
                  "A password reset link has been sent to your email address",
                buttons: ["Ok"],
              });
              await alert.present();
            },

            async (rejectionReason) => {
              this.forgotPasswordForm.reset();
              loadingEl.dismiss();
              const alert = await this.alertCtrl.create({
                header: "Error",
                message: rejectionReason,
                buttons: ["Ok"],
              });
              await alert.present();
            }
          )
          .catch(async (e) => {
            this.forgotPasswordForm.reset();
            loadingEl.dismiss();
            const alert = await this.alertCtrl.create({
              header: "Error",
              message:
                "An error occurred while attempting to reset your password",
              buttons: ["Ok"],
            });
            await alert.present();
          });
      });
    } else {
      const alert = await this.alertCtrl.create({
        header: "Invalid email",
        message: "Please enter a valid email address",
        buttons: ["Ok"],
      });
      await alert.present();
    }
  }
}
