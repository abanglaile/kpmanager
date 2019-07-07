import React from 'react';
import PropTypes from 'prop-types';
import KaTeX from 'katex';

const createKatexComponent = (Component, { displayMode }) => {
  class MathComponent extends React.Component {
    constructor(props) {
      super(props);
      // console.log("props.content:",JSON.stringify(props));
      this.usedProp = props.content ? 'content' : 'children';
      // console.log("this.usedProp:",this.usedProp);
      this.state = this.createNewState(null, props);
    }

    componentWillReceiveProps() {
      this.setState(this.createNewState);
    } 

    shouldComponentUpdate(nextProps) {
      return nextProps[this.usedProp] !== this.props[this.usedProp];
    }

    createNewState(prevState, props) {
      try {
        const html = this.generateHtml(props);

        return { html, error: undefined };
      } catch (error) {
        if (error instanceof KaTeX.ParseError || error instanceof TypeError) {
          return { error };
        }

        throw error;
      }
    }

    generateHtml(props) {
      // console.log("generateHtml props:",JSON.stringify(props));
      // console.log("this.usedProp:",this.usedProp);
      const { errorColor, renderError, content } = props;
      var htmlContent = null;
      // var content = props[this.usedProp];
      console.log("content:",content);
      if(content){
          console.log("content:",content);
          htmlContent = content.replace(/(\$.*?\$)/g, function(word){
          //去掉首尾两个$
          word = word.substring(1, word.length - 1);
          var res = KaTeX.renderToString(word, {
              displayMode,
              errorColor,
              throwOnError: !!renderError
          });
          return res;
        });
      
        return htmlContent;
      }
    //   return KaTeX.renderToString(props[this.usedProp], {
    //     displayMode,
    //     errorColor,
    //     throwOnError: !!renderError
    //   });
    }

    render() {
      const { error, html } = this.state;
      const { renderError } = this.props;

      if (error) {
        return renderError ? (
          renderError(error)
        ) : (
          <Component html={`${error.message}`} />
        );
      }

      return <Component html={html} />;
    }
  }

  MathComponent.propTypes = {
    children: PropTypes.string,
    errorColor: PropTypes.string,
    math: PropTypes.string,
    renderError: PropTypes.func
  };

  return MathComponent;
};

export default createKatexComponent;