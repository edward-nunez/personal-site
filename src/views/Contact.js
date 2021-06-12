import React from "react";

export default function Home() {
  return (
    <>
      <div
        className="col-lg-6 col-sm-12 row"
        style={{ marginBottom: "10px", fontSize: "18px" }}
      >
        <div className="col-12">
          <h2>Contact</h2>
        </div>
        <div className="col-12">
          <form>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Name"
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                id="exampleFormControlInput1"
                placeholder="Email"
              />
            </div>
            <div className="form-group">
              <textarea
                className="form-control"
                id="message"
                rows="3"
                placeholder="Your Message"
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary mb-2">
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
