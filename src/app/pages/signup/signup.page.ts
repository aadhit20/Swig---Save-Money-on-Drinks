import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { AuthenticateService } from "src/app/shared/services/authentication.service";
import { UserService } from "src/app/shared/services/user.service";
import { ValidatorService } from "src/app/shared/services/validation.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.page.html",
  styleUrls: ["./signup.page.scss"],
})
export class SignupPage implements OnInit {
  errorMessage;
  signupForm: FormGroup;
  successMessage: string = "";
  showWarnings: boolean = false;
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
    confirm_password: [
      { type: "required", message: "Confirm password is required." },
      {
        type: "minlength",
        message: "Password must be at least 6 characters long.",
      },
      {
        type: "isNotMatching",
        message: "Passwords didn't match",
      },
    ],
  };

  constructor(
    private authService: AuthenticateService,
    private formBuilder: FormBuilder,
    private router: Router,
    private validatorService: ValidatorService,
    private alertController: AlertController,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
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
      confirm_password: new FormControl(
        "",
        Validators.compose([
          this.validatorService.matchValues("password"),
          Validators.required,
        ])
      ),
      gtc: new FormControl(false),
      fname: new FormControl("", Validators.compose([Validators.required])),
      lname: new FormControl("", Validators.compose([Validators.required])),
      age: new FormControl("", Validators.compose([Validators.required])),
    });
  }

  async handleSignUp() {
    this.showWarnings = true;
    if (this.signupForm.valid) {
      if (this.signupForm.value["gtc"]) {
        let userDetails = {
          email: this.signupForm.value.email,
          password: this.signupForm.value.password,
        };

        this.authService.registerUser(userDetails).then(
          (res) => {
            console.log(res);

            this.router.navigate(["/login"]);
          },
          async (err) => {
            this.errorMessage = err.message;
            const alert = await this.alertController.create({
              cssClass: "my-custom-class",
              header: "Alert",
              message:
                "Sign Up Failed. Please sign in if you already have an account.",
              buttons: ["OK"],
            });

            await alert.present();
          }
        );
      } else {
        const alert = await this.alertController.create({
          header: "Error",
          message: "Please accept the general terms & conditions",
          buttons: ["Okay"],
        });
        await alert.present();
      }
    } else {
      const alert = await this.alertController.create({
        header: "Alert",
        message: "Please check whether all the fields are correct and valid",
        buttons: ["OK"],
      });

      await alert.present();
    }
  }
}
