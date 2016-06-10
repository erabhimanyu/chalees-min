import React from 'react';
import ReactDom from 'react-dom';
import pify from 'pify';
import ImageResponse from './image-response.js';
import TextResponse from './text-response.js';
import VideoInstruction from './video-instruction.js';
import LearningItem from './learning-item.js';
import HomePage from './home-page.js';
import Header from './header.js';
import * as data from './data.js';
import chapters from './chapter-data.js';

const Chapter = React.createClass({
  getInitialState: () => ({}),
  componentDidMount: function() {
    console.log('mounted chapter component');
    this.setState({
      chapterId: this.props.params.id
    });
    
    const learningItems = [...ReactDom.findDOMNode(this).querySelectorAll('.learning-item')]
      .map(item => ({
        top: item.offsetTop,
        node: item
      }));
    
    let recentlyScrolled = false;
    let focusedLearningItem = null;
    
    this.scrollListener = () => recentlyScrolled = true;
    
    window.addEventListener('scroll', this.scrollListener);
    
    function updateFocusedLearningItem() {
      recentlyScrolled = false;
      const scrollTop = window.pageYOffset;
      
      let focusedItem = null;
      let index = 0;
      while (focusedItem === null && index < learningItems.length) {
        // If the item is the topmost one in the page (with a UX allowance
        // so part of the item can be scrolled past while still considering
        // it in focus)
        if (learningItems[index].top > scrollTop - 150) {
          focusedItem = learningItems[index];
        } else {
          index += 1;            
        }
      }
      
      if (focusedItem && focusedLearningItem !== focusedItem) {
        focusedLearningItem = focusedItem;
        learningItems.map(item => item.node.classList.remove('focused'));
        focusedLearningItem.node.classList.add('focused');
      }
    }
    
    this.scrollCheckInterval = window.setInterval(() => {
      if (recentlyScrolled) {
       updateFocusedLearningItem()
      }
    }, 100);
    
    updateFocusedLearningItem();
  },
  componentWillUnmount: function () {
    window.clearInterval(this.scrollCheckInterval);
    window.removeEventListener(this.scrollListener);
  },
  render: function() {
    // Use the magnets chapter if there isn't existing dummy data for the given one
    const currentChapter = chapters[this.state.chapterId] || chapters[13];
    
    return (
      <div>
        <main id="main" className="container chapter">
          <div className="pure-g">
            <div className="pure-u-1">
              {(currentChapter.items || []).map((item, index) => (
                <LearningItem key={index} {...item} />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }
});

export default Chapter;