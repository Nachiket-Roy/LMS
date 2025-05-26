import React from 'react';

const Stats = () => {
  const stats = [
    { label: 'Users', value: '100+' },
    { label: 'Books', value: '600+' },
    { label: 'Categories', value: '10+' },
  ];

  return (
    <section className="w-full pt-4 mb-10">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Our Impact</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
            >
              <p className="text-4xl font-extrabold text-green-600 mb-2">
                {stat.value}
              </p>
              <p className="text-lg font-medium text-gray-700">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
