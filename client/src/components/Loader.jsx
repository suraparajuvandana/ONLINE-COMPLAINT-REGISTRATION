import '../assets/css/Loader.css';

const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader-spinner" role="status" aria-label="Loading" />
    </div>
  );
};

export default Loader;
