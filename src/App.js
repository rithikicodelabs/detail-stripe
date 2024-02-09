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
  const handleCopyLink = async (e) => {
    try {
      await navigator.clipboard.writeText(link);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Unable to copy link: ', err);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target || {};
    setFormData({
      ...formData,
      [name]: value
    });
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    // action
    const { amount, customerName, description } = formData
    fetch('https://zbryjx4e2c.execute-api.us-east-2.amazonaws.com/prod/stripe2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount,
        customerName: customerName,
        description: description,
        success_url: 'https://example.com/success', // Replace with actual success URL
        cancel_url: 'https://example.com/cancel', // Replace with actual cancel URL
      })
    })
      .then(response => response.json())
      .then(data => {
        // Display the Stripe payment link
        if (data && data.paymentLink) {
          const generateButton = document.getElementById('generateButton');
          generateButton.innerText = 'View Invoice';
          generateButton.onclick = function () {
            window.open(data.paymentLink, '_blank');
          };
          setIsOpen(true);
          SetLink(data.paymentLink)
        } else {
          // Handle any errors that don't throw an exception but result in no link
          document.getElementById('invoiceLink').innerText = 'Error generating invoice. No payment link was returned.';
        }
      })
      .catch(error => {
        console.error('Error:', error);
        document.getElementById('invoiceLink').innerText = 'Error generating invoice.';
      });
    // Reseting the form
    // setFormData({
    //   amount: '',
    //   eventDate: '',
    //   description: '',
    //   customerCompany: '',
    //   companyContact: '',
    //   customerName: ''
    // });
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
        <form id="invoiceForm" onSubmit={handleSubmit}>
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
                class="textbox-n"
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

          <input type="text" id="customerName" name="customerName" onChange={handleInputChange} value={formData.customerName} placeholder="Customer Name" />

          <div className="button-container">
            <button type="submit" id="generateButton" disabled={!areAllfieldPresent}>CREATE PAYMENT LINK</button>
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
              <div className="content">
                <h3 className="payment-heading">Payment Request Created.</h3>
                <p className="copy-link">Copy the link below and share with your client.</p>
                <div className="copy-input">
                  <input id='link' value={link} />
                  <button className="copy-link-button" onClick={handleCopyLink}>
                    Copy Link
                  </button>
                </div>
                <div className="notification-text">
                  You’ll get a notification when your client has paid.
                </div>
              </div>
            </div>
          </div> : null}
      </div>
    </div>
  );
}

export default App;
