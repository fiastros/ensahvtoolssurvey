
## Table of Contents
- [Table of Contents](#table-of-contents)
- [Description](#description)
- [Installation](#installation)
  - [Run Locally](#run-locally)
- [Cite](#cite)
- [ToDo](#todo)


## Description
So I basically vibe-coded this survey web application for my student to use for his data collection. He is a student is Master 2. 

I'm currently hosting the app for my student to use it. so if you want to take a look at it: [Netlify](https://ensahv-m2-questionnaire.netlify.app/)

Here a couple of screenshots of the app: 

<p align="center">
  <img src="docs/premier.jpeg" width="32%" />
  <img src="docs/troisieme.jpeg" width="32%" />
  <img src="docs/quatrieme.jpeg"  width="32%" />
</p>


## Installation

you need have npm installed or you can setup a docker (i didn't provide an image so you would need to set it up yourself.)

Using npm (installed on your machine):
   ### Run Locally

   **Prerequisites:**  Node.js

   1. Install dependencies: 
   ```bash
      npm install
   ```   
   2. Run the app:
   ```bash
      npm run dev
   ```
   3. Run build and deploy app
   ```bash
      npm run build
   ```

   you can then export the /dist folder in the all-in-one hosting website like github, netlify, ...


## Cite

If you use this tool for anything (academic, tool, commercial), please cite it as:

```bibtex
@software{toolname2026,
  author = {Dr EYANGO TABI, T. G. Loic},
  title = {ENSAHV-tools-survey},
  year = {2026},
  url = {https://github.com/fiastros/ensahv-tools-survey}
}
```


## ToDo

- [x] Write the complete documentation of the application and repo 
- [x] Correct beugs in saving the .csv
- [ ] Check the validity of some questions (floats, strings...)
- [x] Add a "clear current entries" to clear currently cached or all saved data entries in the .csv ?
- [x] Add a license to the repo: they only need to cite us if they use our work.
- [ ] Commit to github 
