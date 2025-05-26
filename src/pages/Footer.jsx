import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#1F2937] text-white pt-10 pb-6 mt-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">

          {/* About Us */}
          <div>
            <h5 className="uppercase mb-4 font-bold text-yellow-400">About Us</h5>
            <p className="text-sm text-gray-300">
              
            </p>
          </div>

          {/* FAQs */}
          <div>
            <h5 className="uppercase mb-4 font-bold text-yellow-400">FAQs</h5>
            <ul className="space-y-2 text-sm text-gray-200">
              <li><a href="#!" className="hover:text-yellow-300 transition">Help Center</a></li>
              <li><a href="#!" className="hover:text-yellow-300 transition">Contact Us</a></li>
              <li><a href="#!" className="hover:text-yellow-300 transition">Cancellation Policy</a></li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h5 className="uppercase mb-4 font-bold text-yellow-400">Follow Us</h5>
            <div className="flex justify-center md:justify-start gap-5 text-xl">
              <a href="https://facebook.com" className="hover:text-yellow-300 transition">
                <FaFacebookF />
              </a>
              <a href="https://twitter.com" className="hover:text-yellow-300 transition">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" className="hover:text-yellow-300 transition">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" className="hover:text-yellow-300 transition">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-600" />

        <div className="text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} VIAFlight. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
