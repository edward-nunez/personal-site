import React, { Component } from 'react';
import { ProjectCard } from '../../components/ProjectCard';
import { GeneralCard } from '../../components/GeneralCard';

export default class Home extends Component {
    render() {
        return (
          <React.Fragment>
            <div className='portfolio-header portfolio-blog__posts mdl-grid'>
              <GeneralCard>
              <div class="mdl-card__supporting-text">
                <a href="https://github.com/dotRollen"><span class="mdl-chip mdl-chip--contact">
                  <span class="mdl-chip__contact mdl-color--purple mdl-color-text--white"><i class="fab fa-github"></i></span>
                  <span class="mdl-chip__text">Github</span>
                </span></a>&nbsp;
                <a href="https://www.linkedin.com/in/edwardnunez/"><span class="mdl-chip mdl-chip--contact mdl-chip--deletable">
                    <span class="mdl-chip__contact mdl-color--blue mdl-color-text--white"><i class="fab fa-linkedin"></i></span>
                    <span class="mdl-chip__text">LinkedIn</span>
                </span></a>
              </div>
              </GeneralCard>
            </div>
            <div className='portfolio-blog__posts mdl-grid'>
              <ProjectCard />
              <ProjectCard />
              <ProjectCard />
              <ProjectCard />
            </div>
         </React.Fragment>
        );
    };
}
