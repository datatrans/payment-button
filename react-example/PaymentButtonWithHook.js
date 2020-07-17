import React, { useCallback, useEffect, useRef, useState } from 'react'

const getUrl = (production) =>
  production
    ? 'https://pay.datatrans.com/upp/payment/js/payment-button-1.0.0.min.js'
    : 'https://pay.sandbox.datatrans.com/upp/payment/js/payment-button-1.0.0.js'

const DEFAULT_OPTIONS = {
  useGooglePay: false,
  useApplePay: false,
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
  const paymentButton = window?.PaymentButton

  useEffect(() => {
    if (isLoaded && !hasError && paymentButton && payButton) {
      paymentButton.on('init', () => {
        paymentButton.create(payButton.current, payment)
      })

      // bind other events:
      // paymentButton.on("authorization", () => {});
      // paymentButton.on('abort', () => {})
      // paymentButton.on("error", () => {});
      // paymentButton.on('token', () => {})
      // paymentButton.on('unsupported', () => {})

      paymentButton.init({
        ...DEFAULT_OPTIONS,
        ...options,
        merchantId,
        merchantName,
      })

      return () => paymentButton.destroy()
    }

    return () => {}
  }, [isLoaded, hasError, paymentButton, payButton])

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
