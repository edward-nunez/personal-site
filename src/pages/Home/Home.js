import React, { Component } from 'react';
import { ProjectCard } from '../../components/ProjectCard';
import { GeneralCard } from '../../components/GeneralCard';

const projects = [
  {
    projectName: 'Project Burger',
    language: 'Javascript',
    githubLink: 'https://github.com/dotRollen/burger',
    bgImage: '/images/projects/burger.png'
  }
];

export default class Home extends Component {
    render() {
        return (
          <React.Fragment>
            <div className='portfolio-header portfolio-blog__posts mdl-grid'>
              <GeneralCard>
              <div className="mdl-card__supporting-text">
                <a href="https://github.com/dotRollen"><span className="mdl-chip mdl-chip--contact">
                  <span className="mdl-chip__contact mdl-color--purple mdl-color-text--white"><i className="fab fa-github"></i></span>
                  <span className="mdl-chip__text">Github</span>
                </span></a>&nbsp;
                <a href="https://www.linkedin.com/in/edwardnunez/"><span className="mdl-chip mdl-chip--contact mdl-chip--deletable">
                    <span className="mdl-chip__contact mdl-color--blue mdl-color-text--white"><i className="fab fa-linkedin"></i></span>
                    <span className="mdl-chip__text">LinkedIn</span>
                </span></a>
              </div>
              </GeneralCard>
            </div>
            <div className='portfolio-blog__posts mdl-grid'>
              { projects.map( project => <ProjectCard {...project} />) }
            </div>
         </React.Fragment>
        );
    };
}
