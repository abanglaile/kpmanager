import React from 'react';
import PropTypes from 'prop-types';
import createKatexComponent from './createKatexComponent';

const Tex = ({ html }) => {
//   console.log("html:::",html);
  return <span dangerouslySetInnerHTML={{__html: html}} />;
};

Tex.propTypes = {
  html: PropTypes.string.isRequired
};

export default createKatexComponent(Tex, { displayMode: false });