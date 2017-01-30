import React from 'react';

/*
  UI components and styles
*/

const Styles = {
  colors: {
    orange: `btn-danger`,
    green: `btn-success`,
    red: `btn-warning`,
    white: `btn-default`
  },
  btn: `btn navbar-btn btn-sm text-uppercase`,
  btnGroup: `btn-group`,
  navbarRow: `row bg-primary`,
  navbar: `col-md-8 col-sm-8 col-lg-8 col-xs-12`,
  bannerRow: `row hidden-xs`,
  banner: `page-header text-center`,
  bannerTitle: `text-primary text-capitalize text-nowrap`,
  monitor: `col-xs-12 col-sm-6 col-md-6 col-lg-6 well`,
  footer: `row bg-primary text-center`,
}

const externalLinks = {
  github: `https://github.com/AdelMahjoub`,
  freeCodeCamp: `https://www.freecodecamp.com/adelmahjoub`,
  githubIcon: `fa fa-github`,
  freeCodeCampIcon: `fa fa-fire`
}

const Link = function(props) {
  return (
    <a href={props.link} target="_blank">
        <span className={props.icon}></span>
    </a>
  );
}

const Button = function (props) {
  return (
    <button
    className={`${Styles.btn} ${props.color}`}
    >
      {props.name}
    </button>
  )
}

const ButtonsGroup = function(props) {
  return (
    <div className={Styles.btnGroup}>
      {props.children}
    </div>
  )
}

const Navbar = function(props) {
  return (
    <div className={Styles.navbarRow} onClick={props.handleClick}>
      <div className={Styles.navbar}>
        {props.children}
      </div>
    </div>
  )
}

const Banner = function(props) {
  return (
    <div className={Styles.bannerRow}>
      <div className={Styles.banner}>
        <h1 className={Styles.bannerTitle}>
          {props.appName}
        </h1>
      </div>
    </div>
  )
}

const HorizontalSplitter = function(props) {
  return (
    <div className="row">
      <hr/>
    </div>
  )
}

const Monitor = function(props) {
  return (
    <div className={Styles.monitor}>
        <span>{props.name}</span>
        <span className={props.color}>{` ${props.data}`}</span>
    </div>
  );
}

const Footer = function(props) {
  return(
    <div className={Styles.footer}>
    <Button
    name={
      <Link link={externalLinks.github} icon={externalLinks.githubIcon}/>
    }
    />
    {" "}
    <Button
    name={
      <Link link={externalLinks.freeCodeCamp} icon={externalLinks.freeCodeCampIcon}/>
    }
    />
  </div>
  );
}

export {
  Button,
  ButtonsGroup,
  Navbar,
  Banner,
  HorizontalSplitter,
  Monitor,
  Footer,
  Styles
}