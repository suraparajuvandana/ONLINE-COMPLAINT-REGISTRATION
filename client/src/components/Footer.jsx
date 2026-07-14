import '../assets/css/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>
        &copy; {new Date().getFullYear()} Complaint Management System. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
