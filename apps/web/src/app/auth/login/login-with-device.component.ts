import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { LoginWithDeviceComponent as BaseLoginWithDeviceComponent } from "@bitwarden/angular/auth/components/login-with-device.component";
import { AnonymousHubService } from "@bitwarden/common/abstractions/anonymousHub.service";
import { ApiService } from "@bitwarden/common/abstractions/api.service";
import { AuthService } from "@bitwarden/common/auth/abstractions/auth.service";
import { LoginService } from "@bitwarden/common/auth/abstractions/login.service";
import { AppIdService } from "@bitwarden/common/platform/abstractions/app-id.service";
import { CryptoFunctionService } from "@bitwarden/common/platform/abstractions/crypto-function.service";
import { CryptoService } from "@bitwarden/common/platform/abstractions/crypto.service";
import { EnvironmentService } from "@bitwarden/common/platform/abstractions/environment.service";
import { I18nService } from "@bitwarden/common/platform/abstractions/i18n.service";
import { LogService } from "@bitwarden/common/platform/abstractions/log.service";
import { PlatformUtilsService } from "@bitwarden/common/platform/abstractions/platform-utils.service";
import { ValidationService } from "@bitwarden/common/platform/abstractions/validation.service";
import { Utils } from "@bitwarden/common/platform/misc/utils";
import { PasswordGenerationServiceAbstraction } from "@bitwarden/common/tools/generator/password";

import { RouterService, StateService } from "../../core";

@Component({
  selector: "app-login-with-device",
  templateUrl: "login-with-device.component.html",
})
export class LoginWithDeviceComponent
  extends BaseLoginWithDeviceComponent
  implements OnInit, OnDestroy
{
  constructor(
    router: Router,
    cryptoService: CryptoService,
    cryptoFunctionService: CryptoFunctionService,
    appIdService: AppIdService,
    passwordGenerationService: PasswordGenerationServiceAbstraction,
    apiService: ApiService,
    authService: AuthService,
    logService: LogService,
    environmentService: EnvironmentService,
    i18nService: I18nService,
    platformUtilsService: PlatformUtilsService,
    anonymousHubService: AnonymousHubService,
    validationService: ValidationService,
    stateService: StateService,
    loginService: LoginService,
    private routerService: RouterService
  ) {
    super(
      router,
      cryptoService,
      cryptoFunctionService,
      appIdService,
      passwordGenerationService,
      apiService,
      authService,
      logService,
      environmentService,
      i18nService,
      platformUtilsService,
      anonymousHubService,
      validationService,
      stateService,
      loginService
    );
    this.onSuccessfulLogin = this.goAfterLogIn;
  }

  async goAfterLogIn() {
    this.loginService.clearValues();
    let previousUrl = await this.routerService.getPersistedUrl();
    if (Utils.isNullOrEmpty(previousUrl)) {
      previousUrl = this.routerService.getPreviousUrl();
    }
    if (previousUrl) {
      this.stateService.setPreviousUrl(null);
      this.router.navigateByUrl(previousUrl);
    } else {
      this.router.navigate([this.successRoute]);
    }
  }
}
