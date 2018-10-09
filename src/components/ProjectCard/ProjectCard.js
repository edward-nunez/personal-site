import React from 'react';

export const ProjectCard = ({ bgImage, githubLink, projectName, language }) => {
    return (
      <div className="mdl-card project-card something-else mdl-cell mdl-cell--8-col mdl-cell--4-col-desktop">
        <div className="mdl-card__media mdl-color--white mdl-color-text--grey-600" style={{backgroundImage: `url('${bgImage}')` }}>
        </div>
        <div className="mdl-card__supporting-text meta meta--fill mdl-color-text--white">
          <a href={githubLink} className="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect">
            Github
          </a>
          {projectName}
          Language: {language}
        </div>
      </div>
    );
}
