import React, { useState } from 'react';

const faqs = [
  {
    question: 'How do I borrow a book?',
    answer:
      'You can borrow books by logging into your account, searching the catalog, and clicking the "Borrow" button on available books.',
  },
  {
    question: 'What is the borrowing period?',
    answer: 'The standard borrowing period is 14 days, with possible renewals if no holds exist.',
  },
  {
    question: 'How can I renew my borrowed books?',
    answer:
      'Renewals can be done online via your account dashboard before the due date or by contacting the library.',
  },
  {
    question: 'What happens if I return a book late?',
    answer:
      'Late returns may incur fines. You will be notified via email and can pay fines online or at the library.',
  },
  {
    question: 'Can I reserve a book that is currently checked out?',
    answer:
      'Yes, you can place a hold/reservation on books that are unavailable. You will be notified when it is ready for pickup.',
  },
];

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row items-center justify-center p-6 gap-12">
      {/* Illustration */}
      <div className="max-w-md hidden md:block">
        <img
          src="/vector/faq.svg"
          alt="Support illustration"
          className="w-full max-w-sm"
        />
      </div>

      {/*  FAQ */}
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">

        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Frequently Asked Questions</h3>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-gray-200 pb-3 cursor-pointer">
              <h4
                onClick={() => toggleFAQ(i)}
                className="flex justify-between items-center text-gray-900 font-medium"
              >
                {faq.question}
                <span>{openIndex === i ? '−' : '+'}</span>
              </h4>
              {openIndex === i && <p className="mt-2 text-gray-700">{faq.answer}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQs;
