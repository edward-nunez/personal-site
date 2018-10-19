import React, { Component } from 'react';
import { ProjectCard } from '../../components/ProjectCard';
import { GeneralCard } from '../../components/GeneralCard';

const projects = [
  {
    projectName: 'Project Clicky',
    language: 'Javascript',
    githubLink: 'https://github.com/dotRollen/clicky',
    bgImage: '/images/projects/clicky.png'
  },
  {
    projectName: 'Project Scraper',
    language: 'Javascript',
    githubLink: 'https://github.com/dotRollen/scraper',
    bgImage: '/images/projects/scraper.png'
  },
  {
    projectName: 'Project Crypto',
    language: 'Javascript',
    githubLink: 'https://github.com/dotRollen/crypto',
    bgImage: '/images/projects/javascript.png'
  },
  {
    projectName: 'Project Burger',
    language: 'Javascript',
    githubLink: 'https://github.com/dotRollen/burger-sequel',
    bgImage: '/images/projects/burger.png'
  },
  {
    projectName: 'Project Friend Finder',
    language: 'Javascript',
    githubLink: 'https://github.com/dotRollen/friend-finder',
    bgImage: '/images/projects/friendfinder.png'
  },
  {
    projectName: 'Project bAmazon',
    language: 'Javascript',
    githubLink: 'https://github.com/dotRollen/cli-bamazon',
    bgImage: '/images/projects/bamazon.png'
  },
  {
    projectName: 'Project Word Guess',
    language: 'Javascript',
    githubLink: 'https://github.com/dotRollen/word-guess-cli',
    bgImage: '/images/projects/javascript.png'
  },
  {
    projectName: 'Project LIRI Bot',
    language: 'Javascript',
    githubLink: 'https://github.com/dotRollen/liri-bot',
    bgImage: '/images/projects/javascript.png'
  },
  {
    projectName: 'Project SuperDens',
    language: 'Javascript',
    githubLink: 'https://github.com/TeamSEND/ProjectSuperDens',
    bgImage: '/images/projects/superdens.png'
  },
  {
    projectName: 'Project Janken Joust',
    language: 'Javascript',
    githubLink: 'https://github.com/dotRollen/janken-joust',
    bgImage: '/images/projects/jankenjoust.png'
  },
  {
    projectName: 'Project Giphy',
    language: 'Javascript',
    githubLink: 'https://github.com/dotRollen/giphy',
    bgImage: '/images/projects/giphy.png'
  },
  {
    projectName: 'Project Trivia Game',
    language: 'Javascript',
    githubLink: 'https://github.com/dotRollen/trivia-game',
    bgImage: '/images/projects/triviaGame.png'
  },
  {
    projectName: 'Project Hangman Game',
    language: 'Javascript',
    githubLink: 'https://github.com/dotRollen/Hangman-Game',
    bgImage: '/images/projects/hangman.png'
  },

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
              <div className="mdl-card__supporting-text mdl-color-text--white">
                Hello! My name is Edward Nunez, I'm a Full Stack Developer full time and as hobby.
                I have a diverse set of skills, ranging from UI/UX (React.js), backend (Python, Node.js and C++)
                and all the way down to the database ( PostgreSQL, MongoDB, FireBase ). As well as infrastructure
                automation on Linux servers.
              </div>
              </GeneralCard>
            </div>
            <div className='portfolio-blog__posts mdl-grid'>
              <h1 className='portfolio-title'><b>PROJECTS:</b></h1>
            </div>
            <div className='portfolio-blog__posts mdl-grid'>
              { projects.map( project => <ProjectCard {...project} />) }
            </div>
         </React.Fragment>
        );
    };
}
