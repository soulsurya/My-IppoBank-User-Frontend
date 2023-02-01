import React from "react";
import css from "./Home.module.css";
import { Outlet, Link, BrowserRouter as Router } from "react-router-dom";
import logoImage from "./../../assets/logo.png";
import piggyBank from "./../../assets/bankImage.png";
const Home = () => {
  return (
    <div className={css.hero}>
      <nav className={css.nav}>
        <ul className={css.links}>
          <li>
            <Link to="/">
              <img src={logoImage} />
            </Link>
          </li>
          <ul className={css.rightLinks}>
            <li>
              <Link to="/sign-in">Sign In</Link>
            </li>
            <li>
              <Link to="/create-account">Create Account</Link>
            </li>
            <li>
              <Link to="/apply-loan">Apply Loan</Link>
            </li>
          </ul>
        </ul>
      </nav>
      <section className={css.container}>
        <div className={css.titleContainer}>
          <h3 className={css.subTitle}>Making Banking Simpler for you</h3>
          <h1 className={css.title}>
            Banking API for Fund Transfer, UPI, Payouts & Virtual Account
          </h1>
          <div className={css.cta}>
            <Link to="/create-account">
              <span className={css.ctaText}>Create Account</span>
            </Link>
          </div>
        </div>
        <div className={`${css.heroImageContainer} is-hidden-mobile`}>
          <img className={css.heroImage} src={piggyBank} alt="Ippo pay Bank" />
        </div>
      </section>
    </div>
  );
};

export default Home;
