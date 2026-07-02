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

let taxItem = {
  label: 'Tax',
  amount: { value: '2.50', currency: 'USD' }
};

const payment = {
  // W3C spec
  details: {
    total: {
      label: 'My Merchant',
      amount: { value: '4', currency: 'USD' },
    },
    displayItems: [
      taxItem
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
  if (typeof PaymentButton !== 'function') {
    console.error('PaymentButton library is not loaded');
    return;
  }

  const paymentButton1 = new PaymentButton();

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
      paymentButton1.create(document.getElementById('paybutton'), payment);
    }

    if (data.target.id === 'amount') {
      payment.details.total.amount.value = data.target.value;
      paymentButton1.create(document.getElementById('paybutton'), payment);
    }

    if (data.target.id === 'currency') {
      payment.details.total.amount.currency = data.target.value;
      taxItem.amount.currency = data.target.value;
      paymentButton1.create(document.getElementById('paybutton'), payment);
    }

    if (data.target.id === 'merchantName') {
      const merchantName = data.target.value;

      payment.details.total.label = data.target.value;

      paymentButton1.init({
        ...buttonOptions,
        merchantName
      });
    }

    if (data.target.id === 'useApplePay') {
      $('#paybutton').empty();
      const options = data.target.checked ? { useGooglePay: false, useApplePay: true } : {}
      paymentButton1.init({
        ...buttonOptions,
        ...options
      })
    }

    if (data.target.id === 'useGooglePay') {
      $('#paybutton').empty();
      const options = data.target.checked ? { useGooglePay: true, useApplePay: false } : {}
      paymentButton1.init({
        ...buttonOptions,
        ...options
      })
    }

    if (data.target.id === 'tokenOnly') {
      $('#paybutton').empty();
      paymentButton1.init({
        ...buttonOptions,
        tokenOnly: !!data.target.checked
      })
    }

    if (data.target.id === 'createAlias') {
      payment.transaction.createAlias = true;
      paymentButton1.create(document.getElementById('paybutton'), payment);
    }
  });

  $('#clearButton').click(() => $('.console-content').empty());

  paymentButton1.init(buttonOptions);

  paymentButton1.on('init', function () {
    $('.console-content').append('init event dispatched <br>');
    paymentButton1.create(document.getElementById('paybutton'), payment);
  });

  paymentButton1.on('create', () => consoleOutput('create'))
  paymentButton1.on('authorization', response => consoleOutput('authorization', response))
  paymentButton1.on('abort', () => consoleOutput('abort'))
  paymentButton1.on('error', response => consoleOutput('error', response))
  paymentButton1.on('token', response => consoleOutput('token', response?.token))
  paymentButton1.on('unsupported', () => consoleOutput('unsupported'))
});
