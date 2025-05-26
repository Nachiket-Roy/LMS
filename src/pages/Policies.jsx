import React from 'react';

const Policies = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row items-center justify-center p-6 gap-12 ">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full">
        <h1 className="text-4xl font-bold mb-8 text-purple-900">Library Policies</h1>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">Borrowing Policy</h2>
          <p className="text-gray-700">
            Members may borrow up to 5 books at a time for a period of 14 days. Books can be renewed once,
            provided no other member has requested the book.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">Late Returns & Fines</h2>
          <p className="text-gray-700">
            Books returned after the due date will incur a fine of &#x20B9;10 per day per book. Members
            must settle fines before borrowing new books.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">Reservation Policy</h2>
          <p className="text-gray-700">
            No Reservation Policy.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">Code of Conduct</h2>
          <p className="text-gray-700">
            Users are expected to maintain a respectful and quiet environment. Damage or loss of library
            materials must be reported, and members may be held responsible for replacement costs.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Privacy Policy</h2>
          <p className="text-gray-700">
            The library respects your privacy. Personal information is used solely for membership and
            borrowing purposes and is not shared with third parties without consent.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Policies;
