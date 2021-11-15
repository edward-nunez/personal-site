import React from "react";
import ContactForm from "../components/sections/ContactForm";

export default function Home() {
  return (
    <div className="row">
      <div className="col-md-8 mx-auto">
        <article className="card mb-4" style={{ border: "none" }}>
          <header
            className="card-header text-center"
            style={{ backgroundColor: "#fff" }}
          >
            <h1 className="card-title">Reach Out</h1>
          </header>
          <div className="card-body">
            <p>
              <strong>
                Disciplined in test driven development, simple design,
                refactoring and metaphorical thinking and eight years of
                professional IT experience. Proven skills in scoping project
                requirements, solutions design, and identifying issues with
                rapid repair and redesign.
              </strong>
            </p>
            <p>
              I count myself fortunate that what I do for a living is also my
              passion and hobby. I genuinely enjoy building, while also teaching
              others. With that said these are some of the qualities you can
              expect from me on your project!
            </p>
            <ContactForm />
          </div>
        </article>
      </div>
    </div>
  );
}
