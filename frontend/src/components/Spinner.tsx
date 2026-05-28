const Spinner = ({ message = "Loading..." }: { message?: string }) => (
  <div className="page-shell">
    <div className="spinner" />
    <p>{message}</p>
  </div>
);

export default Spinner;
