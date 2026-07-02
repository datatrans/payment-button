import React, { useCallback, useEffect, useRef, useState } from 'react'

const getUrl = (production) =>
  production
    ? 'https://pay.datatrans.com/upp/payment/js/payment-button-3.0.0.js'
    : 'https://pay.sandbox.datatrans.com/upp/payment/js/payment-button-3.0.0.js'

const DEFAULT_OPTIONS = {
  useGooglePay: true,
  useApplePay: true,
  auto: true,
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
  },
}

const cachedScripts = []

const useScript = ({
  src,
  callback = () => {},
  async = true,
  defer = true,
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  const handleLoaded = useCallback(() => {
    setIsLoaded(true)
    if (callback) {
      callback()
    }
  }, [setIsLoaded, callback])

  const handleError = useCallback(() => setHasError(true), [setHasError])

  useEffect(() => {
    if (cachedScripts.includes(src)) {
      handleLoaded()
      return () => {}
    }
    cachedScripts.push(src)

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = src
    script.async = async
    script.defer = defer

    script.addEventListener('load', handleLoaded)
    script.addEventListener('error', handleError)

    document.body.appendChild(script)

    return () => {
      script.removeEventListener('load', handleLoaded)
      script.removeEventListener('error', handleError)
    }
  }, [src, async, defer, handleLoaded, handleError])

  return [isLoaded, hasError]
}

const useAppleOrGooglePay = ({
  merchantId,
  merchantName,
  options,
  payment,
  production,
}) => {
  const scriptSource = getUrl(production)
  const [isLoaded, hasError] = useScript({ src: scriptSource })
  const payButton = useRef(null)

  useEffect(() => {
    const PaymentButton = window.PaymentButton
    if (
      !isLoaded ||
      hasError ||
      !payButton.current ||
      typeof PaymentButton !== 'function'
    ) {
      return () => {}
    }

    const paymentButton1 = new PaymentButton()

    paymentButton1.on('init', () => {
      paymentButton1.create(payButton.current, payment)
    })

    // bind other events:
    // paymentButton1.on("authorization", () => {})
    // paymentButton1.on('abort', () => {})
    paymentButton1.on('error', (err) => {
      console.error(err)
    })
    // paymentButton1.on('token', () => {})
    // paymentButton1.on('unsupported', () => {})

    paymentButton1.init({
      ...DEFAULT_OPTIONS,
      ...options,
      merchantId,
      merchantName,
    })

    return () => {
      if (typeof paymentButton1.destroy === 'function') {
        paymentButton1.destroy()
      }
    }
  }, [isLoaded, hasError, merchantId, merchantName, options, payment])

  return [payButton]
}

const PaymentButtonWithHook = ({
  merchantId,
  merchantName,
  options,
  payment,
  production,
}) => {
  const [payButton] = useAppleOrGooglePay({
    merchantId,
    merchantName,
    options,
    payment,
    production,
  })

  return <div ref={payButton} style={{ maxWidth: '400px' }} />
}

export default PaymentButtonWithHook
