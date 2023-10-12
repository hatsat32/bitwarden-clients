import { mock, MockProxy } from "jest-mock-extended";

import { UserVerificationService } from "@bitwarden/common/auth/abstractions/user-verification/user-verification.service.abstraction";

import { CredentialCreateOptionsView } from "../../views/credential-create-options.view";

import { WebauthnLoginApiService } from "./webauthn-login-api.service";
import { WebauthnLoginService } from "./webauthn-login.service";

describe("WebauthnService", () => {
  let apiService!: MockProxy<WebauthnLoginApiService>;
  let userVerificationService!: MockProxy<UserVerificationService>;
  let credentials: MockProxy<CredentialsContainer>;
  let webauthnService!: WebauthnLoginService;

  beforeAll(() => {
    // Polyfill missing class
    window.PublicKeyCredential = class {} as any;
    window.AuthenticatorAttestationResponse = class {} as any;
    apiService = mock<WebauthnLoginApiService>();
    userVerificationService = mock<UserVerificationService>();
    credentials = mock<CredentialsContainer>();
    webauthnService = new WebauthnLoginService(apiService, userVerificationService, credentials);
  });

  describe("createCredential", () => {
    it("should return undefined when navigator.credentials throws", async () => {
      credentials.create.mockRejectedValue(new Error("Mocked error"));
      const options = createCredentialCreateOptions();

      const result = await webauthnService.createCredential(options);

      expect(result).toBeUndefined();
    });

    it("should return credential when navigator.credentials does not throw", async () => {
      const deviceResponse = createDeviceResponse();
      credentials.create.mockResolvedValue(deviceResponse as PublicKeyCredential);
      const createOptions = createCredentialCreateOptions();

      const result = await webauthnService.createCredential(createOptions);

      expect(result).toEqual({ deviceResponse, createOptions, supportsPrf: false });
    });
  });
});

function createCredentialCreateOptions(): CredentialCreateOptionsView {
  return new CredentialCreateOptionsView(Symbol() as any, Symbol() as any);
}

function createDeviceResponse(): PublicKeyCredential {
  const credential = {
    id: "Y29yb2l1IHdhcyBoZXJl",
    rawId: new Uint8Array([0x74, 0x65, 0x73, 0x74]),
    type: "public-key",
    response: {
      attestationObject: new Uint8Array([0, 0, 0]),
      clientDataJSON: "eyJ0ZXN0IjoidGVzdCJ9",
    },
  } as any;

  Object.setPrototypeOf(credential, PublicKeyCredential.prototype);
  Object.setPrototypeOf(credential.response, AuthenticatorAttestationResponse.prototype);

  return credential;
}
