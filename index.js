const EVENTS = {
  init: 'init event dispatched',
  create: 'create event dispatched',
  authorization: 'authorization response: ',
  abort: 'Payment request aborted',
  error: 'Error: ',
  token: 'Token: ',
  unsupported: 'Payment method not supported in this browser'
}

const consoleOutput = (e, response) => {
  window.test = response
  const formattedResponse = (response ? '</div>' +
    '<div class="column col-ml-auto"><pre class="code-wrapper"><code class="language-javascript">' +
    JSON.stringify(response) +
    '</code></pre>' : '')

  $('.console-content').append('<div class="columns col-oneline"><div class="column col-auto">' + EVENTS[e] + formattedResponse + '</div></div>');
  document.querySelector('.console-content').scrollTop = document.querySelector('.console-content').scrollHeight;
};

const payment = {
  // W3C spec
  details: {
    total: {
      label: 'My Merchant',
      amount: { value: '4', currency: 'USD' },
    },
    displayItems: [
      {
        label: 'Tax',
        amount: { value: '2.50', currency: 'USD' },
      },
    ],
  },
  // W3C spec
  options: {
    requestPayerEmail: false,
    requestPayerName: false,
    requestPayerPhone: false,
  },
  // Datatrans specific
  transaction: {
    countryCode: 'CH',
    refno: '3e23dasdasd1123',
    createAlias: false,
  },
};

const buttonOptions = {
  merchantId: '1000011011',
  merchantName: 'Test',
  autoSettle: false,
  tokenOnly: false,
  allowedCardNetworks: ['AMEX', 'DISCOVER', 'MASTERCARD', 'VISA'],
  googlePayConfiguration: {
    buttonType: 'long',
    buttonStyle: 'black',
    merchantId: '01234567890123456789',
  },
  applePayConfiguration: {
    buttonType: 'plain',
    buttonStyle: 'black',
  }
}

$(document).ready(function () {
  const PaymentButton = window.PaymentButton;

  $('#configForm').change(function (data) {
    if (
      data.target.type === 'checkbox' &&
      data.target.id !== 'useApplePay' &&
      data.target.id !== 'useGooglePay' &&
      data.target.id !== 'tokenOnly'
    ) {
      if (data.target.checked === true) {
        payment.options[data.target.id] = true;
      } else {
        payment.options[data.target.id] = false;
      }
      PaymentButton.create(document.getElementById('paybutton'), payment);
    }

    if (data.target.id === 'amount') {
      payment.details.total.amount.value = data.target.value;
      PaymentButton.create(document.getElementById('paybutton'), payment);
    }

    if (data.target.id === 'currency') {
      payment.details.total.amount.currency = data.target.value;
      PaymentButton.create(document.getElementById('paybutton'), payment);
    }

    if (data.target.id === 'merchantName') {
      const merchantName = data.target.value;

      payment.details.total.label = data.target.value;

      PaymentButton.init({
        ...buttonOptions,
        merchantName
      });
    }

    if (data.target.id === 'useApplePay') {
      $('#paybutton').empty();
      const options = data.target.checked ? { useGooglePay: false, useApplePay: true } : {}
      PaymentButton.init({
        ...buttonOptions,
        ...options
      })
    }

    if (data.target.id === 'useGooglePay') {
      $('#paybutton').empty();
      const options = data.target.checked ? { useGooglePay: true, useApplePay: false } : {}
      PaymentButton.init({
        ...buttonOptions,
        ...options
      })
    }

    if (data.target.id === 'tokenOnly') {
      $('#paybutton').empty();
      PaymentButton.init({
        ...buttonOptions,
        tokenOnly: !!data.target.checked
      })
    }

    if (data.target.id === 'createAlias') {
      payment.transaction.createAlias = true;
      PaymentButton.create(document.getElementById('paybutton'), payment);
    }
  });

  $('#clearButton').click(() => $('.console-content').empty());

  PaymentButton.init(buttonOptions);

  PaymentButton.on('init', function () {
    $('.console-content').append('init event dispatched <br>');
    PaymentButton.create(document.getElementById('paybutton'), payment);
  });

  PaymentButton.on('create', () => consoleOutput('create'))
  PaymentButton.on('authorization', response => consoleOutput('authorization', response))
  PaymentButton.on('abort', () => consoleOutput('abort'))
  PaymentButton.on('error', response => consoleOutput('error', response))
  PaymentButton.on('token', response => consoleOutput('token', response?.token))
  PaymentButton.on('unsupported', () => consoleOutput('unsupported'))
});
