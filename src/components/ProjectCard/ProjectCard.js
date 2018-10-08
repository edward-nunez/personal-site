import React from 'react';

export const ProjectCard = () => {
    return (
      <div class="mdl-card something-else mdl-cell mdl-cell--8-col mdl-cell--4-col-desktop">
        <div class="mdl-card__media mdl-color--white mdl-color-text--grey-600">
          <img src="images/logo.png" alt="logo" />
          +1,337
        </div>
        <div class="mdl-card__supporting-text meta meta--fill mdl-color-text--grey-600">
          <div>
            <strong>The Newist</strong>
          </div>
        </div>
      </div>
    );
}
