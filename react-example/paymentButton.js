import React, { Component } from 'react'

const getUrl = (production) => production
  ? 'https://pay.datatrans.com/upp/payment/js/payment-button-1.0.0.min.js'
  : 'https://pay.sandbox.datatrans.com/upp/payment/js/payment-button-1.0.0.js'

class PaymentButton extends Component {
  componentDidMount() {
    const scriptSource = getUrl(this.props.production)

    if (document.querySelector('script[src="' + scriptSource + '"]')) {
      this.initPaymentButton()
      return
    }

    const script = document.createElement('script')
    script.src = scriptSource
    script.onload = () => {
      this.initPaymentButton()
    }
    document.body.appendChild(script)
  }

  componentWillUnmount() {
    this.paymentButton.destroy()
  }

  render() {
    return <div id='paybutton' style={{ maxWidth: '400px' }}></div>
  }

  initPaymentButton = () => {
    const { config: { merchantId, merchantName } } = this.props
    this.paymentButton = window.PaymentButton
    this.paymentButton.init({
      merchantId,
      merchantName,
      useGooglePay: false,
      useApplePay: false,
      auto: true,
      autoSettle: false,
      tokenOnly:false,
      allowedCardNetworks: ['AMEX', 'DISCOVER', 'MASTERCARD', 'VISA'],
      googlePayConfiguration: {
        buttonType: 'long',
        buttonStyle: 'black',
        merchantId: '01234567890123456789'
      },
      applePayConfiguration: {
        buttonType: 'plain',
        buttonStyle: 'black'
      }
    })

    this.bindPaymentButtonEvents()
  }

  bindPaymentButtonEvents = () => {
    const { config: { payment } } = this.props

    this.paymentButton.on('init', () => {
      this.paymentButton.create(document.getElementById('paybutton'), payment)
    })
    // bind other events here create
    // this.paymentButton.on('authorization', () => {})
    // this.paymentButton.on('abort', () => {})
    // this.paymentButton.on('error', () => {})
    // this.paymentButton.on('token', () => {})
    // this.paymentButton.on('unsupported', () => {})
  }
}

export default PaymentButton
