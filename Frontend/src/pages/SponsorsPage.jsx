// Groups sponsors by tier using .filter() on the data from data/sponsors.js

import { sponsors } from '../data/sponsors';        // import the full sponsors array from the data folder

export default function SponsorsPage() {

  // Filter sponsors by tier
  const platinum = sponsors.filter(s => s.tier === "platinum");
  const gold     = sponsors.filter(s => s.tier === "gold");
  const silver   = sponsors.filter(s => s.tier === "silver");
  const bronze   = sponsors.filter(s => s.tier === "bronze");

  return (
    <main>
      <h1>Our Sponsors</h1>

      {/* Platinum tier — Logo size: Large+, Company Blurb: Yes */}
      <section>
        <div>
          {platinum.map((sponsor, index) => (
            <div key={index} className="sponsor-card platinum">
              <a href={sponsor.url} target="_blank" rel="noreferrer">
                <img src={sponsor.logo} alt={sponsor.name} data-size="large-plus" />
              </a>
              {sponsor.companyBlurb && (
                <p className="company-blurb">{sponsor.companyBlurb}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Gold tier — Logo size: Large, Company Blurb: Yes */}
      <section>
        <div>
          {gold.map((sponsor, index) => (
            <div key={index} className="sponsor-card gold">
              <a href={sponsor.url} target="_blank" rel="noreferrer">
                <img src={sponsor.logo} alt={sponsor.name} data-size="large" />
              </a>
              {sponsor.companyBlurb && (
                <p className="company-blurb">{sponsor.companyBlurb}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Silver tier — Logo size: Medium, Company Blurb: Yes */}
      <section>
        <div>
          {silver.map((sponsor, index) => (
            <div key={index} className="sponsor-card silver">
              <a href={sponsor.url} target="_blank" rel="noreferrer">
                <img src={sponsor.logo} alt={sponsor.name} data-size="medium" />
              </a>
              {sponsor.companyBlurb && (
                <p className="company-blurb">{sponsor.companyBlurb}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bronze tier — Logo size: Small, Company Blurb: No */}
      <section>
        <div>
          {bronze.map((sponsor, index) => (
            <div key={index} className="sponsor-card bronze">
              <a href={sponsor.url} target="_blank" rel="noreferrer">
                <img src={sponsor.logo} alt={sponsor.name} data-size="small" />
              </a>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}