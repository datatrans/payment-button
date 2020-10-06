import React, { useState } from 'react'
import ReactDOM from 'react-dom'

// import PaymentButton from './paymentButton'
import PaymentButtonWithHook from './PaymentButtonWithHook'

const OPTIONS = {
  merchantId: '1000011011',
  merchantName: 'Test',
  options: {
    allowedCardNetworks: ['MASTERCARD', 'VISA'],
  },
  payment: {
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
    },
  },
}

const App = () => {
  const [isToggled, setToggled] = useState(true)

  return (
    <>
      <h1
        style={{
          fontFamily: '"Volte-Medium", "Helvetica Neue", Helvetica, Arial',
          color: '#213d62',
        }}
      >
        Datatrans Payment Button
      </h1>
      <h2
        style={{
          fontFamily: '"Volte-Medium", "Helvetica Neue", Helvetica, Arial',
          color: '#213d62',
        }}
      >
        with React
      </h2>

      <button onClick={() => setToggled(!isToggled)}>toggle</button>

      {/* <PaymentButton {...OPTIONS} /> */}
      {isToggled && <PaymentButtonWithHook {...OPTIONS} />}
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
