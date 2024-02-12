import { useState } from 'react';
import './App.css';

function App() {
  const [link, SetLink] = useState('');
  const [isopen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    amount: '',
    eventDate: '',
    description: '',
    customerCompany: '',
    companyContact: '',
    customerName: '',
  });
  const [showLoader, setShowLoader] = useState(false);

  // on copy button clicked
  const handleCopyLink = async (e) => {
    try {
      await navigator.clipboard.writeText(link);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Unable to copy link: ', err);
    }
  };
  
  // on details change
  const handleInputChange = (e) => {
    const { name, value } = e.target || {};
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // submit function
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowLoader(true);

    // action
    const { amount, customerName, description } = formData;
    fetch('https://zbryjx4e2c.execute-api.us-east-2.amazonaws.com/prod/stripe2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount,
        customerName: customerName,
        description: " ", //removing description here can add later by passing it.
        success_url: 'https://example.com/success', // Replace with actual success URL
        cancel_url: 'https://example.com/cancel', // Replace with actual cancel URL
      })
    })
      .then(response => response.json())
      .then(data => {
        // Display the Stripe payment link
        if (data && data.paymentLink) {
          // const generateButton = document.getElementById('generateButton');
          // generateButton.innerText = 'Create Payment Link';
          // generateButton.onclick = function () {
          //   window.open(data.paymentLink, '_blank');
          // };
          setIsOpen(true);
          SetLink(data.paymentLink)
        } else {
          // Handle any errors that don't throw an exception but result in no link
          document.getElementById('invoiceLink').innerText = 'Error generating invoice. No payment link was returned.';
        }
        setShowLoader(false);
      })
      .catch(error => {
        console.error('Error:', error);
        document.getElementById('invoiceLink').innerText = 'Error generating invoice.';
      });
  }
  const areAllfieldPresent = formData?.amount !== '' && formData?.eventDate !== '' && formData?.description !== '' && formData?.customerCompany !== '' && formData?.companyContact !== '' && formData?.customerName !== ''
  return (
    <div className="App">
      <header className="App-header">
        <div className="header-logo">
          <h1>BUYOUT</h1>
        </div>
      </header>
      <div className="container">
        <div className="header">
          <h1 className="title">Send a Payment Request</h1>
          <p>from Kings Dining & Entertainment</p>
        </div>
        <form id="invoiceForm" onSubmit={(e)=>handleSubmit(e)}>
          <div className="row">
            <div className="input-form input-row">
              <span className='dollar-icon'>$</span>
              <input type="number" id="amount" name="amount" onChange={handleInputChange} value={formData.amount} placeholder="Requested Payment Amount" />
            </div>
            <div className="input-form">

              <input
                name="eventDate"
                onChange={handleInputChange}
                value={formData.eventDate}
                placeholder="Event Date"
                className="textbox-n"
                type="text"
                onFocus={(e) => {
                  e.target.type = "date"
                }}
                onBlur={(e) => {
                  if (!e.target.value) {
                    e.target.type = 'text';
                  }
                }}
                id="eventDate"
              />
            </div>
          </div>

          <div className="description-box">
            <textarea id="description" name="description" onChange={handleInputChange} value={formData.description}
              placeholder="Description - For Internal Records"></textarea>
          </div>

          <div className="single-col">
            <input type="text" id="customerCompany" name="customerCompany" onChange={handleInputChange} value={formData.customerCompany} placeholder="Customer Company" />
          </div>
          <div className="single-col">
            <input type="text" id="companyContact" name="companyContact" onChange={handleInputChange} value={formData.companyContact} placeholder="Company Point of Contact" />
          </div>

          <input type="text" id="customerName" name="customerName" onChange={handleInputChange} value={formData.customerName} placeholder="Event Name" />

          <div className="button-container">
            <button type="submit" id="generateButton" disabled={!areAllfieldPresent}>{showLoader ? <div className="loader" /> : "Create Payment Link" }</button>
          </div>
        </form>
        {isopen ?
          <div>
            <p id="invoiceLink"></p>
            <div id="overlay"></div>
            <div id="modal">
              <button id="closeModalButton" onClick={() => {
                setIsOpen(false);
                setFormData({
                  amount: '',
                  eventDate: '',
                  description: '',
                  customerCompany: '',
                  companyContact: '',
                  customerName: ''
                });
              }}>
                <svg width="20px" height="20px" viewBox="0 0 0.6 0.6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M0.132 0.132a0.025 0.025 0 0 1 0.035 0L0.3 0.265l0.132 -0.132a0.025 0.025 0 1 1 0.035 0.035L0.335 0.3l0.132 0.132a0.025 0.025 0 0 1 -0.035 0.035L0.3 0.335l-0.132 0.132a0.025 0.025 0 0 1 -0.035 -0.035L0.265 0.3 0.132 0.168a0.025 0.025 0 0 1 0 -0.035z"
                    fill="#0D0D0D" />
                </svg>
              </button>

              {/* Modal */}
              <div className="content">
                <h3 className="payment-heading">Payment Request Created.</h3>
                <p className="copy-link">Copy the link below and share with your client.</p>
                <div className="copy-input">
                  <input id='link' value={link} />
                  <button className="copy-link-button" onClick={handleCopyLink}>
                    <svg className='svgLink' width="25px" height="25px" viewBox="0 0 0.5 0.5" xmlns="http://www.w3.org/2000/svg" fill="#000000"><path fillRule="evenodd" clipRule="evenodd" d="M0.138 0.094h0.096a0.106 0.106 0 0 1 0.106 0.106v0.006A0.106 0.106 0 0 1 0.234 0.313H0.219V0.281h0.015A0.075 0.075 0 0 0 0.309 0.207V0.2A0.075 0.075 0 0 0 0.234 0.125H0.138A0.075 0.075 0 0 0 0.063 0.2v0.006A0.075 0.075 0 0 0 0.125 0.28v0.031a0.106 0.106 0 0 1 -0.094 -0.105V0.2A0.106 0.106 0 0 1 0.138 0.094zM0.375 0.22v-0.031a0.106 0.106 0 0 1 0.094 0.105v0.006A0.106 0.106 0 0 1 0.363 0.406h-0.097A0.106 0.106 0 0 1 0.16 0.3V0.294A0.106 0.106 0 0 1 0.266 0.188H0.281v0.031h-0.015A0.075 0.075 0 0 0 0.191 0.294v0.006A0.075 0.075 0 0 0 0.266 0.375h0.097A0.075 0.075 0 0 0 0.438 0.3V0.294a0.075 0.075 0 0 0 -0.063 -0.074z" /></svg>
                    Copy Link
                  </button>
                </div>
                <div className="notification-text">
                  You’ll get a notification when your client has paid.
                  <p className={"anotherPaymentRequest"} onClick={()=> window && window.location.reload()}>Start another payment request</p>
                </div>
              </div>
            </div>
          </div> : null}
      </div>
    </div>
  );
}

export default App;
