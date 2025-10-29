import React from "react";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#0b0f1a] text-gray-400 py-10 px-6 border-t border-gray-800">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-xl font-semibold text-white">CodeHub</h2>
          <p className="text-sm mt-2 text-gray-500">
            Code. Learn. Innovate. © {new Date().getFullYear()}
          </p>
          <p className="text-sm mt-2 text-gray-500">Made with ❤️ by Bhavesh Tripathi</p>
        </div>
        <div className="flex gap-6">
          <a href="https://github.com/bhaveshTripathi3112" target="_blank" rel="noreferrer" className="hover:text-white">
            <Github />
          </a>
          <a href="https://linkedin.com/in/bhavesh-tripathi-a69483309/" target="_blank" rel="noreferrer" className="hover:text-white">
            <Linkedin />
          </a>
          <a href="https://twitter.com/" target="_blank" rel="noreferrer" className="hover:text-white">
            <Twitter />
          </a>
          <a href="mailto:bhaveshtripathi3112@gmail.com" className="hover:text-white">
            <Mail />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
