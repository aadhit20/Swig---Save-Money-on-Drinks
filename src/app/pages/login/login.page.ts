import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { LoadingController, AlertController } from "@ionic/angular";
import { AuthenticateService } from "src/app/shared/services/authentication.service";
import { UserService } from "src/app/shared/services/user.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  userDetails = {
    email: "",
    password: "",
  };
  showWarnings: boolean = false;
  loginForm: FormGroup;

  validation_messages = {
    email: [
      { type: "required", message: "Email is required." },
      { type: "pattern", message: "Enter a valid email." },
    ],
    password: [
      { type: "required", message: "Password is required." },
      {
        type: "minlength",
        message: "Password must be at least 6 characters long.",
      },
    ],
  };
  constructor(
    private router: Router,
    public loadingController: LoadingController,
    private authService: AuthenticateService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ])
      ),
      password: new FormControl(
        "",
        Validators.compose([Validators.minLength(6), Validators.required])
      ),
    });
  }

  handleSignUpClick() {
    this.router.navigate(["/signup"]);
  }

  // resetPasswordInit() {
  //   if (this.signin_form.get('email').valid) {
  //     return this.afAuth
  //       .sendPasswordResetEmail(this.signin_form.value.email)
  //       .then(
  //         () =>
  //           this.alertService.presentAlert(
  //             'Invalid email',
  //             'A password reset link has been sent to your email address',
  //             ['Ok'],
  //             ''
  //           ),
  //         (rejectionReason) =>
  //           this.alertService.presentAlert(
  //             'Invalid email',
  //             rejectionReason,
  //             ['Ok'],
  //             ''
  //           )
  //       )
  //       .catch((e) =>
  //         this.alertService.presentAlert(
  //           'Invalid email',
  //           'An error occurred while attempting to reset your password',
  //           ['Ok'],
  //           ''
  //         )
  //       );
  //   } else {
  //     this.alertService.presentAlert(
  //       'Invalid email',
  //       'Please enter a valid email address',
  //       ['Ok'],
  //       ''
  //     );
  //   }
  // }

  handleLoginUser() {
    this.showWarnings = true;
    if (this.loginForm.valid) {
      this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
        loadingEl.present();
        let userDetails = {
          email: this.loginForm.value.email,
          password: this.loginForm.value.password,
        };
        this.authService.loginUser(userDetails).then(
          (res) => {
            loadingEl.dismiss();
            console.log(res);
            localStorage.setItem("email", this.loginForm.value.email);
            this.router.navigate(["/home"]);
          },
          async (err) => {
            loadingEl.dismiss();
            const alert = await this.alertCtrl.create({
              header: "Invalid credentials",
              message: "Please enter valid username and password and try again",
              buttons: ["Okay"],
            });
            await alert.present();
          }
        );
      });
    }
  }
}
