# Datatrans Payment-Button

Javascript for merchants that supports the rendering of payment buttons and authorization via our CORS Endpoint. Currently ApplePay and GooglePay are supported.


## Events

The Javascript has following events which can be subscribed to using the "on" method.

- initialized --> emitted when the library is ready
- created --> emitted when a payment button was rendered
- authorization --> emitted when the authorization process has completed
- abort --> emitted when the payment request was aborted
- error --> emitted when an error happens
- unsupported -->  emitted when no payment method is supported

## Usage

```
 PaymentButton.init({
  merchantId: '1100002476',
  merchantName: 'Test',
  useGooglePay: false,
  useApplePay: false,
  auto: true,
  allowedCardNetworks: ['AMEX', 'DISCOVER', 'MASTERCARD', 'VISA'],
  googlePayConfiguration: {
    buttonType: "long",
    buttonStyle: "black",
    merchantId: "01234567890123456789"
  },
  applePayConfiguration: {
    merchantIdentifier: "merchant.ch.datatrans.wallet",
    validationURL: "https://apple-pay-endpoint-datatrans.herokuapp.com/api/session/create",
    buttonType: "plain",
    buttonStyle: "black"
  }
});

PaymentButton.on("init", function () {
	$(".console-content").append("init event dispatched <br>");
	PaymentButton.create(document.getElementById('paybutton'), payment)
 });
PaymentButton.on("create", function () { $(".console-content").append("create event dispatched <br>") });
PaymentButton.on("authorization", function (response) {
      $(".console-content").append("authorization response:" + "<br>" + response + "<br>");
});
PaymentButton.on("abort", function () {
      $(".console-content").append("Payment request aborted" + "<br>")
});
PaymentButton.on("error", function (error) {
    $(".console-content").append("Error:" + JSON.stringify(error) + "<br>")
 });

PaymentButton.on("unsupported", function () {
    $(".console-content").append("Payment method not supported in this browser <br>")
});

```
