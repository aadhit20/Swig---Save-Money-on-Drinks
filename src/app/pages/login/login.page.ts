import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { NavigationExtras, Router } from "@angular/router";
import { LoadingController, AlertController } from "@ionic/angular";
import { AuthenticateService } from "src/app/shared/services/authentication.service";
import { UserService } from "src/app/shared/services/user.service";
import { Plugins } from "@capacitor/core";

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

  async handleLoginUser() {
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
            this.router.navigate(["/tabs/home"]);
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
    } else {
      const alert = await this.alertCtrl.create({
        header: "Alert",
        message: "Please check whether all the fields are correct and valid",
        buttons: ["OK"],
      });

      await alert.present();
    }
  }

  async facebookLogin(): Promise<void> {
    const FACEBOOK_PERMISSIONS = ["public_profile", "email"];

    const result = await Plugins.FacebookLogin.login({
      permissions: FACEBOOK_PERMISSIONS,
    });
    if (result && result.accessToken) {
      console.log(result);

      let user = {
        token: result.accessToken.token,
        userId: result.accessToken.userId,
      };
      // let navigationExtras: NavigationExtras = {
      //   queryParams: {
      //     userinfo: JSON.stringify(user),
      //   },
      // };
      const response = await fetch(
        `https://graph.facebook.com/${user.userId}?fields=id,name,gender,first_name,last_name,email,link,picture&type=large&access_token=${user.token}`
      );
      const myJson = await response.json();
      const email = myJson.email;

      this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
        loadingEl.present();
        this.userService.getUserDetailsById(email).subscribe(async (res) => {
          if (res) {
            console.log("logged user");
            localStorage.setItem("email", email);
            localStorage.setItem("isFacebookLogin", "true");
            this.router.navigate(["/tabs/home"]);
            loadingEl.dismiss();
          } else {
            loadingEl.dismiss();
            const alert = await this.alertCtrl.create({
              header: "Error",
              message: "Please signup first",
              buttons: ["OK"],
            });

            await alert.present();
          }
        });
      });
    }
  }
}
